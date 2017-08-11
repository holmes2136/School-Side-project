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
 * Scripting library module.
 */

library.common.define(library, "scripting", function() {
    var scriptingService = globals.services.scripting;
    var log = library.log.get("framework.scripting");
    
    /**
     * Run the script with the given name in the current context.
     *
     * @param(name, string, required)
     *    name of the script to run
     * @param(type, java.lang.Class, optional)
     *    Java class to which the result of running the script will be converted,
     *    provided the underlying scripting engine supports the ``javax.script.Invocable``
     *    interface.
     * @return(any)
     *   value returned by the script
     */
    function run(name, type) {
        if (log.traceEnabled) {
            log.trace("scripting.run: " + name);
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.script);
        if (actualName) {
            if (log.debugEnabled) {
                log.debug("scripting.run: executing: " + actualName);
            }
            return evalScript(actualName, type);
        }
        else {
            if (log.errorEnabled) {
                log.error("scripting.run: script not found: " + name);
            }
            throw new Error("script not found: " + name);
        }
    }

    /**
     * Run the script with the given name provided it exists,
     * do nothing otherwise.
     *
     * @param(name, string, required)
     *    name of the script to run
     * @param(type, java.lang.Class, optional)
     *    Java class to which the result of running the script will be converted,
     *    provided the underlying scripting engine supports the ``javax.script.Invocable``
     *    interface.
     * @return(any)
     *   value returned by the script
     */
    function maybeRun(name, type) {
        if (log.traceEnabled) {
            log.trace("scripting.maybeRun: " + name);
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.script);
        if (actualName) {
            if (log.debugEnabled) {
                log.debug("scripting.maybeRun: executing: " + actualName);
            }
            return evalScript(actualName, type);
        }
    }

    /**
     * Evaluate the script with the given name in the current context.
     *
     * This function will first try to use a "soft" engine, configured via the
     * ``application.options.scripting.softEngines`` property, then fall back on
     * the scripting services, which uses JSR-223.
     *
     * @param(name, string, required)
     *    name of the script to run
     * @param(type, java.lang.Class, optional)
     *    Java class to which the result of running the script will be converted,
     *    provided the underlying scripting engine supports the ``javax.script.Invocable``
     *    interface.
     * @return(any)
     *   value returned by the script
     */
    function evalScript(name, type) {
        if (log.traceEnabled) {
            log.trace("scripting.evalScript: " + name);
        }
        var extension = library.resource.getExtension(name);
        if (extension != "") {
            var fn = application.options.scripting.softEngines[extension];
            if (fn != undefined) {
                if (library.lang.isString(fn)) {
                    fn = library.common.resolve(fn);
                }
                if (library.lang.isFunction(fn)) {
                    return fn(name, type);
                }
            }
        }
        return type == undefined ?
                scriptingService.evalScript(name, context) :
                scriptingService.evalScriptAs(name, context, type);
    }
    
    /**
     * Create an engine object that can run scripts with the specified extension.
     *
     * Only JSR-223 engines will be returned, not "soft" ones.
     *
     * @param(extension, string required)
     *    extension used to identify an engine, e.g. ".js" or ".rb"
     * @kreturn(factory, javax.script.ScriptEngineFactory, required)
     *    JSR-223 script engine factory
     * @kreturn(evalScript, function, required)
     *    a function that can be used to evaluate a script, with the same signature as [[run|#run]]
     * @kreturn(evalScriptSource, function, required)
     *    a function that can be used to evaluate a script, with the script source (a string) as
     *    the first argument and two additional arguments identical to those of [[run|#run]]
     */
    function getScriptingEngine(extension) {
        if (log.traceEnabled) {
            log.trace("scripting.getEngine: " + extension);
        }
        var factory = scriptingService.getFactoryForExtension(extension);
        if (!factory) {
            if (log.errorEnabled) {
                log.error("scripting.getEngine: no engine found for extension: " + extension);
            }
            throw new Error("no engine found for extension: " + extension);
        }
        return {
            evalScript: function(name, type) {
                return type == undefined ?
                        scriptingService.evalScript(name, context, factory) :
                        scriptingService.evalScriptAs(name, context, factory, type)
            },
            evalScriptSource: function(source, name, type) {
                return type == undefined ?
                        scriptingService.evalScriptSource(source, context, factory, name) :
                        scriptingService.evalScriptSourceAs(source, context, factory, name, type)
            },
            factory: function() {
                return factory;
            }
        };
    }
    
    // exports
    this.run = run;
    this.maybeRun = maybeRun;
    this.evalScript = evalScript;
    this.getScriptingEngine = getScriptingEngine;
});
