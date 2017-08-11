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
 * Lifecycle library module.
 */

library.common.define(library, "lifecycle", function() {

    var log = library.log.get("framework.lifecycle");

    /**
     * Refreshes the log, so that startup code can be traced into.
     */    
    function refreshLog() {
        library.log.discard("framework.lifecycle");
        log = library.log.get("framework.lifecycle");
    }
    
    /**
     * Startup event handler.
     *
     * @return(undefined)
     */
    this.onStartup = function() {
        /*
         * Define the default paths.
         */
        application.path.script = ["/application/script"];
        application.path.content = ["/static"];
        application.path.view = ["/application/view"];
        application.path.controller = ["/application/controller"];
        application.path.test = ["/application/test"];
        application.path.dynamic = ["/application/dynamic"];
        application.path.module = ["/application/module"];
        application.path.extension = ["/framework/extension", "/application/extension"];
        
	    // PENDING(robc): Move this so it is defined inside of jsf.js
        application.path.managedBeans = ["/application/managedBeans"];

        application.__sessionStore__ = new java.util.concurrent.ConcurrentHashMap();
        application.sessionStore = library.common.automap(application.__sessionStore__);
        
        /*
         * Request mapping rules.
         *
         * Rules are structured in three sets, depending on priority: high, normal or low.
         * Within a set, rules are applied in order. The process stops as soon as
         * one rule is successfully applied.
         */
        application.mapping = {};
        application.mapping.rules = [];
        application.mapping.defaultRules = {};
        application.mapping.defaultRules.high = [
            { url: "/", script: "index.js" },
            { url: "/", content: "index.html" },
            { url: "(/((\\w|-)*(\\.?\\w*))+)+", fn: "library.mapping.maybeContent" },
            { url: "/((\\w|\\.|-)+)", fn: "library.mapping.maybeScript" }
        ];
        application.mapping.defaultRules.low = [
            { url: "/@controller/@action/@id", fn: "library.mapping.maybeController" },
            { url: "/@controller/@action", fn: "library.mapping.maybeController"},
            { url: "/@controller/", defaults: {action: "index"}, fn: "library.mapping.maybeController" },
            { url: "/@controller", defaults: {action: "index"}, fn: "library.mapping.maybeController" },
            { url: "(/((\\w|-)*(\\.?\\w*))+)+", fn: "library.mapping.maybeDynamic" }
        ];

        application.options = {
            lifecycleModuleName: "application",
            prefix: "/",
            session: {
                enabled: true,
                duration: 600,
                reaperFrequency: 60,
                cookieName: "__sessionid__",
                path: "/",
                maxAge: -1
            },
            content: {
                caching: true,
                shelfLife: 86400000,  /* 24 hours, in milliseconds */
                dynamic: {
                    /* file extensions associated with dynamic content */
                    extensions: {
                        "ejsp" : true
                    }
                }
            },
            database: {
                maxRows: 1000  /* max number of rows returned as objects */
            },
            jmaki: {
                prefix: "resources",
                xhp: {
                    enabled: true,                          /* enable XmlHttpProxy functionality? */
                    url: "/xhp",                            /* XmlHttpProxy URL */
                    config: "/static/resources/xhp.json",   /* XHP configuration file */
                    xslBase: "/static/resources/xsl"        /* directory for xsl files */
                }
            },
            /*
            // uncomment and customize to enable http proxy
            httpProxy: {
                name: "proxyserver",
                port: 8080
            },
            */
            systemApps: {
                publish: false
            },
            /*
            // uncomment and customize to enable exception handling by the application
            // the property value is the name of a function to invoke with the exception as an argument
            exceptionHandler: "module.application.onException",
            */
            log: {
                 any: {  /* default for all logs */
                    level: 5,  /* error */
                    timestamp: true  /* emit timestamp */
                 }
            },
            dojo: {
                /* preferred dojo version */
                /* value can be a numeric identifier or a path, e.g.
                preferred: ".4.1"
                preferred: "/application/dojo"
                */
            },
            httpserver: {
                /* server name and port to be used by library.httpserver.makeUrl
                   in lieu of the server and port information present in the client request */
                /*
                name: "localhost",
                port: 8888
                */
            },
            scripting: {
                softEngines: {
                    "ejsp": "library.view.runEmbeddedJavaScriptPage"
                }
            },
            webservices: {
                /* contains names of classes generated by wsimport
                   that extend javax.xml.ws.Service */
                serviceClasses: []
            }
        };
        
        application.datasource = {};
        
        if (globals.services.derby.useEmbedded) {
            application.datasource.embedded = {
                dataSourceClassName: "org.apache.derby.jdbc.EmbeddedConnectionPoolDataSource",
                properties: {
                    createDatabase: "create",
                    databaseName: "data"
                }
            }
            application.options.database.preferred = "embedded";
        }
        application.datasource.client = {
            dataSourceClassName: "org.apache.derby.jdbc.ClientConnectionPoolDataSource",
            username: "APP",
            password: "APP",
            properties: {
                  serverName: "localhost",
                  portNumber: "1527",        
                  connectionAttributes: ";create=true",
                  databaseName: "data"
            }
        }
        
        application.extensions = {};
        application.eventHandlers = {};
        
        library.scripting.maybeRun("/environment/" + globals.environment + ".js");
        library.scripting.maybeRun("/environment/startup-"+globals.platform+".js");

        refreshLog();
        
        if (application.options.database.preferred != undefined) {
            library.db.initialize(application.datasource[application.options.database.preferred]);
        }

        library.scripting.maybeRun("/application/startup.js");
        invokeApplicationEventHandler("onStartup");

        refreshLog();
        
        library.lifecycle.loadExtensions();
        
        if (application.options.jmaki.xhp && application.options.jmaki.xhp.enabled) {
            library.lifecycle.subscribe("startup", "library.jmaki.useProxy");
        }

        // refresh module object
        module = library.common.autoload(application.path.module);
        
        library.lifecycle.publishEvent("startup");
                
        if (application.options.systemApps.publish) {
            library.scripting.maybeRun("/framework/systemApps/startup.js");
        }

        refreshLog();
        
        log.trace("lifecycle.onStartup: compiling URL mapping rules");
                
        globals.mapping = { prefix: "" };
        if (library.lang.isString(application.options.prefix) &&
            application.options.prefix != "" &&
            application.options.prefix != "/") {
            globals.mapping.prefix = application.options.prefix;
        }
        
        library.lifecycle.updateRules();
        
        if (application.options.session.enabled &&
            application.options.session.reaperFrequency > 0) {
                application.__sessionReaperTask__ = library.task.scheduleScriptTaskFixedDelay('/framework/task/sessionReaper.js', 0, application.options.session.reaperFrequency, library.task.seconds);            
        } 

        log.trace("lifecycle.onStartup: complete");
    };

    /**
     * Shutdown event handler.
     *
     * @return(undefined)
     */
    this.onShutdown = function() {
        log.trace("lifecycle.onShutdown");
        
        if (application.__sessionReaperTask__ != undefined) {
            application.__sessionReaperTask__.cancel(true);
        }

        library.lifecycle.publishEvent("shutdown");
        
        invokeApplicationEventHandler("onShutdown");
        library.scripting.maybeRun("/application/shutdown.js");

        library.task.shutdown();
    };

    /**
     * Service handler.
     *
     * @return(undefined)
     */
    this.onService = function() {
        if (log.infoEnabled) {
            log.info("lifecycle.onService: " + request.getMethod() + " " + request.getRequestURI());
        }

        function doService() {
            var url = String(request.getRequestURI());
            var prefix = getPrefixFor(request);
            var effectiveUrl = matchAndRemovePrefix(url, prefix);
            if (effectiveUrl != undefined) {
                invocation.prefix = prefix;
                return library.mapping.applyRules(effectiveUrl,
                                              globals.mapping.rules);
            }
            else {
                var handled = invokeApplicationEventHandler("onNotFound");
                if (!handled) {
                    library.httpserver.sendNotFound();
                }
                return false;
            }
        }

        function invokeApplicationExceptionHandler(exception, phase) {
            var fn = library.common.resolve(application.options.exceptionHandler);
            if (library.lang.isFunction(fn)) {
                return fn(exception, phase);
            }
            else {
                log.debug("lifecycle.onService: cannot find application exception handler: ", application.options.exceptionHandler);
                return false;
            }            
        }
        
        if (application.options.exceptionHandler) {
            try {
                library.lifecycle.beforeService();
            }
            catch (e) {
                var shouldAbort = invokeApplicationExceptionHandler(e, "before");
                if (shouldAbort) {
                    return;
                }
            }
            try {
                doService();
            }
            catch (e) {
                invokeApplicationExceptionHandler(e, "service");
            }
            finally {
                try {
                    library.lifecycle.afterService();
                }
                catch (e) {
                    invokeApplicationExceptionHandler(e, "after");
                }
            }            
        }
        else {
            // no exception handler specified
            library.lifecycle.beforeService();
            try {
                doService();
            }
            finally {
                library.lifecycle.afterService();
            }
        }
    }

    function getPrefixFor(request) {
        return library.lang.dispatch(globals.platform, {
            standalone: function() {
                return globals.contextRoot + globals.mapping.prefix;
            },
            glassfish: function() {
                return globals.contextRoot + globals.mapping.prefix;
            },
            webapp: function() {
                return String(request.getContextPath()) + globals.mapping.prefix;
            },
            simple: function() {
                return globals.contextRoot + globals.mapping.prefix;
            },
            mock: function() {
                return globals.contextRoot + globals.mapping.prefix;
            }
        });
     }

    function matchAndRemovePrefix(url, prefix) {
        var len = prefix.length;
        var actualPrefix = url.substring(0, len);
        if (actualPrefix != prefix) {
            return undefined;
        }
        else {
            url = url.substring(len);
            if (url == "") {
                url = "/";
            }
            return url;
        }
    }
         
    /**
     * Before service handler.
     *
     * @return(undefined)
     */
    this.beforeService = function() {
        log.trace("lifecycle.beforeService");
        if (application.options.session.enabled) {
            library.httpserver.establishSession();
        }

        library.lifecycle.publishEvent("beforeService");                
        invokeApplicationEventHandler("beforeService");
    };

    /**
     * After service handler.
     *
     * @return(undefined)
     */
    this.afterService = function() {
        log.trace("lifecycle.afterService");                

        invokeApplicationEventHandler("afterService");
        library.lifecycle.publishEvent("afterService", undefined, true);
        
        if (application.options.session.enabled) {
            library.httpserver.wrapUpSession();
        }
    };
    
    /**
     * Update the URI mapping rules for the application based on the values in
     * application.mapping.rules and application.mapping.defaultRules.
     *
     * @return(undefined)
     */
    this.updateRules  = function() {
        log.trace("lifecycle.updateRules");
        
        globals.mapping.rules = library.mapping.compileRules(
            (application.mapping.defaultRules == undefined ? [] :application.mapping.defaultRules.high),
            application.mapping.rules,
            (application.mapping.defaultRules == undefined ? [] : application.mapping.defaultRules.low));
    }

    /**
     * Find and load all the extensions in the specified path or, if missing, the
     * application extension path.
     *
     * @return(undefined)
     */
    this.loadExtensions = function(path) {
        log.trace("lifecycle.loadExtensions");
         if (path == undefined) {
            path = application.path.extension;
         }
                 
         if (library.lang.isArray(path)) {
            for (var i = 0; i < path.length; ++i) {
                if (log.traceEnabled) {
                    log.trace("lifecycle.loadExtensions: processing extension path: " + path[i]);
                }
                var children = library.resource.children(path[i]);
                for (var j = 0; j < children.length; ++j) {
                    var extPath = path[i] + "/" + children[j];
                    if (library.resource.isDirectory(extPath)) {
                        try {
                            library.lifecycle.loadExtension(children[j], extPath);
                        }
                        catch (e) {
                            if (log.warnEnabled) {
                                log.warn("lifecycle.loadExtensions: error processing extension: " + extPath + ": " + e.message);
                            }
                        }
                    }
                }
            }
        }
    }
     
    /**
     * Load an extension.
     *
     * @return(undefined)
     */
    this.loadExtension = function(name, path) {
        if (log.traceEnabled) {
            log.trace("lifecycle.loadExtension: " + path);
        }
        var startupScriptName = path + "/extension.js";
        if (library.resource.exists(startupScriptName)) {            
            var obj = { name: name, path: path, ready: false };
            application.extensions[name] = obj;
            extension = obj;
            try {
                library.scripting.run(startupScriptName);
            }
            finally {
                delete extension;
            }
            obj.ready = true;
        }
        else {
            if (log.debugEnabled) {
                log.debug("lifecycle.loadExtension: missing extension startup script: " + startupScriptName);
            }
        }
    }

    /**
     * Subscribe to a lifecycle event.
     *
     * The event handler function will be called with the event name
     * as the first argument and an optional event-specific argument as the second one.
     *
     * @param(eventName, string, required)
     *    name of the event to subscribe to
     * @param(functionName, string, required)
     *    name of the function to invoke when the event takes place; the name is resolved
     *    to a function using [[library.common.resolve|library.common.html#resolve]].
     * @return(undefined)
     */
    this.subscribe = function(eventName, functionName) {
        if (log.traceEnabled) {
            log.trace("lifecycle.subscribe: event " + eventName + ", handler " + functionName);
        }
        if (!library.lang.isString(eventName)) {
            if (log.errorEnabled) {
                log.error("lifecycle.subscribe: event name must be a string: " + eventName);
            }
            throw new Error("event name must be a string: " + eventName);
        }
        if (!library.lang.isString(functionName)) {
            if (log.errorEnabled) {
                log.error("lifecycle.subscribe: function name must be a string: " + functionName);
            }
            throw new Error("function name must be a string: " + functionName);
        }
        var eventHandlers = application.eventHandlers[eventName];
        if (eventHandlers == undefined) {
            eventHandlers = [];
            application.eventHandlers[eventName] = eventHandlers;
        }
        eventHandlers.push(functionName);
    }
    
    /**
     * Publish a lifecycle event, invoking all handlers subscribed to it.
     *
     * @param(eventName, string, required)
     *     name of the event to be published
     * @param(arg, object, optional)
     *     argument to be passed to each event handler
     * @param(reverse, boolean, optional)
     *     if true, handlers will be called in reverse order of registration.
     * @return(undefined)
     */
    this.publishEvent = function(eventName, arg, reverse) {
        if (log.traceEnabled) {
            log.trace("lifecycle.publishEvent: " + eventName);
        }
        var eventHandlers = application.eventHandlers[eventName];
        if (library.lang.isArray(eventHandlers)) {
            for (var i = (reverse ? eventHandlers.length : 0);
                 (reverse? i >=0 : i < eventHandlers.length);
                 i+= (reverse ? -1 : 1)) {
                var fnName = eventHandlers[i];
                if (library.lang.isString(fnName)) {
                    var fn = library.common.resolve(fnName);
                    if (library.lang.isFunction(fn)) {
                        try {
                            fn(eventName, arg);
                        }
                        catch (e) {
                            if (log.debugEnabled) {
                                log.debug("lifecycle.publishEvent: handler failed: " + fnName);
                            }
                        }
                    }
                    else {
                        if (log.debugEnabled) {
                            log.debug("lifecycle.publishEvent: no such function: " + fnName);
                        }
                    }
                }
            }
        }
    }

    /**
     * Invoke a handler defined on the application lifecycle module.
     *
     * This is separate from the general event handler facility, which was added
     * to help extension writers.
     */
    function invokeApplicationEventHandler(name, args) {
        var m = module[application.options.lifecycleModuleName];
        if (m != undefined) {
            var fn = m[name];
            if (library.lang.isFunction(fn)) {
                if (log.traceEnabled) {
                    log.trace("lifecycle.invokeApplicationEventHandler: " + name);
                }
                fn.apply(undefined, args);
                return true;
            }
        }
        return false;
    }
        
});
