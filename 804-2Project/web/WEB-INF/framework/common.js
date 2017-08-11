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

/*
 * This script defines the basic library system.
 *
 * The "library" global object holds the library.
 * It faults in modules as required, so no special
 * configuration is needed.
 *
 * The code is somewhat convoluted because at this point
 * there are no global variables defined and we want to
 * avoid introducing any new ones until we're ready
 * to do so near the end of this script.
 */

(function() {

    var services = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("services");
    
    /*
     * Find the first file with the given name in the specified
     * path (a list of directory names). Names that are already
     * absolute are returned as-is, provided there is a resource
     * with a matching name.
     */
    function findFirst(name, path) {
        return findFirstSuchThat(name, path, function(name) { return services.resource.isResourcePresent(name) });
    }

    /*
     * Find the first directory with the given name in the specified
     * path (a list of directory names). Names that are already
     * absolute are returned as-is, provided there is a directory
     * with a matching name.
     */
    function findFirstDirectory(name, path) {
        return findFirstSuchThat(name, path, function(name) { return services.resource.isDirectoryPresent(name) });
    }

    /*
     * Find the first entity in the specified path such that
     * the provided test function returns true when invoked
     * with its absolute name. Absolute names are returned
     * as-is, provided they pass the test.
     */
    function findFirstSuchThat(name, path, testFn) {
        name = new String(name);
        if (name.charAt(0) == "/") {
            if (testFn(name)) {
                return name;
            }
        }
        else if (path) {
            for (var i = 0; i < path.length; ++i) {
                var element = prefix = undefined;
                if (typeof(path[i]) == "string") {
                    element = path[i];
                }
                else if (typeof(path[i]) == "object") {
                    element = path[i].element;
                    prefix = path[i].prefix;
                }

                if (!element) {
                    continue;
                }
                if (prefix) {
                    var len = prefix.length;
                    if ((name.substring(0, len) == prefix) &&
                        (name.charAt(len) == "/")) {
                        var candidate = element + name.substring(len);
                        if (testFn(candidate)) {
                            return candidate;
                        }
                    }
                }
                else {
                    var candidate = element + "/" + name;
                    if (testFn(candidate)) {
                        return candidate;
                    }
                }
            }
        }
        return undefined;
    }

    /*
     * Resolve an expression like "foo.bar.baz" starting from the
     * base object and navigating down the objects. If the base
     * argument is missing, use the global scriptable as the
     * starting point.
     */
    function resolve(expr, base) {
        var atIndex = expr.indexOf("@");
        var isApply = atIndex != -1;
        if (isApply) {
            var rest = expr.substring(atIndex + 1);
            expr = expr.substring(0, atIndex);
        }
        var parts = expr.split(/\./);
        var obj;
        var root = parts[0];
        if (base == undefined) {
            obj = context.getAttribute(root);
        }
        else {
            obj = base[root];
        }
        if (obj == undefined || obj == null) {
            return undefined;
        }
        for (var i = 1; i < parts.length; ++i) {
            obj = obj[parts[i]];
            if (obj == undefined) {
                break;
            }
        }
        if (isApply && typeof(obj) == "function") {
            var fn = obj;
            obj = function() {
                return fn(rest).apply(this, arguments);
            }
        }
        return obj;
    }
    
    /*
     * Define a new namespace.
     */
    function define(container, name, fn) {
        if (!(name in container)) {
            var pkg = new fn;
            for (var p in pkg) {
                if (pkg.hasOwnProperty(p) && typeof(pkg[p]) == "function") {
                    pkg[p].__name__ = container.__name__ + "." + name + "." + p;
                }
            }
            container[name] = pkg;
        }        
    }
    
    /*
     * Run low-level handlers for a given event.
     */
     function runLowLevelHandlersFor(name) {
         if (application.lowLevelHandlers && application.lowLevelHandlers[name]) {
             var handlers = application.lowLevelHandlers[name];
             if (typeof(handlers) == "object") {
                 for (var i in handlers) {
                     var hook = handlers[i];
                     if (typeof(hook) == "string") {
                         hook = resolve(hook);
                     }
                     if (typeof(hook) == "function") {
                         try {
                             hook();
                         }
                         catch (e) {
                             // silent, logging may not be correctly set up at this point
                         }
                     }
                 }
             }
         }         
     }

    /*
     * Return an object that can be passed to JSAdapter to create
     * a Javascript object whose properties are populated lazily by loading
     * a script from the specified path.
     */
    function Autoload(path) {
        this.modules = {};
        this.missing = {};
        this.__has__ = function(name) {
            if (name in this.modules) {
                return true;
            }
            return false;
        },
        this.__get__ = function(name) {
            if (name in this.modules) {
                return this.modules[name];
            }
            else if (!(name in this.missing)) {
                load(findFirst(name + ".js", path));
                if (!this.modules[name]) {
                    // try a directory
                    var dir = findFirstDirectory(name, path);
                    if (dir != undefined) {
                        // create and install a new autoloader
                        var newPath = [];
                        for (var i in path) {
                            if (typeof(path[i]) == "object" && path[i].prefix == name) {
                                newPath.push(path[i].element);
                            }
                            else {
                                newPath.push(path[i] + "/" + name);
                            }
                        }
                        this.modules[name] = autoload(newPath);
                    }
                    else {
                        // look for a path entry with a prefix matching the given name
                        var newPath = [];
                        var found = false;
                        for (var i in path) {
                            if (typeof(path[i]) == "object" && path[i].prefix == name) {
                                newPath.push(path[i].element);
                                found = true;
                            }
                            else {
                                newPath.push(path[i] + "/" + name);
                            }
                        }
                        if (found) {
                            this.modules[name] = autoload(newPath);
                        }
                        else {
                            // remember missing modules, so we don't look
                            // for them over and over
                            this.missing.name = true;
                        }
                    }
                }
                return this.modules[name];
            }
        }
        this.__put__ = function(name, value) {
            this.modules[name] = value;
        }
        this.__getIds__ = function() {
            var result = [];
            for (var m in this.modules) {
                result.push(m);
            }
            return result;
        }
    };

    /*
     * Return an object that can be passed to JSAdapter to
     * create a proxy for a Java map.
     */
    function MapAdapter(map) {
        this.__has__ = function(name) {
            return map.containsKey(name);
        }
        this.__get__ = function(name) {
            return map.get(name);
        }
        this.__put__ = function(name, value) {
            map.put(name, value);
        }
        this.__delete__ = function(name) {
            map.remove(name);
        }
        this.__getIds__ = function() {
            var result = [];
            for (var keyIterator = map.keySet().iterator(); keyIterator.hasNext();) {
                var key = keyIterator.next();
                result.push(key);
            }
            return result;
        }
    }

    /*
     * Return a javascript object that proxies for a "delayed" Java map.
     *
     * The map to be used is determined every time a property is accessed
     * by invoking the specified function, which must return a Java map object.
     */
    function DelayedMapAdapter(fn) {
        this.__has__ = function(name) {
            return fn().containsKey(name);
        }
        this.__get__ = function(name) {
            return fn().get(name);
        }
        this.__put__ = function(name, value) {
            fn().put(name, value);
        }
        this.__delete__ = function(name) {
            fn().remove(name);
        }
        this.__getIds__ = function() {
            var result = [];
            for (var keyIterator = fn().keySet().iterator(); keyIterator.hasNext();) {
                var key = keyIterator.next();
                result.push(String(key));
            }
            return result;
        }
    }
    
    /*
     * Return a Javascript object which autoloads properties
     * by looking for scripts of the same name in the given path.
     */
    function autoload(path) {
        return new JSAdapter(new Autoload(path));
    }

    /*
     * Return a Javascript object which is a proxy for the
     * given Java map.
     */
    function automap(javamap) {
        return new JSAdapter(new MapAdapter(javamap));
    }

    /*
     * Return a Javascript object which is a proxy for a
     * new concurrent Java map.
     */
    function createConcurrentAutomap() {
        return automap(new java.util.concurrent.ConcurrentHashMap());
    }

    /*
     * Define the "library" global variable and the "common" library module.
     */
    
    library = autoload(Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("application").path.library);
    library.__name__ = "library";
    
    library.common = {
        findFirst: findFirst,
        resolve: resolve,
        define: define,
        autoload: autoload,
        automap: automap,
        createConcurrentAutomap: createConcurrentAutomap,
        runLowLevelHandlersFor: runLowLevelHandlersFor
    };

    /*
     * Define some global variables.
     */
     
    module = autoload(Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("application").path.module);
    module.__name__ = "module";

    controller = autoload(Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("application").path.controller);
    controller.__name__ = "controller";

    // PENDING(robc): move this so it is globally defined, but from inside of jsf.js
    managedBeans = autoload(Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("application").path.managedBeans);

    globals = new JSAdapter(new DelayedMapAdapter(function() { return Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();}));

    invocation = new JSAdapter(new DelayedMapAdapter(function() { return Packages.com.sun.phobos.container.PhobosRuntime.getRequestContext();}));

    application = globals.application;

    runLowLevelHandlersFor("postCommon");

})();
