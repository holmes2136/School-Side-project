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
 * Copyright 2008 Sun Microsystems, Inc. All rights reserved.
 */
 
 /**
 * jMaki library module.
 *
 */

library.common.define(library, "jmaki", function() {
    var log = library.log.get("framework.jmaki");

    /**
     * Insert a jMaki component in a view.
     *
     * @param(obj, object, required)
     *     used for keyword arguments
     * @param(writer, java.io.PrintWriter, optional)
     *    writer to use, defaults to ``context.writer``
     * @kparam(component, string, required)
     *    component name, e.g. ``dojo.fisheye``
     * @kparam(args, object, optional)
     *    arguments to be passed to the widget using JSON
     * @kparam(service, string, optional)
     *    service call back URL
     * @kparam(id, string, optional)
     *    widget id
     * @kparam(template, string, optional)
     *    template to be used instead of the one that is part of the widget definition
     * @kparam(value, string, optional)
     *    initial value for the widget
     * @return(undefined)
     */
    function insert(obj, writer) {
        if (log.traceEnabled) {
            log.trace("jmaki.insert" + (obj && obj.component ? (": " + obj.component) : ""));
        }
        var component, args, service, type, id, template, onLoad, value, publish, subscribe;
        if (library.lang.isString(obj)) {
            component = obj;
        }
        else if (library.lang.isObject(obj)) {
            component = obj.component;
            args = obj.args;
            service = obj.service;
            type = obj.type;
            id = obj.id;
            template = obj.template;
            onLoad = obj.onLoad;
            value = obj.value;
            publish = obj.publish;
            subscribe = obj.subscribe;
        }
        else {
            if (log.errorEnabled) {
                log.error("jmaki.insert: invalid argument type");
            }
            throw new Error("invalid argument type");   
        }
        if (component == undefined) {
            if (log.errorEnabled) {
                log.error("jmaki.insert: missing required argument: component");
            }
            throw new Error("missing required argument (component)");
        }
        
        var name = component;
        component = component.replace(/\./g, '/');
         if (writer == undefined) {
            writer = context.getWriter();
        }

        var prefix = application.options.jmaki.prefix + "/";
        var webroot = getWebRoot();
        
        checkEnabled();
        
        if (type == undefined) {
            type = name;
        }
        
        var uuid = id != undefined ? id : createUuid(name.replace('.','_'));

        // find the location the widget.json
        var wcfg = prefix + component + "/widget.json";
        var cfg = library.common.findFirst(wcfg, application.path.content);
        
        if (!use(type, undefined, cfg)) {
            var i = type.indexOf('.');
            if (i != -1) {
                type = type.substring(0, i);
                use(type, undefined, cfg, uuid);
            }
        }

        if (!invocation.__jmaki__.component[component]) {
            
            invocation.__jmaki__.component[component] = {};

            var scriptName = prefix + component + "/component.js";
            if (library.common.findFirst(scriptName, application.path.content)) {
                var scriptUrl = library.httpserver.makeUrl(scriptName);
                invocation.__jmaki__.component[component].scriptUrl = scriptUrl;
            }
            
            var cssName = prefix + component + "/component.css";
            if (library.common.findFirst(scriptName, application.path.content)) {
                var cssUrl = library.httpserver.makeUrl(cssName);
                if (!invocation.__jmaki__.css[cssUrl]) {
                    writer.println("<link rel='stylesheet' type='text/css' href='" + cssUrl + "'></link>");
                    invocation.__jmaki__.css[cssUrl] = true;
                }
            }            
        }
        // write out the component.js link if it has been written.
        if (!invocation.__jmaki__.script[scriptUrl]) {
            var scriptUrl = invocation.__jmaki__.component[component].scriptUrl;
            writer.println("<script  type='text/javascript' src='" + scriptUrl + "'></script>");
            invocation.__jmaki__.script[scriptUrl] = true;
        }          
        var baseDir = library.httpserver.makeUrl(prefix + component);
        if (service != undefined) {
            if (service.substring(0, 5) != "http:") {
                if (service.charAt(0) != "/") {
                    service = "/" + service;
                }
                service = library.httpserver.makeUrl(service);
            }
        }
        
        if (!invocation.__jmaki__.css[cssUrl]) {
                    writer.println("<link rel='stylesheet' type='text/css' href='" + cssUrl + "'></link>");
                    invocation.__jmaki__.css[cssUrl] = true;
        }    
        
        var preModel = {uuid: uuid,
                     name: name,
                     widgetDir: baseDir,
                     baseDir: baseDir,
                     script: scriptUrl,
                     service: service,
                     onLoad: onLoad,
                     value: value,
                     args: args,
                     publish : publish,
                     subscribe : subscribe
                    };

        var model = {};
        for(var p in preModel) {
            if (preModel[p] != undefined) {
                model[p] = preModel[p];
            }
        }
                
        if (template == undefined) {
            template = prefix + component + "/component.htm";
        }
        
        var templateFile = library.common.findFirst(template, application.path.content);
        // look for component.html if we did not find component.htm
        if (!templateFile) {
            template = prefix + component + "/component.html";
            templateFile = library.common.findFirst(template, application.path.content);
        }
        if (templateFile){
            library.template.process(templateFile, model, writer);
        } else {
            writer.println('Error: Could not find template ' + prefix + component + "/component.htm" +
            " or " +  prefix + component + "/component.html"
            );
        }
        writer.println('<script type="text/javascript">');
        writer.println('jmaki.addWidget(' + library.json.serialize(model) + ');');
        writer.println('</script>');
    }
    
    function createUuid(s) {
        var counter = invocation.session["__jmaki__uuid__"];
        if (counter) {
            counter = Number(counter);
        }
        else {
            counter = 0;
        }
        ++counter;
        invocation.session["__jmaki__uuid__"] = counter;
        return s + counter.toFixed(0);
    }

    function getWebRoot() {
        var webroot = library.httpserver.makeUrl("/");
        webroot = webroot.substring(0, webroot.length - 1);
        return webroot;
    }

    function getCurrentDirectory() {
        var currentDirectory = request.getRequestURI();
        var i = currentDirectory.lastIndexOf('/');
        if (i != -1) {
            if (i == 0) {
                // keep the first '/'
                i = 1;
            }
            currentDirectory = currentDirectory.substring(0, i);
        }
        return getWebRoot() + currentDirectory;
    }
    
    function getPrefix() {
        return application.options.jmaki.prefix + "/";
    }
    
    // make sure jMaki is enabled for the current page
    function checkEnabled(writer) {         
        if (invocation.__jmaki__ == undefined) {
            invocation.__jmaki__ = {
                component: {},
                script: {},
                css: {},
                type: {}
            };
            if (writer == undefined) {
                writer = context.getWriter();
            }
            var webroot = getWebRoot();
            var prefix = getPrefix();
            writer.println('<script type="text/javascript" src="' + library.httpserver.makeUrl(prefix + "jmaki.js") + '"></script>');
            writer.println('<script type="text/javascript">jmaki.webRoot="' + webroot + '"; jmaki.resourcesRoot="/' + application.options.jmaki.prefix +
                           '"; jmaki.xhp="' + webroot + '/xhp";</script>');
            var config = readConfiguration();
            if (config != undefined) {
                if (config.version > 1.2) {
                    if (log.errorEnabled) {
                        log.error("jmaki.insert: unsupported jMaki version (" + String(invocation.__jmaki__.config.version) + ")");
                    }
                    throw new Error("jmaki.insert: unsupported jMaki version (" + String(invocation.__jmaki__.config.version) + ")");
                }
                invocation.__jmaki__.config = config;
            }
            else {
                if (log.errorEnabled) {
                    log.error("jmaki.insert: failed to load the jMaki config.json file");
                }
                throw new Error("failed to load the jMaki config.json file");
            }
            
            /**
             * Write out the extensions
             */
            if (invocation.__jmaki__.config  &&
                invocation.__jmaki__.config.extensions) {
                for (var i =0; i < invocation.__jmaki__.config.extensions.length; i++) {
                    var ex = invocation.__jmaki__.config.extensions[i];
                    var prefix = application.options.jmaki.prefix + "/";
                    var exName = undefined;
                    if (typeof ex == 'string' ) {
                        exName = ex;
                    } else if (matchURL(request.getRequestURI(), ex.url)) {
                        exName = ex.name;
                    }
                    if (typeof exName != 'undefined'){
                            var extensionDir  = webroot + '/' +  prefix  + exName.replace(/\./g, '/');
                            writer.println('<script type="text/javascript" src="' + 
                                extensionDir +  '/extension.js" ></script>');                               
                            writer.println("<script type='text/javascript'>jmaki.addExtension({name : '" + exName + "', " +
                                         "extensionDir : '" + extensionDir + "'");
                            // write out the args if available
                            if (invocation.__jmaki__.config.extensions[i].args) {
                                writer.println(", args : " + library.json.serialize(invocation.__jmaki__.config.extensions[i].args));
                            }
                            writer.println("});</script>");
                    }
                  }
            }            
            /**
             * Write out the glue includes
             */
            if (invocation.__jmaki__.config.glue && 
                invocation.__jmaki__.config.glue.includes) {
                for (var i =0; i < invocation.__jmaki__.config.glue.includes.length; i++) {
                    var gi = invocation.__jmaki__.config.glue.includes[i];
                    if (typeof gi == 'string' ) {
                        writer.println('<script type="text/javascript" src="' + webroot + gi +  '" ></script>');
                    } else if (matchURL(request.getRequestURI(), gi.url)) {
                        writer.println('<script type="text/javascript" src="' + webroot + gi.lib +  '" ></script>');                
                    }
                  }
            }
        }
    }
    
    /* match a url to a pattern including wildcards
     * urls matched are from the context root
     * 
     * url patterns may be :
     * 
     * star/show - where all urls ending with /show will match
     * /foo/bar/* - where all urls starting with foo/bar will match
     */
    function matchURL(url, pattern) {    
        if (pattern ==  url ||
            "*" == pattern ||
            (pattern[pattern.length -1] == "*" &&
             pattern.length > 1 &&
             url.startsWith(pattern.substring(0, pattern.length -1) )) ||
            (pattern[0] == "*" &&
             pattern.length > 1 &&
              url.endsWith(pattern.substring(1, pattern.length))) ) return true;
        else return false;
    }

    /**
     * Write out the required themes
     */    
    function writeThemes(writer, name, themes) {
        var defaultTheme;
        var theme;
        var globalTheme = invocation.__jmaki__.config.globalTheme;
        for (var k = 0; k < themes.length; ++k) {
            var t = themes[k];
            if (t['default'] == true)  defaultTheme = themes[k].style;
            if (globalTheme && t.id == globalTheme)
                theme = t.style;
        }
        if (!theme) theme = defaultTheme; 
        // write out the theme
        if (theme && !invocation.__jmaki__.css[theme]) {
            var actualStyleName = theme;
            if (actualStyleName.substring(0, 4) != "http") {
                // if we start with a / default to the webroot
                // otherwise default to the widget root
                if (actualStyleName.charAt(0) != "/") {
                    actualStyleName = "/resources/" + name.replace(/\./g,'/') +
                    "/" + actualStyleName;
                }
                actualStyleName = library.httpserver.makeUrl(actualStyleName);
            }
            writer.println("<link rel='stylesheet' type='text/css' href='" + actualStyleName +  "'></link>");
            invocation.__jmaki__.css[theme] = true;
        }        
    }

    /**
     * Write out the required styles
     */    
    function writeStyles(writer, name, requiredStyles) {
        for (var k = 0; k < requiredStyles.length; ++k) {
            var requiredStyle = requiredStyles[k];
            if (!invocation.__jmaki__.css[requiredStyle]) {
                var actualStyleName = requiredStyle;
                if (actualStyleName.substring(0, 4) != "http") {
                    // if we start with a / default to the webroot
                    // otherwise default to the widget root
                    if (actualStyleName.charAt(0) != "/") {
                        actualStyleName = "/resources/" + name.replace(/\./g,'/') +
                        "/" + actualStyleName;
                    }
                    actualStyleName = library.httpserver.makeUrl(actualStyleName);
                }
                writer.println("<link rel='stylesheet' type='text/css' href='" + actualStyleName +  "'></link>");
                invocation.__jmaki__.css[requiredStyle] = true;
            }
        }
        
    }
    
    /**
     *  Write out the required external libraries and include the API key if provided
     */
    function writeScripts(writer, name, type, requiredLibraries, requiredKey, uuid){
        for (var k = 0; k < requiredLibraries.length; ++k) {
            var requiredLibrary = requiredLibraries[k];
            if (!invocation.__jmaki__.script[requiredLibrary]) {
                var actualLibraryName = requiredLibrary;
                if (requiredKey) {
                    actualLibraryName += requiredKey;
                }
                // make sure we support http/https
                if (actualLibraryName.substring(0, 4) != "http") {
                    // if we start with a / default to the webroot
                    // otherwise default to the widget root
                    if (actualLibraryName.charAt(0) != "/") {
                        actualLibraryName = "/resources/" + name.replace(/\./g,'/') + 
                        "/" + actualLibraryName;
                    }
                    actualLibraryName = library.httpserver.makeUrl(actualLibraryName);
                }
                if (type.preload) {
                    writer.print("<script type='text/javascript'>");
                    writer.print(String(type.preload));
                    writer.println("</script>");
                }
                if (typeof type.dynamicallyLoadable != 'undefined' &&
+                    type.dynamicallyLoadable == false && uuid != undefined) {
+                    writer.println("<script type='text/javascript'>jmaki.writeScript('" + actualLibraryName +  "', '" +  uuid + "');</script>");
                }
                else {
                    writer.println("<script type='text/javascript' src='" + actualLibraryName +  "'></script>");
                }
                if (type.postload) {
                    writer.print("<script type='text/javascript'>");
                    writer.print(String(type.postload));
                    writer.println("</script>");
                }
                invocation.__jmaki__.script[requiredLibrary] = true;
            }
        }
        
    }
    
    /**
     * Get the API key for a given type
     */
    function getAPIKey(type, keys, currentDirectory) {
        var requiredKey = null;

        for (var k = 0; k < keys.length; ++k) {
            var keyObj = keys[k];
            if (keyObj.id == type.apikey) {
                for (var m = 0; m < keyObj.keys.length; ++m) {
                    var pair = keyObj.keys[m];
                    if (pair.url == undefined || pair.url == "*" ||
                    (pair.url == getWebRoot() + "/" ||
                     pair.url == currentDirectory ||
                     pair.url == currentDirectory + "/")) {
                        requiredKey = pair.key;
                    }
                }
            }
        }
        return requiredKey;
    }    
    
    /**
     * Include on a page all the scripts/resources necessary to make it possible to use a library.
     *
     * @param(name, string, optional)
     *     library name; if missing, this function returns immediately
     * @param(writer, java.io.PrintWriter, optional)
     *     writer to use, defaults to ``context.writer``
     * @param(cfgloc, string, optional)
     *     location of the jMaki configuration file
     * @param(uuid, string, optional)
     *     unique id needed by non dynamically loadable libraries
     * @return(boolean)
     *     true if everything went well, false otherwise.
     */
    function use(name, writer, cfgloc, uuid) {
        if (log.traceEnabled) {
            log.trace("jmaki.use: " + name);
        }

        if (name == undefined || name == "") {
            return;
        }
                
        var typename = name;
        
        checkEnabled();
        
        if (invocation.__jmaki__.type[typename]) {
            return true;
        }
        
        if (writer == undefined) {
            writer = context.getWriter();
        }
        var webroot = getWebRoot();
        var currentDirectory = getCurrentDirectory();
        var prefix = getPrefix();
        gotTypeInfo = false;
     
        // check the type if it's got a config in it
        //
        var cfg;
        if (typeof cfgloc != undefined) {
            cfg = readWidgetConfiguration(cfgloc);
        }
        // check if the widget.json config info is available
        // and use it if there
        if (typeof cfg != 'undefined' && cfg.type) {         
            if (cfg.apikeys) requiredKey = getAPIKey(cfg.type, cfg.apikeys, currentDirectory);
            writeThemes(writer, name, cfg.type.themes ?  cfg.type.themes : []);           
            writeStyles(writer, name, cfg.type.styles ?  cfg.type.styles : []);
            writeScripts(writer, name, cfg.type, (cfg.type.libs ?  cfg.type.libs : []), requiredKey, uuid);    
        } else {
            var types = invocation.__jmaki__.config.types;
            //types maybe not defined...
            for (var j = 0; types && j < types.length; ++j) {
                if (types[j].id == typename) {
                    gotTypeInfo = true;
                    var requiredKey;
                    if (types[j].apikey) {
                        requiredKey = getAPIKey(types[j], invocation.__jmaki__.config.apikeys, currentDirectory);
                    }
                    writeStyles(writer, name, (types[j].styles ?  types[j].styles : []));
                    writeScripts(writer, name, types[j], (types[j].libs ?  types[j].libs : []), requiredKey);                                            
                }
            }      
        }
        if (gotTypeInfo) {
            invocation.__jmaki__.type[typename] = true;
        }
        return gotTypeInfo;
    }
    
    /**
     * Register the /xhp URL as associated with the XmlHttpProxy functionality in jMaki.
     *
     * @return(undefined)
     */
    this.useProxy = function() {
        log.trace("jmaki.useProxy");
        if (application.jmaki == undefined) {
            application.jmaki = new Object();
        }
        if (application.jmaki.xhp == undefined ) {
            application.jmaki.xhp = application.options.httpProxy != undefined
                    ? new Packages.com.sun.jmaki.services.XmlHttpProxy(
                        application.options.httpProxy.name, 
                        application.options.httpProxy.port)
                    : new Packages.com.sun.jmaki.services.XmlHttpProxy();

            obtainXmlHttpProxyServices();
            
            application.mapping.rules.push(
                { url: application.options.jmaki.xhp.url, fn: "library.jmaki.handleXHP" });
        }
    }

    /**
     * Get the services object from jMaki's XmlHttpProxy class, reloading it if it
     * was modified since the last access.
     */
    function obtainXmlHttpProxyServices() {
        if (library.resource.exists(application.options.jmaki.xhp.config)) {
            var lastModified = library.resource.lastModified(application.options.jmaki.xhp.config);
            if (!application.jmaki.xhpLastModified ||
                (application.jmaki.xhpLastModified &&
                  (application.jmaki.xhpLastModified < lastModified))) {
                application.jmaki.xhpLastModified = lastModified;
                var is = library.resource.open(application.options.jmaki.xhp.config);
                try {
                    var services = application.jmaki.xhp.loadServices(is);
                    application.jmaki.xhpServices = services;
                }
                finally {
                    is.close();
                }
            }
        }
        return application.jmaki.xhpServices;
    }
    
    /**
     * Handle a request for the XmlHttpProxy.
     *
     * @return(boolean)
     *    true if the request was handled successfully, false otherwise
     */
    this.handleXHP = function() {
        log.trace("jmaki.handleXHP");
        var serviceKey = request.getParameter("id");
        var urlParams = request.getParameter("urlparams");
        var callback = request.getParameter("callback");
        var urlString = "";
        var xslURLString;
        var outputStreamCommitted = false;

        try {
            var service = obtainXmlHttpProxyServices().getJSONObject(serviceKey);
            if (!urlParams && service.has("defaultURLParams")) {
                urlParams = service.getString("defaultURLParams");
            }
            if (urlParams) {
                urlParams = urlParams.replace(' ', '+');
            }

            var serviceURL = service.getString("url");

            // build the URL
            if (serviceURL.indexOf("?") == -1){
                serviceURL += "?";
            } else {
                serviceURL += "&";
            }
            urlString = serviceURL +
                (service.has("apikey") ? service.getString("apikey") : "") +  "&" + urlParams;
            if (service.has("xslStyleSheet")) {
                xslURLString = service.getString("xslStyleSheet");
            }
 
            var paramsMap = new java.util.HashMap();
            paramsMap.put("format", "json");
            if (callback) {
                paramsMap.put("callback", callback);
            }
            if (xslURLString) {
                var xslLocation = application.options.jmaki.xhp.xslBase + "/" + xslURLString;
                var xslInputStream = library.resource.open(xslLocation);
            }
            
            if (log.traceEnabled) {
                log.trace("jmaki.handleXHP: accessing URL: " + urlString);
            }
            try {
                var out = response.getOutputStream();
                outputStreamCommitted = true;
                application.jmaki.xhp.doGet(urlString, out, xslInputStream ? xslInputStream : null, paramsMap);
                out.flush();
            }
            finally {
                if (xslInputStream) {
                    xslInputStream.close();
                }
            }
        }
        catch (e) {
            if (log.debugEnabled) {
                log.debug("jmaki.handleXHP: failed to handle request:" + e.message);
            }
        }
        return outputStreamCommitted;
    }

    /**
     * Load the jMaki configuration file and read it in as a JavaScript object.
     *
     * @return(object)
     *   the configuration information or undefined if the file could not be read
     */
    function readConfiguration() {
        var prefix = getPrefix();
        var typesDatafile = library.common.findFirst(prefix + "config.json", application.path.content);
        if (library.resource.exists(typesDatafile)) {
            var json = library.json.deserialize(library.resource.readAsString(typesDatafile));
            return json.config;
        }
        else {
            return undefined;
        }
    }

    /**
     * Load the jMaki widget.json configuration file and read it in as a JavaScript object.
     * Return undefined if the file was not found.
     */
    function readWidgetConfiguration(loc) {
        if (library.resource.exists(loc)) {
            var json = library.json.deserialize(library.resource.readAsString(loc));
            return json.config;
        }
        else {
            return undefined;
        }
    } 
    
    
    // module exports
    this.insert = insert;
    this.use = use;
    this.readConfiguration = readConfiguration;
});
