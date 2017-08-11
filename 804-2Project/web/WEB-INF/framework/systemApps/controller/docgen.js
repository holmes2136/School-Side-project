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
 * Copyright 2007 Sun Microsystems, Inc. All rights reserved.
 */

library.common.define(controller.system, "docgen", function() {
    
    function Docgen() {
    }
    
    Docgen.prototype.index = function() {    
        model = {};
        library.view.render({view: "system/docgen/main.ejs", layout: "system/main/layout.ejs"});
    }

    /*
    // only used for testing
    Docgen.prototype.generateAll = function() {
        var env = module.system.doc.parseDocumentation(["application.path.library"]);
        model = {env: env};
        library.view.render({view: "system/docgen/doc.ejs", layout: "system/main/layout.ejs"});
    }
    */
    
    Docgen.prototype.generateAllAsJSON = function() {
        var env = module.system.doc.parseDocumentation(["application.path.library"]);
        function formatCommentsAsHTML(obj) {
            if (library.lang.isArray(obj)) {
                for (var i = 0; i < obj.length; ++i) {
                    obj[i] = formatCommentsAsHTML(obj[i]);
                }
            }
            else if (library.lang.isJavaObject(obj)) {
                // no-op
            }
            else if (library.lang.isObject(obj)) {
                for (var p in obj) {
                    if (!obj.hasOwnProperty(p)) {
                        continue;
                    }
                    var v = obj[p];
                    if (p == "comment" && library.lang.isString(v)) {
                        v = sanitize(v);
                    }
                    else {
                        v = formatCommentsAsHTML(v);
                    }
                    obj[p] = v;
                }
            }
            return obj;
        }
       function sanitize(s) {
           if (s == undefined) s = "";
           s = s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
           s = module.system.formatter.asHTML(s);
           return s;
       }

        env.modules = formatCommentsAsHTML(env.modules);
        library.httpserver.sendJSON(env.modules);
    }

    Docgen.prototype.generateAllLibrariesAsHTML = function() {
        var env = module.system.doc.parseDocumentation(["application.path.library"]);
        var uuid = library.rest.createUUID();
        model = {env: env,
                 title: "Phobos Library Documentation",
                 leftHeader: 'All <a class="projectReference" href="https://phobos.dev.java.net">Phobos</a> libraries',
                 footerFragment: 'libraries_footer.html.ejs',
                 mainPage: 'libraries_main.html.ejs'
                 };
        doGenerate(uuid);
    }
    
    Docgen.prototype.generateAllModulesAsHTML = function() {
        var env = module.system.doc.parseDocumentation(["application.path.module"]);
        var uuid = library.rest.createUUID();
        model = {env: env,
                 title: "Application Documentation",
                 leftHeader: 'All application modules',
                 footerFragment: 'modules_footer.html.ejs',
                 mainPage: 'modules_main.html.ejs'
                 };
        doGenerate(uuid);
    }
        
    function doGenerate(uuid) {
        var tmpDirName = application.dir.scratch + "/" + uuid;
        var tmpDir = java.io.File(tmpDirName);     
        tmpDir.mkdirs();
        tmpDirName = String(tmpDir.getCanonicalPath());
        model.footerFragment = "/framework/systemApps/template/docgen/" + model.footerFragment;
        
        function renderTemplateToFile(templateName, fileName) {
            var writer = new java.io.PrintWriter(new java.io.FileWriter(tmpDirName + "/" + fileName));
            try {
                library.view.silentRender({view: "/framework/systemApps/template/docgen/" + templateName, writer: writer});
            }
            finally {
                writer.close();
            }
        }

        renderTemplateToFile("index.html.ejs", "index.html");
        renderTemplateToFile("summary.html.ejs", "summary.html");
        renderTemplateToFile(model.mainPage, "main.html");
        renderTemplateToFile("doc.css.ejs", "doc.css");
        renderTemplateToFile("moduleList.html.ejs", "moduleList.html");
        
        for (var i in model.env.modules) {
            var currentModule = model.env.modules[i];
            model.currentModule = currentModule;
            renderTemplateToFile("moduleOverview.html.ejs", currentModule.name + "_overview.html");
            renderTemplateToFile("moduleContents.html.ejs", currentModule.name + ".html");
            delete model.currentModule;
        }
        
        var location = tmpDirName + "/index.html";
        invocation.flash["notice"] = "<a href='" + library.httpserver.makeUrl("/system/docgen/browse/" + uuid + "/index.html") + "'>Documentation</a> generated under " + tmpDirName + ".";
        library.httpserver.sendFound(library.httpserver.makeUrl("/system/docgen/"));
    }

    Docgen.prototype.browse = function() {
        try {
            var uri = request.getRequestURI();
            var uuid = invocation.mapping.uuid;
            var i = uri.indexOf(uuid);
            var j = uri.indexOf("/", i+1);
            var resourceName = uri.substring(j);
            var contentType = library.rest.getContentType(library.rest.getExtension(resourceName));
            var docDirName = application.dir.scratch + "/" + uuid;
            var docstream = new java.io.FileInputStream(docDirName + resourceName);
            try {
                response.setStatus(200);
                response.setContentType(contentType);
                writer = response.getWriter();
                var s = library.httpserver.streamToString(docstream, "utf-8");
                writer.print(s);
                writer.flush();
            }
            finally {
                docstream.close();
            }
        }
        catch (e) {
            library.httpserver.sendNotFound();
        }
    }

    // export the controller class
    this.Docgen = Docgen;
});
