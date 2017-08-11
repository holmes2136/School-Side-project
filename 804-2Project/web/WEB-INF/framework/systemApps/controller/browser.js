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

// Browser controller

library.common.define(controller.system, "browser", function() {
    this.Browser = function() {
        this.index = function() {
            model = {applicationRoot: "/application",
                     frameworkRoot: "/framework",
                     staticRoot: "/static",
                     path: {}};
            model.path = {
                content: application.path.content,
                script: application.path.script,
                library: application.path.library,
                module: application.path.module,
                controller: application.path.controller,
                dynamic: application.path.dynamic,
                view: application.path.view,
                test: application.path.test
            };
            library.view.render({view: "system/browser/browser.ejs",
                                 layout: "system/main/layout.ejs"});
        }

        this.display = function() {
            if (request.getQueryString() != null) {
                var params = library.httpserver.parseQueryString(request.getQueryString());
                if (params.name != undefined && (library.resource.exists(params.name) ||
                                                 library.resource.isDirectory(params.name))) {
                    var last = java.text.DateFormat.getDateTimeInstance(java.text.DateFormat.LONG, java.text.DateFormat.LONG).format(new java.util.Date(library.resource.lastModified(params.name)));
                    model = {name: params.name,
                             lastModified: last,
                             components: []};
                                        
                    var comps = params.name.split('/');
                    var current = "";
                    for (var i in comps) {
                        if (comps[i] == "") {
                            continue;
                        }
                        model.components.push(comps[i]);
                    }
                    
                    if (library.resource.isDirectory(params.name)) {
                        model.children = library.lang.toArray(library.resource.children(params.name));
                        library.view.render({view: "system/browser/list.ejs",
                                             layout: "system/main/layout.ejs"});
                    }
                    else {                    
                        library.view.render({view: "system/browser/display.ejs",
                                             layout: "system/main/layout.ejs"});
                    }
                }
                else {
                    library.httpserver.sendNotFound();
                }
            }
            else {
                library.httpserver.sendNotFound();
            }
        }
        
        this.rules = function() {
            model = {};
            model.rules = globals.mapping.rules;
            library.view.render({view: "system/browser/rules.ejs",
                                 layout: "system/main/layout.ejs"});
        }        
    };
});
