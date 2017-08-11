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

// Jpagenerator controller

library.common.define(controller.system, "jpagenerator", function() {
    this.Jpagenerator = function() {
        this.index = function() {
            var punames = library.persistence.getPUNames();
            model = {punames: punames};
            library.view.render({view: "system/jpagenerator/jpagenerator.ejs",
                                 layout: "system/main/layout.ejs"});
        }
                
        this.crud = function() {
            library.httpserver.onMethod({

                POST: function() {
                    var persistence = library.persistence;
                    var puname = String(request.getParameter("punameList"));
                    var em;
                    try {
                        em = persistence.getEntityManager(puname);
                    } catch (exception) {
                        var exceptionMsg = exception.description;
                        if (exception.description == null) {
                            exceptionMsg = exception.message;
                        }                            
                        if (exceptionMsg.indexOf("DatabaseException") != -1) {
                            invocation.flash["notice"] = "Please ensure that the database is up and running.";
                        } else if (exceptionMsg.indexOf("NullPointerException") != -1) {
                            invocation.flash["notice"] = "Please select a Persistence Unit to work with.";
                        }
                    }
                    if (em != undefined) {
                        var entities = persistence.checkGlobalsForClassesInfo(puname);

                        generateJPAArtifacts(entities);
                        displayEntityList(entities);
                    }
                    library.httpserver.sendFound("./");
                }
            });
        }; //crud

        function createResourceFromTemplate(resourceName, templateName, model, overwrite) {
            if (!overwrite && (library.resource.exists(resourceName) ||
                library.resource.isDirectory(resourceName))) {
                invocation.flash["notice"] = "Skipping the creation of " + resourceName + " as it already exists.";
                return;
            } 
            var outputStream;
            if (!overwrite) {
                outputStream = library.resource.getOutputStream({name: resourceName, create: true});
            } else {
                outputStream = library.resource.getOutputStream({name: resourceName, create: true, append:true});
            }
            var writer = new java.io.OutputStreamWriter(outputStream);
            try {
                library.template.process(templateName, model, writer);
            }
            finally {
                writer.close();
            }
        } //createResourceFromTemplate
        
        function generateJPAArtifacts(entities,puname) {
            var model;
            var persistence = library.persistence;
            var puname = String(request.getParameter("punameList"));
            var subpkgname = String(request.getParameter("subpkgname"));
            var urlprefix = String(request.getParameter("urlprefix"));
            var genoption = String(request.getParameter("genapptype"));

            for ( var t in entities) {
                var entityname    = String(entities[t].displayName);
                var modulename    = String(entityname).toLowerCase();
                var tmpEntityname = entityname.toLowerCase();
                var classname     = tmpEntityname.substring(0,1).toUpperCase() 
                                    + tmpEntityname.substring(1);
                var columns = entities[entityname.toLowerCase()].attributes;
                var javaClassName = String(entities[entityname.toLowerCase()].javaClass.getName());
                var relText = persistence.prepareRelationshipsForEntityModule(columns,puname,classname,entities);

                writeModelFile(modulename,classname,subpkgname,entityname,javaClassName,entities,columns,relText);
                writeControllerFile(modulename,classname,subpkgname,urlprefix,entityname,javaClassName,genoption);
                writeViewFile(modulename,classname,subpkgname,urlprefix,genoption);
                writeEditFile(modulename,classname,subpkgname,urlprefix,columns,relText,genoption);

            } //for (t in entities)
            
            writeHelperFile(subpkgname,puname);
            writeCSSStyleSheet();
            writeStartupFile(subpkgname,urlprefix);
            registerApplication(subpkgname,urlprefix);

            invocation.flash["notice"] = "Phobos artifacts for Java Persisence Entities successfully generated: ";
        } //generateJPAArtifacts
        
        function writeModelFile(modulename,classname,subpkgname,
            entityname,javaClassName,entities,columns,relText) {
            var modelfilename = 
                application.path.module[0] + "/" + subpkgname + "/" + modulename + ".js";

            var model;
            var persistence = library.persistence;
            var puname      = String(request.getParameter("punameList"));
            var columnNames = persistence.getEntityColumnNames(columns);
            var colText     = persistence.prepareMethodsForEntityModule(columns,puname,classname);
            var primaryKeys = persistence.getPrimaryKeyAttrbNames(columns);
            var nonprimaryKeycols = persistence.getNonPrimaryKeyAttrbNames(columns);
            var displayRelFields  = persistence.getDisplayRelFields(columns);
            var queryAllRows      = String("select q from ").concat(
                String(entities[entityname.toLowerCase()].javaClass.getSimpleName())," q");
            var queryCountRows    = String("select count(q) from ").concat(
                String(entities[entityname.toLowerCase()].javaClass.getSimpleName())," q");
            var accessorText      = persistence.prepareJavaAccessorForEntityModule(classname
                ,columns,entities[entityname.toLowerCase()]);

            model = { modulename:          modulename
                      , classname:         classname
                      , entityname:        entityname
                      , javaClassName:     javaClassName
                      , puname:            puname
                      , subpkgname:        subpkgname
                      , allcols:           columnNames
                      , nonprimaryKeycols: nonprimaryKeycols
                      , colText:           colText
                      , primaryKeys:       primaryKeys
                      , queryAllRows:      queryAllRows
                      , queryCountRows:    queryCountRows
                      , relText:           relText
                      , accessorText:      accessorText
                      , displayRelFields:  displayRelFields
                    };
            createResourceFromTemplate(modelfilename,
                "/framework/systemApps/template/crud/model.fm",model,false);
        }

        function writeControllerFile(modulename,classname,subpkgname,urlprefix,
            entityname,javaClassName,genoption) {
            var controllerfilename = 
                application.path.controller[0] + "/" + subpkgname + "/" + modulename + ".js";
            
            var model = { modulename:      modulename
                      , classname:     classname
                      , entityname:    entityname
                      , javaClassName: javaClassName
                      , subpkgname:    subpkgname
                      , urlprefix:     urlprefix
                    };
            if (genoption == "html") {
                createResourceFromTemplate(controllerfilename,
                    "/framework/systemApps/template/crud/controller.fm",model,false);
            } else if (genoption == "ajax") {
                createResourceFromTemplate(controllerfilename,
                    "/framework/systemApps/template/crud/ajaxcontroller.fm",model,false);
            }
        }
        
        function writeViewFile(modulename,classname,subpkgname,urlprefix,genoption) {
            var jmakiviewfilename = 
                application.path.view[0] + "/" + subpkgname + "/" + modulename + "/" + "jmakilist.ejs";
            var htmlviewfilename = 
                application.path.view[0] + "/" + subpkgname + "/" + modulename + "/" + "htmllist.ejs";
            
            var model = { modulename:  modulename
                      , classname: classname
                      , urlprefix: urlprefix
                    };
            if (genoption == "html") {
                createResourceFromTemplate(jmakiviewfilename,
                    "/framework/systemApps/template/crud/jmakilist.fm",model,false);
                createResourceFromTemplate(htmlviewfilename,
                    "/framework/systemApps/template/crud/htmllist.fm",model,false);
            } else if (genoption == "ajax"){
                createResourceFromTemplate(htmlviewfilename,
                    "/framework/systemApps/template/crud/ajaxlist.fm",model,false);
            }
        }
        
        function writeEditFile(modulename,classname,subpkgname,urlprefix,columns,relText,genoption) {
            var vieweditfilename = 
                application.path.view[0] + "/" + subpkgname + "/" + modulename + "/" + "edit.ejs";
            var editText = library.persistence.generateHtmlForEditView(columns); //For Edit views
            var hasRelations = false;
            if (relText.length > 0) {
                hasRelations = true;
            }
            var relLoadFunction = library.persistence.prepareOnLoadForEditView(columns,hasRelations);
            model = { modulename:        modulename
                      , classname:       classname
                      , urlprefix:       urlprefix
                      , editText:        editText
                      , relLoadFunction: relLoadFunction
                    };
            if (genoption == "html") {
                createResourceFromTemplate(vieweditfilename,
                    "/framework/systemApps/template/crud/edit.fm",model,false);
            } else if (genoption == "ajax") {
                createResourceFromTemplate(vieweditfilename,
                    "/framework/systemApps/template/crud/ajaxedit.fm",model,false);
            }
        }

        function writeHelperFile(subpkgname,puname) {
            var helpersfilename = 
                application.path.module[0] +  "/" + subpkgname + "/" + "helpers" + ".js";
            
            model = { subpkgname: subpkgname
                      , puname:   puname
                    };
            createResourceFromTemplate(helpersfilename,
                    "/framework/systemApps/template/crud/helpers.fm",model,false);
        }

        function writeCSSStyleSheet() {
            model = { 
                    };
            var stylesheet = "/static/jpagenerator.css";
            createResourceFromTemplate(stylesheet,
                    "/framework/systemApps/template/crud/jpagenerator.css",model,false);
        }
        
        function writeStartupFile(subpkgname,urlprefix) {
            model = { subpkgname: subpkgname
                      , urlprefix:  urlprefix
                    };
            var startupfilename = "/application/startup.js";
            createResourceFromTemplate(startupfilename,
                    "/framework/systemApps/template/crud/startup.fm",model,true);
        }
        
        function registerApplication(subpkgname,urlprefix) {
            var url = String("/").concat(urlprefix).concat("/@controller/@action");
            application.mapping.rules.push(
                { url: url,
                  fn: "library.mapping.maybeController",
                  prefix: subpkgname
                }
            );
            library.lifecycle.updateRules();
        }
        
        function displayEntityList(entities,urlprefix) {
            var urlprefix = String(request.getParameter("urlprefix"));
            for ( var t in entities) {
                // Only display persistent classes that have @Entity annotation on them
                if (entities[t].persistentType == "entity") {
                    var entityname = String(entities[t].displayName);
                    var modulename = String(entityname).toLowerCase();
                    var classname = entityname;

                    invocation.flash["notice"] = invocation.flash["notice"] + 
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "<a href=\"" + library.httpserver.makeUrl("/" + urlprefix + "/" + modulename + "/htmllist") + 
                        "\">" + classname + " List</a>" +
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                }
            } // for(t in entities)
        } //displayEntityList
        
    } //this.Jpagenerator
});
