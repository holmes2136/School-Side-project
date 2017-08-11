/*
 * The contents of this file are subject to the terms 
 * of the Common Development and Distribution License 
 * (the License).  You may not use this file except in
 * compliance with the License.
 * 
 * You can obtain a copy of the license at 
 * https://glassfish.dev.java.net/public/CDDLv1.0.html or
 * glassfish/bootstrap/legal/CDDLv1.0.txt.
 * See the License for the specific language governing 
 * permissions and limitations under the License.
 * 
 * When distributing Covered Code, include this CDDL 
 * Header Notice in each file and include the License file 
 * at glassfish/bootstrap/legal/CDDLv1.0.txt.  
 * If applicable, add the following below the CDDL Header, 
 * with the fields enclosed by brackets [] replaced by
 * you own identifying information: 
 * "Portions Copyrighted [year] [name of copyright owner]"
 * 
 * Copyright 2006 Sun Microsystems, Inc. All rights reserved.
 */

/**
 * Database library module.
 */

library.common.define(library, "db", function() {
    var derbyService = globals.services.derby;
    var log = library.log.get("framework.db");
    
    /**
     * Connect to a datasource. If the argument is  string, it is assumed to
     * be the datasource name. If it is undefined, 
     *
     * @param(obj, string or object, optional)
     *   if a string, the datasource name;
     *   if an object, it is treated as keyword arguments; if undefined,
     *   the default datasource name is the one specified by
     *   ``application.options.database.preferred``.
     *
     * @kparam(name, string, optional) datasource name
     * @kparam(username, string, optional) user name
     * @kparam(password, string, optional) password
     * @return(java object) a JDBC connection
     *
     * Data sources must be configured at startup under application.datasource.
     *
     * Here's a sample datasource declaration:
     *
     * {{{
     *   application.datasource.mydb = {
     *       dataSourceClassName: "org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource",
     *       username: "scott",
     *       password: "tiger",
     *       properties: {
     *           loginTimeout: 50,
     *           someOtherProperty: "foo"
     *       }
     *   }
     * }}}
     *
     * In this example, the name of the datasource is "mydb". The "username" and "password" 
     * properties are optional. Anything under "properties" is considered a property of the data
     * source object, to be set at initialization time. For instance, the
     * {{{
     *     loginTimeout: 50
     * }}}
     * property results in the setLoginTimeout method to be called with 50 as an argument.
     *
     */
    this.connect = function(obj) {
        log.trace("db.connect");
        var datasourceName, username, password;
        if (obj == undefined) {
            datasourceName = application.options.database.preferred;
        }
        else {
            datasourceName = obj.name;        
            username = obj.username;
            password = obj.password;
        }
        if (datasourceName == undefined) {
            if (log.errorEnabled) {
                log.error("db.connect: no datasource name specified");
            }
            throw new Error("no datasource name specified");
        }
        var datasourceObj = application.datasource[datasourceName];
        if (datasourceObj == undefined) {
            if (log.errorEnabled) {
                log.error("db.connect: unknown datasource " + datasourceName);
            }
            throw new Error("unknown datasource: " + datasourceName);
        }
        var dataSource = datasourceObj.dataSource;
        if (dataSource == undefined) {
            if (log.errorEnabled) {
                log.error("db.connect: datasource not initialized: " + datasourceName);
            }
            throw new Error("datasource not initialized: " + datasourceName);
        }
        if (username == undefined) {
            username = datasourceObj.username;
        }
        if (password == undefined) {
            password = datasourceObj.password;
        }
        if (library.lang.isString(username) && library.lang.isString(password)) {
            return dataSource.getConnection(username, password);
        }
        else {
            return dataSource.getConnection();
        }
    }
    
    /**
     * Initialize a datasource object.
     *
     * @kparam(dataSourceClassName, string, required)
     *   name of the Java datasource class
     * @kparam(properties, object, optional)
     *   an object whose properties are set on the datasource
     * @return(undefined)
     */
    this.initialize = function(obj) {
        log.trace("db.initialize");
        if (obj.dataSource != undefined) {
            // already initialized
            return;
        }
        var dataSource = new (library.common.resolve(obj.dataSourceClassName, Packages))();
        var properties = obj.properties;
        if (library.lang.isObject(properties)) {
            for (var p in properties) {
                var value = properties[p];
                if (value != undefined) {
                    dataSource[p] = value;
                }
            }
        }
        obj.dataSource = dataSource;
    }
        
    /**
     * Shutdown the embedded derby database.
     *
     * @return(undefined)
     */
    this.shutdown = function() {
        log.trace("db.shutdown");
        return derbyService.shutdown();
    }

    /**
     * Execute the given function making sure to close the specified
     * database-related object once it returns.
     *
     * @param(dbobject, object, required)
     *   an object with a close method, like a Connection, a Statement or a ResultSet
     * @param(fn, function, required)
     *   a function to be executed
     * @return(object)
     *   the value returned by the function
     */    
    this.using = function(dbobject, fn) {
        log.trace("db.using");
        try {
            return fn();
        }
        finally {
            if (dbobject != undefined) {
                dbobject.close();
            }
        }
    }

    /**
     * SQL helper class. It encapsulates a connection object and offers
     * several utility methods to simplify using SQL.
     *
     * You can create an instance by doing any of the following:
     *
     * {{{
     *   var db = new library.db.SqlHelper();
     *   var db = new library.db.SqlHelper("datasource");
     *   var db = new library.db.SqlHelper({name: "datasource"});
     * }}}
     * 
     * See [[library.db.connect|#connect]] for an explanation of the constructor arguments.
     *
     */
    this.SqlHelper = library.lang.createClass();
    
    this.SqlHelper.prototype.initialize = function(obj) {
        log.trace("db.SqlHelper.initialize");
        this.connection = library.db.connect(obj);
    };

    /**
     * Close this SQL helper.
     *
     * @return(undefined)
     */
    this.SqlHelper.prototype.close = function() {
        log.trace("db.SqlHelper.close");
        this.connection.close();
    };

    /**
     * Perform a transaction (a function).
     *
     * @param(fn, function, required)
     *    the function to be executed as a transaction
     *
     * @kreturn(succeeded, boolean, required)
     *    true if the transaction committed successfully, false otherwise
     * @kreturn(failed, boolean, required)
     *    the opposite of succeeded
     * @kreturn(cause, object, optional)
     *    the exception that caused the rollback,
     *    if any, or the the argument passed to the [[abort|#SqlHelper$abort]] function call
     *    that caused the transaction to be rolled back; not present if the
     *    transaction succeeded
     */
    this.SqlHelper.prototype.transaction = function(fn) {
        log.trace("db.SqlHelper.transaction");
        var previous = this.connection.getAutoCommit();
        this.connection.setAutoCommit(false);
        try {
            fn();
            this.connection.commit();
            return {succeeded: true, failed: false};
        }
        catch (e) {
            this.connection.rollback();
            if (e.__abortCause__ != undefined) {
                return {succeeded: false, failed: true, cause: e.__abortCause__};
            }
            else {
                return {succeeded: false, failed: true, cause: e};
            }
        }
        finally {
            this.connection.setAutoCommit(previous);
        }
    }

    /**
     * Abort a transaction and force the corresponding call to
     * [[transaction|#SqlHelper$transaction]] to return the specified value.
     *
     * @param(cause, object, optional)
     *    the value to be returned to the initiator of the transaction
     * @return(none) an exception is thrown
     */
    this.SqlHelper.prototype.abort = function(cause) {
        log.trace("db.SqlHelper.abort");
        throw {__abortCause__: cause};
    }
                
    /**
     * Perform a SQL query.
     *
     * @param(obj, object or string, required)
     *    either a string to be used as the query string,
     *    or an object treated as keyword arguments
     * @kparam(query, string, required)
     *    a query string, e.g. ``SELECT * FROM MYTABLE``
     * @kparam(args, object, optional)
     *    an object which is used to interpolate the query
     *    string using [[library.lang.interpolate|library.lang.html#interpolate]]
     * @kparam(columnMapping, function or object, optional)
     *    either a function to be invoked to perform the mapping or an object
     *    in which each property is the name
     *    of a column and its value is the name of the desired javascript property
     *    e.g. ``columnMapping: {a: "x", b: "y"}`` maps column ``a`` to the
     *    javascript property ``x``.
     * @kparam(sqlTypeMapping, function or object, optional)
     *    either a function or an object:
     *    if it is a function it will be invoked with one
     *    argument, an object with the following properties:
     *    ``sqlType``  - one of the constants in ``java.sql.Types``;
     *    ``javaType`` - a java class name;
     *    ``dbType`` - the database type name (a string).
     *    It must then return a function that will later be invoked
     *    with the column value (a java object) to be converted
     *    to a javascript object. If it is an object, each property name must be one of
     *    the type constants in java.sql.Types or, missing
     *    that, a java type name; the value of each property
     *    must be a function that will be invoked just like
     *    in the previous case.
     * @kparam(propertyFilter, object, optional)
     *    an object that serves as a filter
     *    to process each value before it is set in the javascript object
     *    that corresponds to a row; its properties must be
     *    named after the javascript property they apply to
     * @kparam(postProcessor, function, optional)
     *    a function that can transform
     *    the resulting javascript object for a row before it is added to the result
     *    array; it must return the object to be added.
     *
     * @return(array)
     *    an array of objects, each one mapped from one row
     *    of the SQL result set using the specified column mapping.
     *
     */
    this.SqlHelper.prototype.query = function(obj) {
        log.trace("db.SqlHelper.query");
        if (library.lang.isString(obj)) {
            obj = {query: obj};
        }
        var query = obj.query;
        if (query == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.query: invalid query argument");
            }
            throw new Error("invalid query argument " + obj);
        }
        var args = obj.args;
        if (args != undefined) {
            query = library.lang.interpolate(query, args);
        }
        var maxRows = obj.maxRows;
        if (maxRows == undefined) {
            maxRows = application.options.database.maxRows;
        }
        var st = this.connection.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                                                 java.sql.ResultSet.CONCUR_READ_ONLY);
        if (maxRows) {
            st.setMaxRows(maxRows);
        }
        if (log.debugEnabled) {
            log.debug("db.SqlHelper.query: SQL statement: " + query);
        }
        var resultSet = st.executeQuery(query);
        return this.processResultSet(resultSet, obj);
    }

    /**
     * Like [[query|#SqlHelper$query]], but returns at most one item, or undefined if there
     * are no matching rows.
     *
     */
    this.SqlHelper.prototype.queryOne = function(obj) {
        log.trace("db.SqlHelper.queryOne");
        obj.maxRows = 1;
        var result = this.query(obj);
        if (result.length > 0) {
            return result[0];
        }
        else {
            return undefined;
        }
    }
        
    this.SqlHelper.prototype.processResultSet = function(resultSet, obj) {
        log.trace("db.SqlHelper.processResultSet");
        function computeMetadata() {
            var metadata = [];
            var md = resultSet.getMetaData();
            for (var i = 1; i <= md.getColumnCount(); ++i) {
                var entry = {
                    name: md.getColumnName(i),
                    sqlType: md.getColumnType(i),                    
                    javaType: md.getColumnClassName(i),
                    dbType: md.getColumnTypeName(i),
                    index: i,
                    processFn: function(obj) {
                        var value = resultSet.getObject(this.index);
                        if (this.translationFn != undefined) {
                            value = this.translationFn.call(this, value);
                        }
                        if (this.filterFn != undefined) {
                            value = this.filterFn.call(this, value);
                        }
                        obj[this.name] = value;
                    }
                };
                
                // apply custom column name mapping, if any
                if (obj.columnMapping != undefined) {
                    if (library.lang.isFunction(obj.columnMapping)) {
                        var newName = (obj.columnMapping)(entry.name);
                        if (newName != undefined) {
                            entry.name = newName;
                        }
                    }
                    else if (library.lang.isObject(obj.columnMapping)) {
                        var newName = obj.columnMapping[entry.name];
                        if (newName != undefined) {
                            entry.name = newName;
                        }
                    }
                }
                
                // apply custom sql type mapping, if any
                if (obj.sqlTypeMapping != undefined) {
                    var fn;
                    if (library.lang.isFunction(obj.sqlTypeMapping)) {
                        fn = (obj.sqlTypeMapping)(entry);
                    }
                    else if (library.lang.isObject(obj.sqlTypeMapping)){
                        fn = obj.sqlTypeMapping[entry.sqlType];
                        if (fn == undefined) {
                            fn = obj.sqlTypeMapping[entry.javaType];
                        }
                    }
                    if (library.lang.isFunction(fn)) {
                        entry.translationFn = fn;
                    }
                }

                // apply property filter, if any
                if (obj.propertyFilter != undefined) {
                    var fn = obj.propertyFilter[entry.name];
                    if (library.lang.isFunction(fn)) {
                        entry.filterFn = fn;
                    }
                }

                metadata.push(entry);
            }
            return metadata;
        }
        var result = [];        
        var count = 0;
        var metadata;
        while (resultSet.next()) {
            if (metadata == undefined) {
                // do this lazily, so we don't incur the cost if the ResultSet is empty
                metadata = computeMetadata();
            }
            var entry = {};
            for (var i = 0; i < metadata.length; ++i) {
                metadata[i].processFn.call(metadata[i], entry);
            }
            if (library.lang.isFunction(obj.postProcessor)) {
                entry = (obj.postProcessor)(entry);
            }
            result.push(entry);
        }
        resultSet.close();
        return result;
    }

    /**
     * Insert a row into a table.
     *
     * @kparam(table, string, required)
     *    table name
     * @kparam(values, object, required)
     *    each property in the object is used
     *    as a column name/value pair; strings are escaped automatically
     * @kparam(propertyMapping, function or object, optional)
     *    either a function or an object in which each
     *    property is the name of a javascript property
     *    is the name of the corresponding database column
     *    e.g. ``propertyMapping: {x: "a", y: "b"}``
     *    maps the javascript property ``x`` to column ``a``.
     * @kparam(propertyFilter, object, optional)
     *   an object that serves as a filter to process each
     *   property value before it is passed on to the type
     *   mapping and then to a column; its properties must be
     *   named after the javascript property they apply to
     * @kparam(preProcessor, function, optional)
     *   a function that can transform the values object
     *   before it is passed on to the rest of the pipeline;
     *   it must return the new values object to be used
     * @kparam(prepare, boolean, optional)
     *   a boolean; if true, the statement will be prepared
     *   and all parameters will be passed as objects
     * @kparam(javaTypeMapping, function or object, optional)
     *   if it is a function it will be invoked with one
     *    argument, an object with the following properties:
     *    ``sqlType``  - one of the constants in java.sql.Types;
     *    ``javaType`` - a java class name;
     *    ``dbType`` - the database type name (a string).
     *    It must then return a function that will later be invoked
     *    with the javascript value to be converted to a java object.
     *    If it is an object, each property name must be one of
     *    the type constants in ``java.sql.Types`` or, missing
     *    that, a java type name; the value of each property
     *    must be a function that will be invoked just like
     *    in the previous case. This mapping is performed only if the
     *    statement preparation is enabled (via the ``prepare`` argument).
     * @kparam(returnKey, boolean, optional)
     *    if true, the statement will be prepared and the result will
     *    be an object containing some keyword results (see below)
     * @kparam(sqlTypeMapping, function or object, optional)
     *   see [[query|#SqlHelper$query]]
     *
     * @return(number)
     *   number of affected rows, only returned if the ``returnKey`` property
     *   was not set to true
     *     
     * @kreturn(count, number)
     *   the number of inserted rows (keyword return values are used only
     *   if the ``returnKey`` property is set to true)
     * @kreturn(key, string)
     *  the generated key (keyword return values are used only
     *   if the ``returnKey`` property is set to true)
     *
     */
    this.SqlHelper.prototype.insert = function(obj) {
        log.trace("db.SqlHelper.insert");
        if (!library.lang.isObject(obj)) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.insert: invalid argument");
            }
            throw new Error("invalid argument " + obj);
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.insert: missing table name");
            }
            throw new Error("missing table name");
        }
        var values = obj.values;
        if (library.lang.isFunction(obj.preProcessor)) {
            values = (obj.preProcessor)(values);
        }
        var prepare = obj.prepare;
        var returnKey = obj.returnKey;
        if (returnKey) {
            prepare = true;
        }

        var propertyMapping = obj.propertyMapping;
        var propertyFilter = obj.propertyFilter;
        var javaTypeMapping = obj.javaTypeMapping;
        var parameters = [];
        var stmt = "INSERT INTO " + obj.table;
        if (values != undefined) {
            var cs = "";
            var vs = "";
            var first = true;        
            for (var p in values) {
                if (values[p] == undefined) {
                    continue;
                }
                var name = p;
                var columnName = name;
                if (library.lang.isFunction(propertyMapping)) {
                    var newName = propertyMapping(name);
                    if (newName != undefined) {
                        columnName = newName;
                    }
                }
                else if (library.lang.isObject(propertyMapping)) {
                    var newName = propertyMapping[name];
                    if (newName != undefined) {
                        columnName = newName;
                    }                    
                }
                if (first) {
                    first = false;
                }
                else {
                    cs += ",";
                    vs += ",";
                }
                cs += columnName;
                if (prepare) {
                    parameters.push(name);
                    vs += "?";
                }
                else {
                    var value = values[p];
                    if (propertyFilter != undefined) {
                        if (library.lang.isFunction(propertyFilter[name])) {
                            value = (propertyFilter[name])(value);
                        }
                    }
                    
                    if (library.lang.isString(value) || library.lang.isJavaString(value)) {
                        value = "'" + value.replace("'", "''") + "'";
                    }
                    vs += String(value);
                }
            }
            stmt += " (";
            stmt += cs;
            stmt += ") VALUES (";
            stmt += vs;
            stmt += ")";
        }
        else {
            stmt += " VALUES ()";
        }
        
        var count;
        var key;
        if (prepare) {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.insert: SQL statement: " + stmt);
            }
            
            var st = this.connection.prepareStatement(stmt,
                                                      returnKey ?
                                                            java.sql.Statement.RETURN_GENERATED_KEYS :
                                                            java.sql.Statement.NO_GENERATED_KEYS);
            var md;
            if (javaTypeMapping != undefined) {
                md = st.getParameterMetaData();
            }
            for (var i in parameters) {
                var name = parameters[i];

                var value = values[name];
                if (propertyFilter != undefined) {
                    if (library.lang.isFunction(propertyFilter[name])) {
                        value = (propertyFilter[name])(value);
                    }
                }

                var parindex = Number(i) + 1;

                if (javaTypeMapping != undefined) {
                    var fn;
                    if (library.lang.isFunction(javaTypeMapping)) {
                        fn = javaTypeMapping({sqlType: md.getParameterType(parindex),
                                              javaType: md.getParameterClassName(parindex),
                                              dbType: md.getParameterTypeName(parindex)});
                    }
                    else if (library.lang.isObject(javaTypeMapping)) {
                        fn = javaTypeMapping[md.getParameterType(parindex)];
                        if (fn == undefined) {
                            fn = javaTypeMapping[md.getParameterClassName(parindex)];
                        }
                    }
                    if (library.lang.isFunction(fn)) {
                        value = fn.call(this, value);
                    }
                }
                st.setObject(parindex, value);
            }
            var processResultSet = this.processResultSet;
            library.db.using(st, function() {
                count = st.executeUpdate();
                if (returnKey) {
                    var keyResultSet = st.getGeneratedKeys();
                    if (keyResultSet != null) {
                        var md = keyResultSet.getMetaData();
                        if (md.getColumnCount() == 1) {
                            if (keyResultSet.next()) {
                                var value = keyResultSet.getObject(1);
                                
                                // apply custom sql type mapping, if any
                                if (obj.sqlTypeMapping != undefined) {
                                    var entry = {
                                        sqlType: md.getColumnType(i),                    
                                        javaType: md.getColumnClassName(i),
                                        dbType: md.getColumnTypeName(i),
                                    }
                                    var fn;
                                    if (library.lang.isFunction(obj.sqlTypeMapping)) {
                                        fn = (obj.sqlTypeMapping)(entry);
                                    }
                                    else if (library.lang.isObject(obj.sqlTypeMapping)){
                                        fn = obj.sqlTypeMapping[entry.sqlType];
                                        if (fn == undefined) {
                                            fn = obj.sqlTypeMapping[entry.javaType];
                                        }
                                    }
                                    if (library.lang.isFunction(fn)) {
                                        value = fn(value);
                                    }
                                }
                                
                                key = value;
                            }
                        }                    
                    }
                }
            });
        }
        else {
            var st = this.connection.createStatement();
            library.db.using(st, function() {
                if (log.debugEnabled) {
                    log.debug("db.SqlHelper.insert: SQL statement: " + stmt);
                }
                count = st.executeUpdate(stmt);
            });
        }
        if (returnKey) {
            var result = {count: count};
            if (key != undefined) {
                result.key = key;
            }
            return result;
        }
        else {
            return count;
        }
    }    

    /**
     * Delete all rows from a table.
     *
     * (It's called "sqldelete" because "delete" is a javascript keyword!)
     *
     * @kparam(table, string, required)
     *    table name
     * @kparam(where, string, optional)
     *    SQL WHERE clause
     * @kparam(args, object, optional)
     *    an object which is used to interpolate the where
     *    string using [[library.lang.interpolate|library.lang.html#interpolate]].
     * @return(number)
     *    the number of deleted rows.
     */
    this.SqlHelper.prototype.sqldelete = function(obj) {
        log.trace("db.SqlHelper.sqldelete");
        if (!library.lang.isObject(obj)) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.sqldelete: invalid argument");
            }
            throw new Error("invalid argument " + obj);
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.insert: missing table name");
            }
            throw new Error("missing table name");
        }
        var where = obj.where;
        var args = obj.args;
        if (where != undefined && args != undefined) {
            where = library.lang.interpolate(where, args);
        }
        
        var stmt = "DELETE FROM " + table;
        if (where != undefined) {
            stmt += " WHERE ";
            stmt += where;
        }
        
        var st = this.connection.createStatement();
        var result;
        library.db.using(st, function() {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.sqldelete: SQL statement: " + stmt);
            }
            result = st.executeUpdate(stmt);
        });
        return result;    
    }

    /**
     * Select some rows from a table.
     *
     * In addition to the keyword arguments listed below, this function
     * accepts the same arguments as [[query|#SqlHelper$query]], except
     * for the ``query`` one.
     *
     * @kparam(table, string, required)
     *    table name
     * @kparam(what, string, optional)
     *    columns to retrieve, defaults to ``"*"``
     * @kparam(where, string, optional)
     *    SQL WHERE clause
     * @kparam(orderBy, string, optional)
     *    order by clause
     *
     * @return(array)
     *    an array of objects, each one mapped from one row
     *    of the SQL result set using the specified column mapping.
     *
     */
    this.SqlHelper.prototype.select = function(obj) {
        log.trace("db.SqlHelper.select");
        if (library.lang.isString(obj)) {
            obj = {query: obj};
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.select: missing table name");
            }
            throw new Error("missing table name");
        }
        // TODO - extend this to multiple tables
        
        var what = obj.what;
        if (what == undefined) {
            what = "*";
        }
        var where = obj.where;
        var orderBy = obj.orderBy;

        var query = "SELECT " + what + " FROM " + table;
        if (where != undefined) {
            query += " WHERE " + where;
        }
        if (orderBy != undefined) {
            query += " ORDER BY " + orderBy;
        }
        
        delete obj.table;
        delete obj.what;
        delete obj.where;
        delete obj.orderBy;
        obj.query = query;
        return this.query(obj);
    }

    /**
     * Like [[select|#SqlHelper$select]], but returns at most one item,
     * or undefined if there are no matching rows.
     *
     */
    this.SqlHelper.prototype.selectOne = function(obj) {
        log.trace("db.SqlHelper.selectOne");
        obj.maxRows = 1;
        var result = this.select(obj);
        if (result.length > 0) {
            return result[0];
        }
        else {
            return undefined;
        }
    }

    /**
     * Update a row in a table.
     *
     * @kparam(table, string, required)
     *    table name
     * @kparam(where, string, required)
     *    SQL WHERE clause
     * @kparam(values, object, required)
     *    each property name is used as
     *    a column name and each property value as
     *    the value for that column; strings are
     *    escaped automatically
     * @kparam(args, object, optional)
     *    an object which is used to interpolate the where
     *    string using [[library.lang.interpolate|library.lang.html#interpolate]]
     * @kparam(propertyFilter, object, optional)
     *    see [[insert|#SqlHelper$insert]]
     * @kparam(propertyMapping, function or object, optional)
     *    see [[insert|#SqlHelper$insert]]
     * @kparam(prepare, boolean, optional)
     *    see [[insert|#SqlHelper$insert]]
     * @kparam(javaTypeMapping, function or object, optional)
     *    see [[insert|#SqlHelper$insert]]
     * @kparam(preProcessor, function, optional)
     *    see [[insert|#SqlHelper$insert]]
     * @return(number)
     *    the number of affected rows
     */
    this.SqlHelper.prototype.update = function(obj) {
        log.trace("db.SqlHelper.update");
        if (library.lang.isString(obj)) {
            obj = {query: obj};
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.update: missing table name");
            }
            throw new Error("missing table name");
        }
        var values = obj.values;
        if (library.lang.isFunction(obj.preProcessor)) {
            values = (obj.preProcessor)(values);
        }
        if (values == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.update: missing values");
            }
            throw new Error("missing values");
        }
        var where = obj.where;
        if (where == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.update: missing where clause");
            }
            throw new Error("missing where clause");
        }
        if (obj.args != undefined) {
            where = library.lang.interpolate(where, obj.args);
        }
        var prepare = obj.prepare;
        if (prepare != true) {
            prepare = false;
        }

        var stmt = "UPDATE " + table;
        stmt += " SET ";

        var propertyMapping = obj.propertyMapping;
        var propertyFilter = obj.propertyFilter;
        var javaTypeMapping = obj.javaTypeMapping;
        var first = true;        
        var parameters = [];
        for (var p in values) {
            if (values[p] == undefined) {
                continue;
            }
            var name = p;
            var columnName = name;
            if (library.lang.isFunction(propertyMapping)) {
                var newName = propertyMapping(name);
                if (newName != undefined) {
                    columnName = newName;
                }
            }
            else if (library.lang.isObject(propertyMapping)) {
                var newName = propertyMapping[name];
                if (newName != undefined) {
                    columnName = newName;
                }                    
            }
            if (first) {
                first = false;
            }
            else {
                stmt += " , ";
            }
            stmt += columnName;
            stmt += " = ";
            if (prepare) {
                parameters.push(name);
                stmt += "?";
            }
            else {
                var value = values[p];
                if (propertyFilter != undefined) {
                    if (library.lang.isFunction(propertyFilter[name])) {
                        value = (propertyFilter[name])(value);
                    }
                }
                
                if (library.lang.isString(value) || library.lang.isJavaString(value)) {
                    value = "'" + value.replace("'", "''") + "'";
                }
                stmt += String(value);
            }
        }

        stmt += " WHERE ";
        stmt += where;

        var result;
        if (prepare) {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.update: SQL statement: " + stmt);
            }
            var st = this.connection.prepareStatement(stmt);
            var md;
            if (javaTypeMapping != undefined) {
                md = st.getParameterMetaData();
            }
        
            for (var i in parameters) {
                var name = parameters[i];

                var value = values[name];
                if (propertyFilter != undefined) {
                    if (library.lang.isFunction(propertyFilter[name])) {
                        value = (propertyFilter[name])(value);
                    }
                }

                var parindex = Number(i) + 1;

                if (javaTypeMapping != undefined) {
                    var fn;
                    if (library.lang.isFunction(javaTypeMapping)) {
                        fn = javaTypeMapping({sqlType: md.getParameterType(parindex),
                                              javaType: md.getParameterClassName(parindex),
                                              dbType: md.getParameterTypeName(parindex)});
                    }
                    else if (library.lang.isObject(javaTypeMapping)) {
                        fn = javaTypeMapping[md.getParameterType(parindex)];
                        if (fn == undefined) {
                            fn = javaTypeMapping[md.getParameterClassName(parindex)];
                        }
                    }
                    if (library.lang.isFunction(fn)) {
                        value = fn.call(this, value);
                    }
                }
                st.setObject(parindex, value);
            }        
        
            library.db.using(st, function() {
                result = st.executeUpdate();
            });
        }
        else {
            var st = this.connection.createStatement();
            library.db.using(st, function() {
                if (log.debugEnabled) {
                    log.debug("db.SqlHelper.update: SQL statement: " + stmt);
                }
                result = st.executeUpdate(stmt);
            });
        }
        return result;
    }

    /**
     * Drop a table.
     *
     * @kparam(table, string, required) table name
     *
     */
    this.SqlHelper.prototype.drop = function(obj) {
        log.trace("db.SqlHelper.drop");
        if (!library.lang.isObject(obj)) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.drop: invalid argument");
            }
            throw new Error("invalid argument " + obj);
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.drop: missing table name");
            }
            throw new Error("missing table name");
        }

        var stmt = "DROP TABLE " + table;
        
        var st = this.connection.createStatement();
        var result;
        library.db.using(st, function() {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.drop: SQL statement: " + stmt);
            }
            result = st.executeUpdate(stmt);
        });
        return result;    
    }

    /**
     * Execute a SQL statement.
     *
     * @param(obj, object or string, required)
     *    either a string to be used as the SQL statement to execute
     *    or an object treated as keyword arguments
     * @kparam(statement, string, required)
     *    a SQL statement
     * @kparam(args, object, optional)
     *    an object which is used to interpolate the where
     *    string using [[library.lang.interpolate|library.lang.html#interpolate]]
     * @return(number)
     *    the number of affected rows
     */
    this.SqlHelper.prototype.execute = function(obj) {
        log.trace("db.SqlHelper.execute");
        var statement;
        if (library.lang.isString(obj)) {
            statement = obj;
        }
        else {
            if (!library.lang.isObject(obj)) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.execute: invalid argument");
            }
                throw new Error("invalid argument " + obj);
            }
            statement = obj.statement;
            if (statement == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.execute: missing statement");
            }
                throw new Error("missing statement");
            }

            if (obj.args) {
                statement = library.lang.interpolate(statement, obj.args);
            }
        }
                
        var st = this.connection.createStatement();
        var result;
        library.db.using(st, function() {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.execute: SQL statement: " + statement);
            }
            result = st.execute(statement);
        });
        return result;    
    }

    /**
     * Create a table.
     *
     * @kparam(table, string, required)
     *    table name
     * @kparam(columns, object, required)
     *    column information, as an object
     *    each property name becomes a column name
     *    subject to the property mapping), the
     *    value must be a string that is used
     *    verbatim in the resulting SQL create statement
     * @kparam(constraints, string or array of strings, optional)
     *    a string or an array of strings, each used
     *    verbatim in the resulting SQL create statement
     * @kparam(propertyMapping, function or object, optional)
     *    either a function or an object in which each
     *    property is the name of a javascript property
     *    is the name of the corresponding database column;
     *    e.g. ``propertyMapping: {x: "a", y: "b"}``
     *    maps the javascript property ``x`` to column ``a``.
     *
     */
    this.SqlHelper.prototype.create = function(obj) {
        log.trace("db.SqlHelper.create");
        if (!library.lang.isObject(obj)) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.create: invalid argument");
            }
            throw new Error("invalid argument " + obj);
        }
        var table = obj.table;
        if (table == undefined) {
            if (log.errorEnabled) {
                log.error("db.SqlHelper.create: missing table name");
            }
            throw new Error("missing table name");
        }
        var columns = obj.columns;
        var constraints = obj.constraints;
        var propertyMapping = obj.propertyMapping;

        var stmt = "CREATE TABLE " + table;
        stmt += " ( "

        var first = true;
        if (library.lang.isObject(columns)) {
            for (var p in columns) {
                var columnName = p;
                if (library.lang.isFunction(propertyMapping)) {
                    var newName = propertyMapping(columnName);
                    if (newName != undefined) {
                        columnName = newName;
                    }
                }
                else if (library.lang.isObject(propertyMapping)) {
                    var newName = propertyMapping[columnName];
                    if (newName != undefined) {
                        columnName = newName;
                    }                    
                }
                var info = columns[p];
                if (library.lang.isString(info)) {
                    if (first) {
                        first = false;
                    }
                    else {
                        stmt += ", ";
                    }
                    stmt += columnName;
                    stmt += " ";
                    stmt += info;
                }
            }
        }

        if (constraints != undefined) {
            if (library.lang.isString(constraints)) {
                constraints = [constraints];
            }
            if (library.lang.isArray(constraints)) {
                for (var i = 0; i < constraints.length; ++i) {
                    if (first) {
                        first = false;
                    }
                    else {
                        stmt += ", ";
                    }
                    stmt += constraints[i];
                }
            }
        }
        stmt += " )"
        
        var st = this.connection.createStatement();
        library.db.using(st, function() {
            if (log.debugEnabled) {
                log.debug("db.SqlHelper.create: SQL statement: " + stmt);
            }
            st.execute(stmt);
        });
    }

    
    /**
     * Return an XML representation of the database metadata.
     *
     * @kparam(schemaFilter, function, optional)
     *    A function that is applied to an XML element of the form
     *    ``schema name="..." catalog="..."/>``; if the function returns
     *    true, the corresponding schema becomes part of the output
     *    metadata document.
     *                       
     */
    this.SqlHelper.prototype.getMetadata = function(obj) {
        log.trace("db.SqlHelper.getMetadata");
        if (obj == undefined) {
            obj = {};
        }
        var schemaFilterFn = obj.schemaFilter ? obj.schemaFilter : function() { return true; };
        var result = new XML(<metadata/>);
        var md = this.connection.getMetaData();
        var rs = md.getSchemas();
        var schemaInfo = this.processResultSet(rs, {columnMapping: {TABLE_SCHEM: "name",
                                                                   TABLE_CATALOG: "catalogName"}});
        for (var i = 0; i < schemaInfo.length; ++i) {
            var child = <schema name={schemaInfo[i].name}/>;
            if (schemaInfo[i].catalogName) {
                child.@catalog = schemaInfo[i].catalogName;
            }
            if (!schemaFilterFn(child)) continue;
            rs = md.getTables(schemaInfo[i].catalogName, schemaInfo[i].name, null, null);
            var tableInfo = this.processResultSet(rs, {columnMapping: {TABLE_NAME: "name",
                                                                      TABLE_TYPE: "type"
                                                                      }});
            for (var j = 0; j < tableInfo.length; ++j) {
                var child2 = <table name={tableInfo[j].name} type={tableInfo[j].type}/>;
                rs = md.getColumns(schemaInfo[i].catalogName, schemaInfo[i].name, tableInfo[j].name, null);
                var columnInfo = this.processResultSet(rs, {columnMapping: {COLUMN_NAME: "name",
                                                                           DATA_TYPE: "typeCode",
                                                                           TYPE_NAME: "type",
                                                                           COLUMN_SIZE: "size",
                                                                           NULLABLE: "nullable"
                                                                           }});
                for (var k = 0; k < columnInfo.length; ++k) {
                    var child3 = <column name={columnInfo[k].name} type={columnInfo[k].type} typeCode={columnInfo[k].typeCode} size={columnInfo[k].size} nullable={columnInfo[k].nullable}/>;
                    child2.appendChild(child3);
                }
                rs = md.getPrimaryKeys(schemaInfo[i].catalogName, schemaInfo[i].name, tableInfo[j].name);
                var pkInfo =  this.processResultSet(rs, {columnMapping: {COLUMN_NAME: "name", KEY_SEQ: "index"}});
                var pks = [];
                for (var k = 0; k < pkInfo.length; ++k) {
                    pks[pkInfo[k].index] = pkInfo[k].name;
                }
                for (var k = 1; k < pks.length; ++k) {
                    child2.appendChild(<primaryKey name={pks[k]}/>);
                }
                rs = md.getVersionColumns(schemaInfo[i].catalogName, schemaInfo[i].name, tableInfo[j].name);
                var versionInfo =  this.processResultSet(rs, {columnMapping: {COLUMN_NAME: "name", PSEUDO_COLUMN: "pseudo"}});
                for (var k = 0; k < versionInfo.length; ++k) {
                    child2.appendChild(<versionColumn name={versionInfo[k].name} pseudo={versionInfo[k].pseudo}/>);
                }

                child.appendChild(child2);
            }
            result.appendChild(child);
        }
        return result;                
    }
    
});
