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
 * Modules generated using Phobos JPA Generator would make use of this library
 * to provide the functionality required for "CRUD" (Create/Update/Delete).
 */

library.common.define(library, "jpahelper", function() {
    
    /*
    ****************************************************************************
    * These functions are called from the controller to provide functionality.
    ****************************************************************************
    */

    /**
     * For the entity build the data that would be displayed as a html table 
     * in the view page.
     * This function would return a string containing the html table 
     * information to be displayed for this entity
     */
    this.getHtmlTableData = function(url,clazz,currPosition) {
        var htmlStr     = String("");
        var resultList  = getArrayRows(clazz,currPosition);
        var resultArray = resultList.toArray();

        if (!resultList.isEmpty()) {
            var pkKeys     = clazz.primaryKeys;
            var colsToList = clazz.columnsToList;

            htmlStr = htmlStr.concat("<table border=1>","<tr>");

            // First print out the Column Headers
            for (var pkcolNo in pkKeys) {
                htmlStr = htmlStr.concat("<th>",pkKeys[pkcolNo],"</th>");
            }
            for (var colNo in colsToList) {
                htmlStr = htmlStr.concat("<th>",colsToList[colNo],"</th>");
            }
            htmlStr = htmlStr.concat("</tr>");

           // Loop through the result list and fetch the value to be displayed.
            for (var obj in resultArray) {
                htmlStr = htmlStr.concat("<tr>");
                clazz.entityObj = resultArray[obj];
                var getMethodString;
                var attrbRowVal;
                var queryStr = String("");
                var displayStr = String("");
                var attrbValue;

                for (var pkcolNo in pkKeys) {
                    var pkAttrbName = pkKeys[pkcolNo];
                    attrbValue  = getAttributeData(pkAttrbName,clazz);
                    if (attrbValue instanceof java.lang.String) {
                        attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
                    }
                    if (queryStr.length == 0) {
                    queryStr   = pkAttrbName + "=" + attrbValue;
                        displayStr = attrbValue;
                    } else { // Implies that we have a compound PK
                        queryStr += "&" + pkAttrbName + "=" + attrbValue;
                        displayStr += "::" + attrbValue;
                    }
                }
                if (queryStr.length > 0) {
                    var editUrl = library.view.quoteUrl(String("").concat(url,"edit?",queryStr));
                    htmlStr = htmlStr.concat("<td>","<a href=",editUrl,">",displayStr,"</a>","</td>");
                }
                htmlStr = getHtmlForColumn(clazz,htmlStr);
                var deleteUrl = library.view.quoteUrl(String("").concat(url,"remove?",queryStr));
                htmlStr = htmlStr.concat("<td>","<a href=",deleteUrl,">Delete</a>","</td>");
                htmlStr = htmlStr.concat("</tr>");
            } //for (var obj in resultArray)

            htmlStr = htmlStr.concat("</table>");
        }
        return htmlStr;
    } //getHtmlTableData

    /**
     * For the entity build the data that would be displayed in the jmaki table 
     * of the view page.
     */
    this.getJmakiTableData = function(clazz,currPosition) {
        var resultList = getArrayRows(clazz,currPosition);
        // If there is no data in the database table, display am empty Jmaki 
        // table. Not doing this would end in displaying the template jmaki table.
        var jmakiRsltObject = {};
        if (resultList.isEmpty()) {
            jmakiRsltObject["columns"] = "";
            jmakiRsltObject["rows"]    = "";
            return jmakiRsltObject;
        }
        var resultArray = resultList.toArray();
        var pkKeys      = clazz.primaryKeys;
        var colsToList  = clazz.columnsToList;
        var colObject = {};
        var rowValues = [];
        var colValues = [];

        // Set the column headings that would be displayed in the jmaki table
        for (var pkcolNo in pkKeys) {
            colObject = {};
            var pkAttrbName = pkKeys[pkcolNo];
            colObject['title'] = pkAttrbName.toUpperCase();
            colValues.push(colObject);
        }
        for (var cols in colsToList) {
            colObject = {};
            var colName = colsToList[cols];
            colObject['title'] = colName.toUpperCase();
            colValues.push(colObject);
        }

        // Now loop through the result list and fetch the value to be displayed.
        for (var obj in resultArray) {
            var currRowValue = [];
            clazz.entityObj = resultArray[obj];
            
            for (var pkcolNo in pkKeys) {
                var pkAttrbName = pkKeys[pkcolNo];
                attrbValue  = getAttributeData(pkAttrbName,clazz);
                if (attrbValue instanceof java.lang.String) {
                    attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
                }
                currRowValue.push(attrbValue); //The PK field Values should be displayed first
                var dispColValues = getDisplayColumnValues(clazz);
                for (var colNo in dispColValues) {
                    currRowValue.push(dispColValues[colNo]);
                }
            }
            rowValues.push(currRowValue);
        }
        jmakiRsltObject["columns"] = colValues;
        jmakiRsltObject["rows"]    = rowValues;

        return jmakiRsltObject;
    } //getJmakiTableData
    
    this.performUpdateAction = function(clazz) {
        var action    = request.getParameter("action");
        var errorMesg = String("");
        var exceptionMsg;
        
        if (action == "Delete") {
            try {
                var idValues = getIdValuesFromInput(clazz);
                remove(clazz,idValues);
            } catch (exception) {
                exceptionMsg = exception.description;
                if (exception.description == null) {
                    exceptionMsg = exception.message;
                }                            
                if (exceptionMsg.indexOf("DatabaseException") != -1 ||
                    exceptionMsg.indexOf("EntityNotFoundException") != -1)  {
                    errorMesg = errorMesg.concat("<p><br><br>Exception caught when trying to Delete an existing " + classname + ".");
                } 
            }
        } else if (action == "Update") {
            try {
                var allParams = getValueArrayFromInput();
                update(clazz,allParams);
            } catch (exception) {
                exceptionMsg = exception.description;
                if (exception.description == null) {
                    exceptionMsg = exception.message;
                }                            
                if (exceptionMsg.indexOf("DatabaseException") != -1 ||
                    exceptionMsg.indexOf("RollbackException") != -1 ||
                    exceptionMsg.indexOf("EntityNotFoundException") != -1)  {
                    errorMesg = errorMesg.concat("<p><br><br>Exception caught when trying to Update an existing " + classname + ".");
                }
            }
        } else if (action == "Create") {
            try {
                var allParams = getValueArrayFromInput();
                clazz.entityObj = new Packages[clazz.entityClassName]();
                insert(clazz,allParams);
            } catch (exception) {
                exceptionMsg = exception.description;
                if (exception.description == null) {
                    exceptionMsg = exception.message;
                }                            
                if (exceptionMsg.indexOf("DatabaseException")     != -1) {
                    errorMesg = errorMesg.concat("<p><br><br>Exception caught when trying to Insert row into " + clazz.entityname + ".");
                } if (exceptionMsg.indexOf("EntityExistsException") != -1) {
                    errorMesg = errorMesg.concat("<p><br><br>Exception caught when trying to Insert row into " + clazz.entityname + ".");
                    errorMesg = errorMesg.concat("<br>There is already a row present for the same primary key in the database.");
                }
            }
        } else if (action == "Cancel") {
        }
        
        if (errorMesg.length > 0) {
            errorMesg = errorMesg.concat("<br>Please correct the problem and try the operation again.");
            errorMesg = errorMesg.concat("<p><br><br>Exception Message : " + exceptionMsg + ".");
        }
        return errorMesg;
    } //performUpdateAction

    this.performEditAction = function(clazz) {
        var allParams = library.httpserver.parseRequestParameters();
        if (clazz.primaryKeys.length == 1) {
            var pkValuesObj = {};
            var idName  = clazz.primaryKeys[0];
            var idValue = allParams[idName];
            pkValuesObj[idName] = idValue;
            clazz.entityObj = findByPKValue(clazz,pkValuesObj);
        }
    } //performEditAction
    
    this.performRemoveAction = function(clazz){
        var idValues = getIdValuesFromInput(clazz);
        remove(clazz,idValues);
    }
    
    this.processRequest = function(action,currPosition,clazz,htmlListUrlStr) {
        response.setStatus(200);
        response.setContentType("text/html");
        writer = response.getWriter();
        if (action == "navigate") {
            writer.println(this.getNavigationInfo(htmlListUrlStr 
                                + '?currPosition=',clazz
                                ,Number(currPosition),true));
        } else if (action == 'tablehead') {
            writer.println(getAjaxTableHead(clazz));
        } else if (action == "list") {
            writer.println(getAjaxTableRows(clazz
                                ,Number(currPosition)));
        } else if (action == "back") {
            writer.println(getAjaxBackHref());
        }

        writer.flush();
    } //processRequest

    /**
     * Generates the HTML String that would display the navigational options
     * for the list of rows being displayed.
    */
    this.getNavigationInfo = function(url,clazz,currFirstPosition,isAjaxRequest) {
        var navigateStr = String("");
        var isLast      = false;
        var noofRowsPerPage = Number(clazz.queries["noofRowsPerPage"]);
        var currMaxRows = Number(findByQueryString(clazz,clazz.queries["maxRowCount"],null,true,-1).toString());
        if (currMaxRows == 0) {
            return navigateStr;
        }

        var nextFirstPosition = Number(currFirstPosition + noofRowsPerPage);
        var prevFirstPosition = Number(currFirstPosition - noofRowsPerPage);
        var lastPagePosition;
        if (currMaxRows % noofRowsPerPage == 0) {
            lastPagePosition  = Number(((currMaxRows/noofRowsPerPage) - 1) * noofRowsPerPage);
        } else {
            lastPagePosition  = Number(Math.floor(currMaxRows/noofRowsPerPage) * noofRowsPerPage);
        }
        
        if (prevFirstPosition < 0) {
            prevFirstPosition = 0;
        }

        //Do not provide "First" and "Prev" on the first page
        if (currFirstPosition != 0) {
            if (isAjaxRequest) {
                navigateStr = navigateStr.concat(
                    "<a href=\"javascript:updateDivContent(0,false,true);\">First "
                    ,noofRowsPerPage,"</a>","   |  ");
                navigateStr = navigateStr.concat(
                "<a href=\"javascript:updateDivContent(" 
                    + prevFirstPosition + ",false,true);\">Prev ",noofRowsPerPage,"</a>","   |  ");
            } else {
                var nextUrl = library.view.quoteUrl(String("").concat(url,0));
                var lastUrl = library.view.quoteUrl(String("").concat(url,prevFirstPosition));
                navigateStr = navigateStr.concat("<a href=",nextUrl,">First ",noofRowsPerPage,"</a>"," |");
                navigateStr = navigateStr.concat("<a href=",lastUrl,">Prev ",noofRowsPerPage,"</a>"," |");
            }
        }
        
        var rowsRemaining = Number(currMaxRows - currFirstPosition);
        //Do not provide "Next" and "Last" on the last page
        if (rowsRemaining > noofRowsPerPage) {
            if (isAjaxRequest) {
                navigateStr = navigateStr.concat(
                    "<a href=\"javascript:updateDivContent(" 
                    + nextFirstPosition + ",false,true);\">Next ",noofRowsPerPage,"</a>","   |  ");
                navigateStr = navigateStr.concat(
                    "<a href=\"javascript:updateDivContent(" 
                    + lastPagePosition + ",false,true);\">Last ",noofRowsPerPage,"</a>","   |  ");
            } else {
                var nextUrl = library.view.quoteUrl(String("").concat(url,nextFirstPosition));
                var lastUrl = library.view.quoteUrl(String("").concat(url,lastPagePosition));
                navigateStr = navigateStr.concat("<a href=",nextUrl,">Next ",noofRowsPerPage,"</a>"," |");
                navigateStr = navigateStr.concat("<a href=",lastUrl,">Last ",noofRowsPerPage,"</a>"," |");
            }
        } 
        return navigateStr;
    } //getNavigationInfo

    /*
    ****************************************************************************
    * 
    ****************************************************************************
    */    
    
    /**
     * The many side of a relationship could be a Collection. This function deals
     * with inserting/updating values into the collection.
     */
    this.getCollectionObjectValue = function(fieldName,inputValue,clazz,currFieldValue) {
        //When inserting or updating a collection field, it could be null. 
        //In this case we would have to create a collection. 
        //Creating a java.util.HashSet as the collection holder
        if (currFieldValue == null) {
            currFieldValue = new java.util.HashSet(); 
        } else if (inputValue.length > 1 && !currFieldValue.isEmpty()) {
            //In case there is already some value in the collection, clear all 
            //the existing entries from the collection and update the collection 
            //with the new values provided by the user.
            currFieldValue.clear();
        }
        //The listbox on the edit page is defined as "multiple". If the user has selected
        //many values we would get a JavaArray of java.lang.String. But if the user has selected
        //only 1 value we would get a java.lang.String.
        if (typeof(inputValue) == "string") {
            var currInputObjectValue = this.getInstanceObjectOfRel(fieldName,inputValue,clazz);
            currFieldValue.add(currInputObjectValue);
        } else {
            for (var i = 0; i < inputValue.length; i++) {
                var currInputObjectValue = this.getInstanceObjectOfRel(fieldName,inputValue[i],clazz);
                currFieldValue.add(currInputObjectValue);
            }
        }
        return currFieldValue;
    }

    /**
     * If there are relation fields defined for this entity, then this function would
     * return the data that would be displayed in that listbox at the time when the 
     * edit page is loaded.
     */
    this.prepareRelationsResultList = function(clazz) {
        var clsRelations = clazz.relations;
        var subpkgname   = clazz.subpkgname;
        var resultsList  = {};
        for (var n in clsRelations) {
            var relFieldInfo    = clsRelations[n];
            var moduleName      = relFieldInfo["moduleName"];
            var moduleClassName = relFieldInfo["moduleClassName"];
            var trgtClazz       = new module[subpkgname][moduleName][moduleClassName];
            resultsList[n]      = getRelationDisplayInfo(clazz,n,trgtClazz);
        }
        return resultsList;
    } //prepareRelationsResultList

    this.getInstanceObjectOfRel = function(relFieldName,inputValue,clazz) {
        var targetEntityObj;
        // For this relation field create an instance of the target Entity
        var trgtModuleName      = clazz.relations[relFieldName]["moduleName"];
        var trgtModuleClassName = clazz.relations[relFieldName]["moduleClassName"];
        
        var trgtClazz  = new module[clazz.subpkgname][trgtModuleName][trgtModuleClassName];
        var trgtEntity = new Packages[trgtClazz.entityClassName]();
        trgtClazz.entityObj = trgtEntity;
        var inputObjectValues = {};
        var idName;

        // The input value passed in is a String containing the primary
        // key field name=value pair. 
        var stk = Packages.java.util.StringTokenizer(inputValue,"=");
        while (stk.hasMoreElements()) {           
            idName = stk.nextToken();
            var idValue = stk.nextToken();
            inputObjectValues[idName] = trgtClazz.getObjectForInputValue(idName,idValue);
        }

        if (trgtClazz.primaryKeys.length == 1) {
            targetEntityObj = findByPKValueObject(trgtClazz,inputObjectValues[idName]);
        }
        return targetEntityObj;
    } //getInstanceObjectOfRel

    this.findByPKValue = function(clazz,entityValuesObject) {
        var retEntityObj;
        if (clazz.primaryKeys.length == 1) {
	    var idName  = clazz.primaryKeys[0];
	    var idValue = entityValuesObject[idName];
	    var entityPKObject = clazz.getObjectForInputValue(idName,idValue);
            retEntityObj = findByPKValueObject(clazz,entityPKObject);            
        }
        return retEntityObj;
    } //findByPKValue

    this.getValueArray = function(clazz) {
        var retValueObj = {};
        var colsArray = clazz.allColumns;
        if (clazz.entityObj == undefined) {
            for (var attrb in colsArray) {
                var attrbName  = colsArray[attrb]; 
                retValueObj[attrbName] = ""; 
            }
        } else {
            for (var attrb in colsArray) {
                var attrbName  = colsArray[attrb];            
                var getMethodString = String("get").concat(capitalize(attrbName));
                var attrbRowVal = clazz[getMethodString]();
                if (clazz.relations != undefined) {
                    for (var colName in clazz.relations) {
                        if (colName == attrbName) {
                            var relFieldInfo    = clazz.relations[colName];
                            var moduleName      = relFieldInfo["moduleName"];
                            var moduleClassName = relFieldInfo["moduleClassName"];
                            var trgtClazz       = new module[clazz.subpkgname][moduleName][moduleClassName];
                            attrbRowVal = getPkStringForRelEntity(trgtClazz,attrbRowVal,relFieldInfo["isCollection"]);
                            break;
                        }
                    }
                }
                // In case the value returned back is of type primitive int, the value
                // is displayed on the edit screen as non-ascii. Hence have added the
                // below if check.
                if (typeof(attrbRowVal) == 'number') {
                    attrbRowVal = new Number(attrbRowVal);
                }  else if (attrbRowVal == null) {
                    attrbRowVal = new String("");
                }      
                retValueObj[attrbName] = attrbRowVal;            
            }
        }
        return retValueObj;
    } //getValueArray
    
    /**
     * Since creating an EntityManagerFactory (emf) is an expensive operation, 
     * we are creating the emf once for the puname and then saving it in the 
     * global context. Each subsequent call would get the same emf.
     * 
     */
    this.checkGlobalsForEMF = function(puname) {
        var globals = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();
        var lookupPuEmf = "__" + puname + "EMF__";
        
        // check the globals map to get the emf bound to the passed in puname
        var puEmf = globals.get(lookupPuEmf);
        if (puEmf == null) {
            puEmf = Packages.javax.persistence.Persistence.createEntityManagerFactory(puname);
            globals.put(lookupPuEmf,puEmf);
        }
        return puEmf;
    } //checkGlobalsForEMF

    /*
    ****************************************************************************
    * These functions deal with making Java Persistence API calls to the 
    * underlying JPA Provider.
    ****************************************************************************
    */

    function getValueArrayFromInput() {
        var allValues = {};
        for (var params = request.getParameterNames(); params.hasMoreElements(); ) {
            var name = params.nextElement();
            // For a multiple selection listbox there could be multiple
            // values for the same name.
            var value = request.getParameterValues(name);
            allValues[name] = value;
        }

        delete allValues.action;
        return allValues;
    } //getValueArrayFromInput

    function getIdValuesFromInput(clazz) {
        var pkValues = {};
        var pkAttrbNames = clazz.primaryKeys; // returns an Array
        for (var pknm in pkAttrbNames) {
            var primaryKey = pkAttrbNames[pknm];
            pkValues[primaryKey] = request.getParameter(primaryKey);
        }
        return pkValues;
    } //getIdValuesFromInput

    function getAjaxTableHead(clazz,currPosition) {
        var htmlStr     = String("");
        var resultList  = getArrayRows(clazz,currPosition);
        var resultArray = resultList.toArray();

        if (!resultList.isEmpty()) {
            var pkKeys     = clazz.primaryKeys;
            var colsToList = clazz.columnsToList;

            htmlStr = htmlStr.concat("<table>");
            htmlStr = htmlStr.concat("<tr>");

            // First print out the Column Headers
            for (var pkcolNo in pkKeys) {
                htmlStr = htmlStr.concat("<th>",pkKeys[pkcolNo],"</th>");
            }
            for (var colNo in colsToList) {
                htmlStr = htmlStr.concat("<th>",colsToList[colNo],"</th>");
            }
            htmlStr = htmlStr.concat("<th></th>");
            htmlStr = htmlStr.concat("</tr>");
        }
        return htmlStr;
    } //getAjaxTableHead
    
    function getAjaxTableRows(clazz,currPosition) {
        var htmlStr     = String("");
        var resultList  = getArrayRows(clazz,currPosition);
        var resultArray = resultList.toArray();

        if (!resultList.isEmpty()) {
            var pkKeys     = clazz.primaryKeys;
            var colsToList = clazz.columnsToList;

            htmlStr = htmlStr.concat("<table border=1>","<tr>");
            // Loop through the result list and fetch the value to be displayed.
            for (var obj in resultArray) {
                htmlStr = htmlStr.concat("<tr>");
                clazz.entityObj = resultArray[obj];
                var getMethodString;
                var attrbRowVal;
                var queryStr = String("");
                var displayStr = String("");
                var attrbValue;

                for (var pkcolNo in pkKeys) {
                    var pkAttrbName = pkKeys[pkcolNo];
                    attrbValue  = getAttributeData(pkAttrbName,clazz);
                    if (attrbValue instanceof java.lang.String) {
                        attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
                    }
                    if (queryStr.length == 0) {
                    queryStr   = pkAttrbName + "=" + attrbValue;
                        displayStr = attrbValue;
                    } else { // Implies that we have a compound PK
                        queryStr += "&" + pkAttrbName + "=" + attrbValue;
                        displayStr += "::" + attrbValue;
                    }
                }
                if (queryStr.length > 0) {
                    htmlStr = htmlStr.concat("<td>","<a href=javascript:editRow('",queryStr,"');>",displayStr,"</a>","</td>");
                }
                htmlStr = getHtmlForColumn(clazz,htmlStr);
                htmlStr = htmlStr.concat("<td>","<a href=javascript:removeRow('",queryStr,"');>Delete</a>","</td>");
                htmlStr = htmlStr.concat("</tr>");
            } //for (var obj in resultArray)

            htmlStr = htmlStr.concat("</table>");
        }
        return htmlStr;
    } //getAjaxTableRows
    
    function getAjaxBackHref() {
        return ("<a href=\"javascript:updateDivContent(0,true,true);\">Back ");
    }

    function findByPKValue(clazz,entityValuesObject) {
        var retEntityObj;
        if (clazz.primaryKeys.length == 1) {
	    var idName  = clazz.primaryKeys[0];
	    var idValue = entityValuesObject[idName];
	    var entityPKObject = clazz.getObjectForInputValue(idName,idValue);
            retEntityObj = findByPKValueObject(clazz,entityPKObject);            
        }
        return retEntityObj;
    } //findByPKValue
    
    /*
     * Insert the Entity Object.
     */
    function insert(clazz,inputValues) {
	clazz.updateValuesIntoEntityObject(inputValues);
	insertRow(clazz);
    }

    /*
     * Update the Entity Object.
     */
    function update(clazz,inputValues) {
	var idValues = {};
	var pkAttrbNames = clazz.primaryKeys; // returns an Array
	for (var pknm in pkAttrbNames) {
	    var primaryKey = pkAttrbNames[pknm];
	    idValues[primaryKey] = inputValues[primaryKey];
        }
	if (clazz.primaryKeys.length == 1) {
	    var pkValues = {};
	    var idName  = clazz.primaryKeys[0];
	    var idValue = idValues[idName];
	    pkValues[idName] = idValue[0];
	    clazz.entityObj = findByPKValue(clazz,pkValues);
	    clazz.updateValuesIntoEntityObject(inputValues);
	    updateRow(clazz);
        }
    }

    /**
     * Delete the Entity Object.
     */ 
    function remove(clazz,idValues) {
	var inputObjectValues = {};
	var javaClass = java.lang.Class.forName(clazz.entityClassName);
	/* Given PK field values get an EntityObject for them.
	/* For a simple PK field this would be an object corresponding to the PK field type.
	/* For a compound PK/embedded PK this should return an object of the PK class.
	*/
	if (clazz.primaryKeys.length == 1) {
	    var idName  = clazz.primaryKeys[0];
	    var idValue = idValues[idName];
	    inputObjectValues[idName] = clazz.getObjectForInputValue(idName,idValue);
	    deleteRow(clazz.subpkgname,javaClass,inputObjectValues[idName]);
        }
    }

    function insertRow(clazz) {
        var emf = module[clazz.subpkgname].helpers.emf;
        var em = emf.createEntityManager();
        var tx = em.getTransaction(); // Is an EntityTransaction
        tx.begin();
        theJavaObject = em.persist(clazz.entityObj);
        tx.commit();
        em.close();
    }
    
    function updateRow(clazz) {
        var emf = module[clazz.subpkgname].helpers.emf;
        var em = emf.createEntityManager();
        var tx = em.getTransaction(); // Is an EntityTransaction
        tx.begin();
        em.merge(clazz.entityObj);
        tx.commit();
        em.close();
    }
    
    function deleteRow(subpkgname,javaClass,entityPKObject) {
        var emf = module[subpkgname].helpers.emf;
        var em = emf.createEntityManager();
        var tx = em.getTransaction(); // Is an EntityTransaction
        tx.begin();
        var instanceObj = em.find(javaClass,entityPKObject);
        em.remove(instanceObj);
        tx.commit();
        em.close();
    }

    function findInstanceForPK(subpkgname,javaClass,entityPKObject) {
        var emf = module[subpkgname].helpers.emf;
        var em = emf.createEntityManager();
        var tx = em.getTransaction(); // Is an EntityTransaction
        tx.begin();
        var instanceObj = em.find(javaClass,entityPKObject);
        tx.commit();
        em.close();
        return instanceObj;
    }

    function findByQueryString(clazz,query,queryParams,isSingle,currPosition) {
        var emf = module[clazz.subpkgname].helpers.emf;
        var em = emf.createEntityManager();
        var tx = em.getTransaction(); // Is an EntityTransaction
        var result;
        tx.begin();
        var q = em.createQuery(query);
        if (queryParams == undefined || queryParams == null || queryParams.length == 0) {
        } else {
            for (var param in queryParams) {
                q.setParameter(param,queryParams[param]);
            }
        }
        if (currPosition > -1) {
            q.setFirstResult(currPosition);
            q.setMaxResults(clazz.queries["noofRowsPerPage"]);
        }
        if (isSingle) {
            try {
                result = q.getSingleResult();
            } catch (exception) {
                var exceptionMsg = exception.description;
                if (exception.description == null) {
                    exceptionMsg = exception.message;
                }                            
                if (exceptionMsg.indexOf("NoResultException") != -1) {
                    // Ignore this exception
                }
            }
        } else {
            result = q.getResultList();
        }
        tx.commit();
        em.close();
        return result;
    } //findByQueryString

    /*
    ****************************************************************************
    * These functions help with providing functionality for the CRUD generator 
    * application.
    ****************************************************************************
    */
    function getAllRows(clazz) {
        return findByQueryString(clazz,clazz.queries["allRows"], null,false,-1);
    }

    function getArrayRows(clazz,currPosition) {
        var orderByClause = String("");
        for (var indx in clazz.primaryKeys) {
            if (orderByClause.length > 1) {
                orderByClause = orderByClause.concat(",");
            }
            orderByClause = orderByClause.concat(clazz.queries["alias"],".",clazz.primaryKeys[indx]);
        }
        var query = String("").concat(clazz.queries["allRows"]).concat(" order by ").concat(orderByClause);
        return findByQueryString(clazz,query, null,false,currPosition);
    }

    function getAttributeData(columnName,clazz) {
        var getMethodString = String("get").concat(capitalize(columnName));
        var colValue = clazz[getMethodString]();
        return colValue;
    } //getAttributeData
    
    function getPKValuesForObject(clazz) {
        var pkValues = {};
        var pkNames = clazz.primaryKeys;
        for (var pkField in pkNames) {
            var pkFieldName = pkNames[pkField];
            var getMethodString = String("get").concat(capitalize(pkFieldName));
            var pkFieldValue = clazz[getMethodString]();
            pkValues[pkFieldName] = pkFieldValue;
        }
        return pkValues;
    } //getPKValuesForObject
 
    function findByPKValueObject(clazz,entityPKObject) {
        var javaClass = eval(String("new Packages.").concat(clazz.entityClassName).concat("();")).getClass();
        return findInstanceForPK(clazz.subpkgname,javaClass,entityPKObject);
    } //findByPKValueObject

    function escapeDisplayStringValue(dispStrVal) {
        return dispStrVal.replace(/&/g, '&amp;')
                         .replace(/"/g, '&quot;')
//                         .replace(/'/g, '&apos;')
                         .replace(/'/g, '&#039;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;');
    } //escapeDisplayStringValue
    
    function capitalize(s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    } //capitalize
    
    function getRelationDisplayInfo(clazz,attrbName,trgtClazz) {
        var queryStr = generateRelationQuery(clazz,attrbName,trgtClazz);
        return generateRelationDisplayInfo(trgtClazz,queryStr,null,-1);
    } //getRelationDisplayInfo

    function generateRelationQuery(clazz,attrbName,trgtClazz) {
        var relations        = clazz.relations;
	var relFieldInfo     = relations[attrbName];
	var isOwner          = relFieldInfo["isOwner"];
        var isCollection     = relFieldInfo["isCollection"];
        var trgtEntityName   = trgtClazz["entityname"];
        var trgtEntityAlias  = String(" ").concat(trgtClazz["queries"]["alias"]);
        if (trgtEntityAlias == undefined) {
            trgtEntityAlias = String(" q");
        }
	var trgtPkFieldNames     = trgtClazz["primaryKeys"];
	var trgtRelDisplayAttrbs = trgtClazz["queries"]["displayRelFields"];
        
	var queryStr     = String("select");
	var selectString = String("");
        var pkFieldStr   = String("");
	for (var pkFld in trgtPkFieldNames) {
	    var pkFieldName = trgtPkFieldNames[pkFld];
	    if (pkFieldStr.length > 0) {
	        pkFieldStr = pkFieldStr.concat(" , ");
	    }
	    pkFieldStr = pkFieldStr.concat(trgtEntityAlias,".",pkFieldName);
	}
        for (var fldNo in trgtRelDisplayAttrbs) {
	    var relDisplayFieldName = trgtRelDisplayAttrbs[fldNo];
	    if (selectString.length > 0) {
	        selectString = selectString.concat(",");
	    }
	    selectString = selectString.concat(trgtEntityAlias,".",relDisplayFieldName);
        }
        queryStr = queryStr.concat(pkFieldStr,",",selectString, " from ",trgtEntityName,trgtEntityAlias);
	return queryStr.concat(" order by ",pkFieldStr);
    } //generateRelationQuery
    
    function generateRelationDisplayInfo(trgtClazz,queryStr,paramsArray,currPosition) {
        var relResult  = findByQueryString(trgtClazz,queryStr,paramsArray,false,-1).toArray();
        var trgtPkKeys = trgtClazz["primaryKeys"];
	var trgtRelDisplayAttrbs = trgtClazz["queries"]["displayRelFields"];
        var resultArray = [];
        var attrbValue;
        for (var relRowNo in relResult) {
            var currRow   = relResult[relRowNo];
            var resultRow = [];
            var pkString  = String("");
            for (var pkcolNo in trgtPkKeys) {
                var pkAttrbName = trgtPkKeys[pkcolNo];
                attrbValue = currRow[pkcolNo];
                if (attrbValue instanceof java.lang.String) {
                    attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
                }
                if (pkString.length > 0) {
                    pkString = pkString.concat(",");
                }
                pkString = pkString.concat(pkAttrbName,"=",attrbValue);
            }
            var colNo = trgtPkKeys.length;
            resultRow.push(pkString);
            var displayText = String("");
            for (var nonpkcolNo in trgtRelDisplayAttrbs) {
                attrbValue = currRow[colNo++];
                if (attrbValue instanceof java.lang.String) {
                    attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
                }
                if (displayText.length > 0) {
                    displayText = displayText.concat(",");
                }
                displayText = displayText.concat(attrbValue);
            }
            resultRow.push(displayText);
            resultArray.push(resultRow);
        } // for relRowNo
        return resultArray;
    } //generateRelationDisplayInfo
    
    /**
     * Return a Array of Strings each of the form "idField1=idValue1,idField2=idValue2,..."
     * which would be used to compare with existing row of the listbox to set
     * the selected to be true or not.
     */
    function getPkStringForRelEntity(trgtClazz,attrbVal,isCollection) {
        var returnVal = String("");
        // If it is collection we would get a collection of targetEntityObjects
        if (attrbVal != null || attrbVal != undefined) {
            if (isCollection) {
                var collIter = attrbVal.iterator();
                var newResult = [];
                while (collIter.hasNext()) {
                    trgtClazz.entityObj = collIter.next();
                    returnVal = returnVal.concat(getPKStringValueForTrgtClazz(trgtClazz));
                } // while collIter.hasNext()
            } else {
                trgtClazz.entityObj = attrbVal;
                if (!(attrbVal == null || attrbVal.length < 1)) {
                    returnVal = returnVal.concat(getPKStringValueForTrgtClazz(trgtClazz));
                }
            }
        }
        return returnVal;
    } //getPkStringForRelEntity
    
    /**
     * Return a Array of Strings each of the form "dispFieldValue1,dispFieldValue2,..."
     * This information would be used to display the listbox in the List view.
     */
    function getDisplayStringForRelEntity(trgtClazz,attrbVal,isCollection) {
        var returnVal = [];
        // If it is collection we would get a collection of targetEntityObjects
        if (isCollection) {
	    var collIter = attrbVal.iterator();
	    var newResult = [];
	    while (collIter.hasNext()) {
                trgtClazz.entityObj = collIter.next();
	        returnVal.push(getDisplayStringForTrgtClazz(trgtClazz));
            } // while collIter.hasNext()
        } else {
            trgtClazz.entityObj = attrbVal;
            if (!(attrbVal == null || attrbVal.length < 1)) {
                returnVal.push(getDisplayStringForTrgtClazz(trgtClazz));
            }
        }

        return returnVal;
    } //getDisplayStringForRelEntity

    function getPKStringValueForTrgtClazz(trgtClazz) {
        var trgtPkFieldNames = trgtClazz["primaryKeys"];
        var pkValues   = getPKValuesForObject(trgtClazz);
        var pkValueStr = String("");
        for (var pkFld in trgtPkFieldNames) {
            var pkFieldName = trgtPkFieldNames[pkFld];
            var attrbValue  = pkValues[pkFieldName];
            if (attrbValue instanceof java.lang.String) {
                attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
            }           
            pkValueStr = pkValueStr.concat(pkFieldName,'=',attrbValue,'$_%');
        } // for pkFld in trgtPkFieldNames
        
        return pkValueStr;
    } //getPKStringValueForTrgtClazz

    function getDisplayStringForTrgtClazz(trgtClazz) {
        var relDisplayFieldNames = trgtClazz["queries"]["displayRelFields"];
        var dispValueStr = String("");
        for (var dispFld in relDisplayFieldNames) {
            var dispFieldName   = relDisplayFieldNames[dispFld];
            var getMethodString = String("get").concat(capitalize(dispFieldName));
            var attrbValue      = trgtClazz[getMethodString]();
            if (attrbValue instanceof java.lang.String) {
                attrbValue = escapeDisplayStringValue(String(attrbValue.toString()).substring(0,75));
            }
            if (dispFld > 0) {
                dispValueStr = dispValueStr.concat(",");
            }
            dispValueStr = dispValueStr.concat(attrbValue);
        } // for dispFld in relDisplayFieldNames
        
        return dispValueStr;
    } //getDisplayStringForTrgtClazz

    function getHtmlForColumn(clazz,htmlStr) {
        var colsToList = clazz.columnsToList;
        var colsValue  = getDisplayColumnValues(clazz);
        
        for (var colNo in colsToList) {
            var colName = colsToList[colNo];
            attrbValue = colsValue[colNo];

           if(clazz.relations != undefined){
               if (colName in clazz.relations) {
                    if (attrbValue.length == 0) {
                        htmlStr = htmlStr.concat("<td></td>");
                    } else if (attrbValue.length == 1) {                            
                        htmlStr = htmlStr.concat("<td>",attrbValue[0],"</td>");
                    } else if (attrbValue.length > 1) {
                        htmlStr = htmlStr.concat("<td><select id=" + colName + " name=" + colName + " size=1>");
                        for (var optNo in attrbValue) {
                            var optVal = attrbValue[optNo];
                            htmlStr = htmlStr.concat("<option>",optVal);
                        }
                        htmlStr = htmlStr.concat("</select>");
                    } else {
                        htmlStr = htmlStr.concat("<td></td>");
                    }
                }
           }else {
                htmlStr = htmlStr.concat("<td>",attrbValue,"</td>");
            }
        }
        return htmlStr;
    } //getHtmlForColumn


    function getDisplayColumnValues(clazz) {
        var retValue   = [];
        var colsToList = clazz.columnsToList;
        var attrbValue;
        
        for (var colNo in colsToList) {
            var colName = colsToList[colNo];
            attrbValue  = getAttributeData(colName,clazz);
            if (attrbValue instanceof java.lang.String) {
                attrbValue = escapeDisplayStringValue(String(attrbValue.toString()));
            }
            if(clazz.relations != undefined){
            if (colName in clazz.relations) {
                var relFieldInfo    = clazz.relations[colName];
                var moduleName      = relFieldInfo["moduleName"];
                var moduleClassName = relFieldInfo["moduleClassName"];
                var trgtClazz       = new module[clazz.subpkgname][moduleName][moduleClassName];
                attrbValue = getDisplayStringForRelEntity(trgtClazz,attrbValue,relFieldInfo["isCollection"]);
            }
            }
            retValue.push(attrbValue);
        }
        return retValue;
    } //getDisplayColumnValues

});
