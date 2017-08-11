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
 * Bootstrap script. It runs when the container is started.
 * At this point, nothing has been set up, so it is this script's
 * responsibility to set up the environment that it wants all
 * application code to see, e.g. some predefined services.
 *
 * One advantage of defining services here, as opposed to doing
 * so inside an application, is that they get compiled and
 * stored away, then reused by all application scripts, without
 * any additional compilation/load penalties.
 *
 * The main drawback is that debugging code defined here is
 * hard, because error traces go to the log, not the browser.
 * You also need to take care in accessing global variables.
 * Javascript is lexically scoped, so the globals visible to
 * any functions defined here will be those present at the
 * time the bootstrap script was run.
 */

(function() {
    var getGlobalContext = function() {
        return Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();
    }

    var getRequestContext = function() {
        return Packages.com.sun.phobos.container.PhobosRuntime.getRequestContext();
    }

    var globals = getGlobalContext();

    // set framework version number
    globals.put("frameworkVersion", "0.5.14-SNAPSHOT");

    // create a global "application" object
    var application = new Object();
    application.dir = new Object();
    application.dir.base = globals.get("baseDir");
    globals.remove("baseDir");
    application.dir.scratch = globals.get("scratchDir");
    globals.remove("scratchDir");
    application.data = new Object();
    application.path = new Object();
    application.path.library = ["/framework/library", "/application/library"];
    application.path.module = ["/application/module"];
    application.lowLevelHandlers = {};
    globals.put("application", application);

    // create a random seed
    globals.put("seed", (new java.util.Random()).nextLong().toString());

    // map all built-in services to a new global "services" object
    var mappedServices = new Object();
    mappedServices.scripting = globals.get("scripting");
    globals.remove("scripting");
    mappedServices.resource = globals.get("resource");
    globals.remove("resource");

    // install the newly defined services
    globals.put("services", mappedServices);


    // define the template service
    mappedServices.template = new function() {
        try {
            var obj = {
                findTemplateSource: function(name) {
                    if (mappedServices.resource.isResourcePresent(name)) {
                        return name;
                    }
                    else {
                        return null;
                    }
                },
                getLastModified: function(name) {
                    return mappedServices.resource.getLastModified(name);
                },
                getReader: function(name, enc) {
                    return new java.io.InputStreamReader(mappedServices.resource.getResourceAsStream(name), enc);
                },
                closeTemplateSource: function(name) {}
            };
            var templateLoader = new Packages.freemarker.cache.TemplateLoader(obj);
            var configuration = new Packages.freemarker.template.Configuration();
            configuration.setTemplateLoader(templateLoader);
            this.configuration = configuration;
            this.process = function (templateName, model, writer) {
                var template = this.configuration.getTemplate(templateName);
                var wrapper = new Packages.freemarker.ext.rhino.RhinoWrapper();
                template.process(model, writer, wrapper);
            }
        }
        catch (e) {
            // freemarker may not be available
            this.process = function (templateName, model, writer) {
                throw new Error("failed to initialize the FreeMarker templating engine");
            }
        }
    };

    // define the inline template service
    mappedServices.inlineTemplate = new function() {
        try {
            var obj = {
                findTemplateSource: function(name) {
                    return (name == undefined) ? null : name;
                },
                getLastModified: function(name) {
                    return -1;
                },
                getReader: function(name, enc) {
                    return new java.io.StringReader(name);
                },
                closeTemplateSource: function(name) {}
            };
            var templateLoader = new Packages.freemarker.cache.TemplateLoader(obj);
            var configuration = new Packages.freemarker.template.Configuration();
            configuration.setTemplateLoader(templateLoader);
            configuration.setLocalizedLookup(false);
            this.configuration = configuration;        
            this.process = function (templateName, model, writer) {
                var template = this.configuration.getTemplate(templateName);
                var wrapper = new Packages.freemarker.ext.rhino.RhinoWrapper();
                template.process(model, writer, wrapper);
            }
        }
        catch (e) {
            // freemarker may not be available
            this.process = function (templateName, model, writer) {
                throw new Error("failed to initialize the FreeMarker templating engine");
            }
        }
    }
    
    // define the derby service
    mappedServices.derby = new function() {
        this.derbyHome = Packages.com.sun.phobos.container.PhobosRuntime.getCurrentAdapter().getProperty("derby.system.home");
        if (this.derbyHome == null || this.derbyHome == "") {
            this.derbyHome = application.dir.scratch;
            java.lang.System.setProperty("derby.system.home", this.derbyHome);
        }
        
        this.useEmbedded = Packages.com.sun.phobos.container.PhobosRuntime.getCurrentAdapter().getProperty("com.sun.phobos.derby.useEmbedded") != "false";
        if (this.useEmbedded) {
            try {
                var dummy = new Packages.org.apache.derby.jdbc.EmbeddedDriver();
            }
            catch (e) {
                this.useEmbedded = false;
            }
        }
        
        this.shutdown = function() {
            if (this.useEmbedded) {
                try {
                    return java.sql.DriverManager.getConnection("jdbc:derby:;shutdown=true");
                }
                catch (e) {
                }
            }
        }
    };

    // define the task service
    mappedServices.task = new function () {
        var executor = java.util.concurrent.Executors.newCachedThreadPool();
        var scheduledExecutor = java.util.concurrent.Executors.newScheduledThreadPool(2);

        function createScriptRunnable(name, arg) {
            return Packages.com.sun.phobos.container.PhobosRuntime.createScriptRunnable(name, arg);
        }
        
        this.submitScriptTask = function (name, arg) {
            return executor.submit(createScriptRunnable(name, arg));
        }

        this.scheduleScriptTaskFixedRate = function (name, initialDelay, delay, timeUnit, arg) {
            return scheduledExecutor.scheduleAtFixedRate(createScriptRunnable(name, arg), initialDelay, delay, timeUnit);
        }
        
        this.scheduleScriptTaskFixedDelay = function (name, initialDelay, delay, timeUnit, arg) {
            return scheduledExecutor.scheduleWithFixedDelay(createScriptRunnable(name, arg), initialDelay, delay, timeUnit);
        }
        
        this.shutdown = function() {
            executor.shutdown();
            scheduledExecutor.shutdown();
        }
        
        this.seconds = java.util.concurrent.TimeUnit.SECONDS;
        this.milliseconds = java.util.concurrent.TimeUnit.MILLISECONDS;
        this.microseconds = java.util.concurrent.TimeUnit.MICROSECONDS;
        this.nanoseconds = java.util.concurrent.TimeUnit.NANOSECONDS;
    };
})();
