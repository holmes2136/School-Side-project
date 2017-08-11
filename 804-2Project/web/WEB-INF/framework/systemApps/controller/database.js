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

// Database controller

library.common.define(controller.system, "database", function() {
    this.Database = function() {
        this.index = function() {
            model = {};
            model.datasources = [];
            var gotOne = false;
            for (var p in application.datasource) {
                if (application.datasource[p].dataSource != undefined) {
                    model.datasources.push(p);
                    gotOne = true;
                }
            }
            if (!gotOne) {
                invocation.flash["notice"] = "No datasources available";
            }
            library.view.render({view: "system/database/database.ejs",
                                 layout: "system/main/layout.ejs"});
        }

        this.browse = function() {
            library.httpserver.onMethod({
                GET: function() {
                    var params = library.httpserver.parseQueryString();
                    if (params.name) {
                        var name = String(params.name);
                        var filterFn;
                        if (params.schemaName) {
                            filterFn = function(s) { return s.@name == String(params.schemaName); };
                        }
                        var metadata = createMetadata(name, filterFn);
                        response.setStatus(200);
                        response.setContentType("application/xml; charset=utf-8");
                        var writer = response.getWriter();
                        writer.print(metadata.toXMLString());
                        writer.flush();
                    }
                    else {
                        library.httpserver.sendNotFound();
                    }                    
                },
                POST: function() {
                    var params = library.httpserver.parseRequestParameters();
                    if (params.name) {
                        var name = String(params.name);
                        var schemaName = String(params.schemaName);
                        if (application.datasource[name] == undefined) {
                            invocation.flash["notice"] = "Error: unknown datasource: " + name;
                            library.httpserver.sendFound("./");
                        }
                        else {
                            invocation.flash["datasourceName"] = name;
                            invocation.flash["schemaName"] = schemaName;
                            library.httpserver.sendFound("./display");
                        }
                    }
                    else {
                        library.httpserver.sendNotFound();
                    }
                }
            });
        }

        this.display = function() {
            var name = invocation.flash["datasourceName"];
            var schemaName = invocation.flash["schemaName"];
            if (name) {
                name = String(name);
                schemaName = String(schemaName);
                model = {};
                model.datasourceName = name;
                var filterFn;
                if (schemaName) {
                    model.schemaName = schemaName;
                    filterFn = function(s) { return s.@name == schemaName; };
                }
                model.metadata = createMetadata(name, filterFn).toXMLString();
                library.view.render({view: "system/database/display.ejs",
                                     layout: "system/main/layout.ejs"});
            }
            else {
                library.httpserver.sendFound("./");
            }           
        }
    }

    function createMetadata(datasourceName, schemaFilterFn) {
        var sql = new library.db.SqlHelper({name: datasourceName});
        var result;
        library.db.using(sql, function() {
            result = sql.getMetadata({schemaFilter: schemaFilterFn});
        });
        return result;
    }
});
