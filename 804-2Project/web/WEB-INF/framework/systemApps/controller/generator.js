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

// Generator controller

library.common.define(controller.system, "generator", function() {
    this.Generator = function() {
        this.index = function() {
            model = {};
            library.view.render({view: "system/generator/generator.ejs",
                                 layout: "system/main/layout.ejs"});
        }

        this.controller = function() {
            library.httpserver.onMethod({
                POST: function() {
                    params = library.httpserver.parseRequestParameters();
                    if (params.name) {
                        var name = String(params.name);
                        if (name.charAt(0) == "/") {
                            invocation.flash["notice"] = "Error: resource name cannot be absolute.";
                        }
                        else {
                            var filename = application.path.controller[0] + "/" + name + ".js";
                            var viewFilename = application.path.view[0] + "/" + name + ".ejs";
                            if (library.resource.exists(filename) ||
                                library.resource.isDirectory(filename)) {
                                invocation.flash["notice"] = "Error: resource " + filename + " already exists.";
                            }
                            else if (library.resource.exists(viewFilename) ||
                                library.resource.isDirectory(viewFilename)) {
                                invocation.flash["notice"] = "Error: resource " + viewFilename + " already exists.";
                            }
                            else {
                                var model = {};
                                var pathName = name;
                                var moduleName = "";
                                var i = name.indexOf('/');
                                if (i != -1) {
                                    moduleName = "." + name.substring(0, i).replace('/', '.');
                                    name = name.substring(i + 1);
                                }
                                var model = {name: name,
                                             Name: capitalize(name),
                                             moduleName: moduleName,
                                             pathName: pathName,
                                             viewResourceName: viewFilename};
                                createResourceFromTemplate(filename,
                                            "/framework/systemApps/template/controller/controller.fm",
                                            model);
                                createResourceFromTemplate(viewFilename,
                                            "/framework/systemApps/template/controller/view.fm",
                                            model);

                                invocation.flash["notice"] = "Controller generated:&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"" + library.httpserver.makeUrl("/" + name) + "\">" + name + "</a>";
                            }
                        }
                        library.httpserver.sendFound("./");
                    }
                    else {
                        library.httpserver.sendNotFound();
                    }
                }
            });            
        }
        
        function capitalize(s) {
            return s.substring(0, 1).toUpperCase() + s.substring(1);
        }

        function createResourceFromTemplate(resourceName, templateName, model) {
            var outputStream = library.resource.getOutputStream({name: resourceName, create: true});                                
            var writer = new java.io.OutputStreamWriter(outputStream);
            try {
                library.template.process(templateName, model, writer);
            }
            finally {
                writer.close();
            }        
        }
                
    }
});
