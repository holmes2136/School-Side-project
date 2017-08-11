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
 * Mapping library module.
 */

library.common.define(library, "mapping", function() {
    
    var log = library.log.get("framework.mapping");

    /**
     * Compile the rules defined by the application into
     * a form usable by the [[applyRules|#applyRules]] function.
     *
     * @param(arguments, list of rules, optional)
     *    rules to compile
     * @return(array)
     *    an array of compiled rules
     */
    this.compileRules = function() {
        log.trace("mapping.compileRules");
        var rules = [];
        for (var i = 0; i < arguments.length; ++i) {
            if (arguments[i] != undefined) {
                if (library.lang.isArray(arguments[i])) {
                    for (var j = 0; j < arguments[i].length; ++j) {
                        if (library.lang.isObject(arguments[i][j])) {
                            rules.push(compileOneRule(arguments[i][j]));
                        }
                    }
                }
                else if (library.lang.isObject(arguments[i])) {
                    rules.push(compileOneRule(arguments[i]));
                }
            }
        }
        return rules;
    }

    /**
     * Apply a set of mapping rules to a URL. The first argument
     * is the URL to apply the rules to, all other arguments are
     * rules sets, i.e. arrays of rules, which are applied in order.
     *
     * A rule is an object of this form:
     *
     * {{{
     *    { url: "..." fn: function(...){...} }
     *    { url: "..." fn: "my.function.name" }
     *    { url: "..." script: "script.name" }
     *    { url: "..." content: "content.name" }
     * }}}
     *
     * If a rule has a "re" property, then it is assumed to be
     * a regexp that is applied to match the URL, e.g.
     *
     * {{{
     *    { re: "^/this$" fn: "my.function.name" }
     * }}}
     *
     * A rule can also be a function, in which case it is invoked with
     * the URL being mapped as an argument. If the function returns true,
     * it is assumed that it handled the URL, so no more rules are tried.
     *
     * After a rule matches, it associated function (i.e. the one specified
     * via the "fn" property) is invoked. Again, if it returns true no
     * further rules are tried.
     *
     * Optionally, a rule can also be named, e.g.
     *
     * {{{
     *    { url: "..." fn: ... name: "myFavoriteRule" }
     * }}}
     *
     * This does not affect matching in any way.
     *
     * @param(url, string, required)
     *   URL to dispatch on
     * @param(arguments except for the first, list of rules, optional)
     *   rules to apply
     */
    this.applyRules = function(url) {
        if (log.debugEnabled) {
            log.debug("mapping.applyRules: " + url);
        }
        var handled = false;
        for (var i = 1; i < arguments.length; ++i) {
            handled = applyOneRuleSet(url, arguments[i]);
            if (handled) {
                break;
            }
        }
        if (!handled) {
            if (log.debugEnabled) {
                log.debug("mapping.applyRules: failed to handle: " + url);
            }
            library.httpserver.sendNotFound(request.getRequestURI());
        }
        return handled;
    }

    function compileOneRule(rule) {
        var obj = processRuleUrl(rule.url);
        if (rule.re == undefined) {
            rule.re = obj.re;
        }
        if (rule.mapping == undefined) {
            rule.mapping = obj.mapping;
        }
        return rule;
    }
    
    function processRuleUrl(url) {
        url = String(url);
        var i = url.indexOf("@");
        if (i == -1) {
            return {re: new RegExp("^" + url + "$")};
        }
        else {
            var re = "^" + url.substring(0, i);
            var mapping = {};
            var length = 0;
            var j;
            while (i != -1) {
                var name = "";
                for (j = i + 1; j < url.length; ++j) {
                    var chn = url.charCodeAt(j);
                    if (!java.lang.Character.isLetterOrDigit(chn)) {
                        break;
                    }
                    name += url.charAt(j);
                }
                if (name == "") {
                        throw new Error("incorrect rule syntax: " + url);
                }
                if (url.charAt(j) == "=") {
                    if ((j+1) >= url.length || url.charAt(j+1) != "(") {
                        throw new Error("incorrect rule syntax: " + url);
                    }
                    re += "(";
                    j += 2;
                    var parCount = 1;
                    for (; j < url.length && parCount > 0; ++j) {
                        ch = url.charAt(j);
                        if (ch == "(") {
                            ++parCount;
                        }
                        else if (ch == ")") {
                            --parCount;
                        }
                        re += ch;
                    }
                    if (parCount != 0) {
                        throw new Error("incorrect rule syntax: " + url);
                    }
                }
                else {
                    re += "(\\w+)";
                }
                mapping[length] = name;
                ++length;
                i = url.indexOf("@", j);
                if (i != -1) {
                    re += url.substring(j, i);
                }
            }
            re += url.substring(j);
            re += "$";
            mapping.length = length;
        }
        return {re: new RegExp(re), mapping: mapping};
    }

    function applyOneRuleSet(url, rules) {
        if (rules == undefined) {
            return false;
        }
        for (var i = 0; i < rules.length; ++i) {
            if (rules[i] != undefined) {
                if (applyOneRule(url, rules[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    function applyOneRule(url, rule) {
        if (library.lang.isFunction(rule)) {
            return rule.call(undefined, url);
        }
        if (!library.lang.isObject(rule)) {
            return false;
        }
        var re = rule.re;
        if (re == undefined) {
            return false;
        }
        var match = re.exec(url);
        if (match != null) {
            var mapping = {}
            if (rule.mapping != undefined) {
                for (var j = 0; j < rule.mapping.length; ++j) {
                    var part = match[j + 1];
                    if (part != undefined) {
                        mapping[rule.mapping[j]] = part;
                    }
                }
            }
            if (rule.defaults != undefined) {
                for (p in rule.defaults) {
                    if (mapping[p] == undefined) {
                        mapping[p] = rule.defaults[p];
                    }
                }
            }
            if (rule.fn != undefined) {
                if (library.lang.isFunction(rule.fn)) {
                    if (log.debugEnabled) {
                        log.debug("mapping.applyRules: invoking anonymous rule function");
                    }
                    return rule.fn.call(undefined, match, mapping, rule);
                }
                else if (library.lang.isString(rule.fn)) {
                    var fn = library.common.resolve(rule.fn);
                    if (library.lang.isFunction(fn)) {
                        if (log.debugEnabled) {
                            log.debug("mapping.applyRules: invoking function: " + rule.fn);
                        }
                        return fn.call(undefined, match, mapping, rule);
                    }
                    else {
                        if (log.errorEnabled) {
                            log.error("mapping.applyRules: cannot find function: " + rule.fn);
                        }
                        throw new Error("cannot find function: " + rule.fn);
                    }
                }
                else {
                    log.error("mapping.applyRules: invalid mapping function");
                    throw new Error("invalid mapping function: " + rule.fn);
                }
            }
            else if (library.lang.isString(rule.script)) {
                var name = library.resource.findFirst(rule.script, application.path.script);
                if (name != undefined) {
                    // TODO - find a way to pass in the results of the match
                    if (log.debugEnabled) {
                        log.debug("mapping.applyRules: running script: " + name);
                    }
                    library.scripting.run(name);
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (library.lang.isString(rule.content)) {
                var name = library.resource.findFirst(rule.content, application.path.content);
                if (name != undefined) {
                    if (log.debugEnabled) {
                        log.debug("mapping.applyOneRule: sending content: " + name);
                    }
                    library.httpserver.sendResource(name, response);
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        return false;
    }

    /**
     * Map a URL to a script.
     *
     * @param(match, regexp match object, required)
     *     match from the regular expression of a rule
     * @param(mapping, object, required)
     *     mapping of rule arguments (prefixed by @ in a rule) to their value
     * @param(rule, object, required)
     *     rule that triggered the match
     * @return(boolean)
     *     true if a script was found and run successfully
     */
    this.maybeScript = function(match, mapping, rule) {
        log.trace("mapping.maybeScript");
        var scriptName = library.resource.findFirst(match.input.substring(1), application.path.script);
        if (scriptName != undefined) {
            invocation.mapping = mapping;
            invocation.rule = rule;
            if (log.debugEnabled) {
                log.debug("mapping.maybeScript: running script: " + scriptName);
            }
            library.scripting.run(scriptName);
            return true;
        }
        else {
            if (log.debugEnabled) {
                log.debug("mapping.maybeScript: no such script: " + match.input.substring(1));
            }
            return false;
        }
    }

    /**
     * Map a URL to a static resource.
     *
     * @param(match, regexp match object, required)
     *     match from the regular expression of a rule
     * @param(mapping, object, required)
     *     mapping of rule arguments (prefixed by @ in a rule) to their value
     * @param(rule, object, required)
     *     rule that triggered the match
     * @return(boolean)
     *     true if a static resource was found
     */
    this.maybeContent = function(match, mapping, rule) {
        log.trace("mapping.maybeContent");
        var contentName = library.resource.findFirst(match.input.substring(1), application.path.content);
        if (contentName != undefined) {
            if (log.debugEnabled) {
                log.debug("mapping.maybeContent: using static resource: " + contentName);
            }
            var resource = new library.rest.StaticResource(contentName);            
            resource.handleRequest();
            return true;
        }
        else {
            if (log.debugEnabled) {
                log.debug("mapping.maybeContent: no such static resource: " + match.input.substring(1));
            }
            return false;
        }
    }

    /**
     * Map a URL to a REST resource.
     *
     * @param(match, regexp match object, required)
     *     match from the regular expression of a rule
     * @param(mapping, object, required)
     *     mapping of rule arguments (prefixed by @ in a rule) to their value
     * @param(rule, object, required)
     *     rule that triggered the match
     * @return(boolean)
     *     true if a REST resource was found
     */
    this.maybeREST = function(match, mapping, rule) {
        log.trace("mapping.maybeREST");
        var resource;
        if (rule.factory != undefined) {
            var factory = library.common.resolve(rule.factory);
            if (library.lang.isFunction(factory)) {
                if (log.debugEnabled) {
                    log.debug("mapping.maybeREST: using factory: " + rule.factory);
                }
                resource = factory.call(null, match, mapping, rule);
            }
            else {
                if (log.debugEnabled) {
                    log.debug("mapping.maybeREST: no such function: " + rule.factory);
                }
            }
        }
        else if (rule.resource != undefined) {
            if (log.debugEnabled) {
                log.debug("mapping.maybeREST: using resource: " + rule.resource);
            }
            resource = library.lang.instantiate(rule.resource);
            if (resource == undefined) {
                if (log.debugEnabled) {
                    log.debug("mapping.maybeREST: no such resource: " + rule.resource);
                }
            }
        }
        if (resource != undefined) {
            if (log.debugEnabled) {
                log.debug("mapping.maybeREST: calling handleRequest on resource");
            }
            resource.handleRequest();
            return true;
        }
        else {
            if (log.debugEnabled) {
                log.debug("mapping.maybeContent: failed to create a resource");
            }
            return false;
        }
    }
    
    /**
     * Map a URL to a controller.
     * 
     * The controller is looked up by name under the controller global
     * object, then a property with the same name with the first letter
     * uppercase is retrieved and used as a constructor.
     * Then we look up a method called __onRequest__. As the double undescores
     * say, it's mean to implemented by the framework (the controller base
     * class, to be precise), not the user. If it isn't there, we use the
     * the action to look up a method to invoke. If we cannot find a method
     * with the required name, we call the onRequest method, if present.
     * Otherwise we give up.
     *
     * Example: a URL like ``/test/foo/42`` matched against a rule like
     * ``/@controller/@action/@id`` results in a call to
     *
     * {{{
     *   (new controller.test.Test()).__onRequest__({controller: "test", action: "foo", id: "42"});
     * }}}
     *
     * if present, otherwise
     *
     * {{{
     *   (new controller.test.Test()).foo({controller: "test", action: "foo", id: "42"});
     * }}}
     *
     * if present, otherwise if there is no suitable "foo" property, to
     *
     * {{{
     *   (new controller.test.Test()).onRequest({controller: "test", action: "foo", id: "42"});
     * }}}
     *
     * otherwise we give up and the corresponding rule fails.
     *
     * @param(match, regexp match object, required)
     *     match from the regular expression of a rule
     * @param(mapping, object, required)
     *     mapping of rule arguments (prefixed by @ in a rule) to their value
     * @param(rule, object, required)
     *     rule that triggered the match
     * @return(boolean)
     *     true if a controller was instantiated and the request dispatched to it 
     */
    this.maybeController = function(match, mapping, rule) {
        log.trace("mapping.maybeController");
        if (mapping != undefined) {
            var controllerName = mapping.controller;
            if (controllerName == undefined) {
                if (log.debugEnabled) {
                    log.debug("mapping.maybeController: no controller configured");
                }
            }
            
            var moduleName = rule.prefix == undefined ?
                             controllerName :
                             (rule.prefix + "." + controllerName);
            var actionName = mapping.action;
            var controllerModule = library.common.resolve(moduleName, controller);
            if (library.lang.isObject(controllerModule)) {
                var uppercaseControllerName = controllerName.substring(0, 1).toUpperCase() + controllerName.substring(1);
                var controllerFn = controllerModule[uppercaseControllerName];
                if (library.lang.isFunction(controllerFn)) {
                    var controllerInstance = new controllerFn();
                    if (log.debugEnabled) {
                        log.debug("mapping.maybeController: created controller: " + moduleName + "." + uppercaseControllerName);
                    }
                    try {
                        invocation.controller = controllerInstance;
                        invocation.mapping = mapping;
                        invocation.rule = rule;
                        var actionFn;
                        actionFn = controllerInstance.__onRequest__;
                        if (library.lang.isFunction(actionFn)) {
                            if (log.debugEnabled) {
                                log.debug("mapping.maybeController: invoking method: __onRequest__");
                            }
                            actionFn.call(controllerInstance, mapping);
                            return true;
                        }
                        if (actionName) {
                            actionFn = controllerInstance[actionName];
                            if (library.lang.isFunction(actionFn)) {
                                if (log.debugEnabled) {
                                    log.debug("mapping.maybeController: invoking method: " + actionName);
                                }
                                actionFn.call(controllerInstance, mapping);
                                return true;
                            }
                        }
                        actionFn = controllerInstance.onRequest;
                        if (library.lang.isFunction(actionFn)) {
                            if (log.debugEnabled) {
                                log.debug("mapping.maybeController: invoking method: onRequest");
                            }
                            actionFn.call(controllerInstance, mapping);
                            return true;
                        }
                    }
                    finally {
                        delete invocation.controller;
                        delete invocation.mapping;
                        delete invocation.rule;
                    }
                }
                else {
                    if (log.debugEnabled) {
                        log.debug("mapping.maybeController: no such class: " + moduleName + "." + uppercaseControllerName);
                    }
                }
            }
            else {
                if (log.debugEnabled) {
                    log.debug("mapping.maybeController: no such module: " + moduleName);
                }
            }
        }
        return false;
    }
    
    /**
     * Map a URL to some dynamic content.
     *
     * Dynamic content works pretty much like PHP: every file in the
     * application.path.dynamic is directly addressable. If the extension is
     * a member of ``application.options.content.dynamic.extensions``, then the file is going
     * to be run as a script, otherwise it's treated as a static resource.
     *
     * @param(match, regexp match object, required)
     *     match from the regular expression of a rule
     * @param(mapping, object, required)
     *     mapping of rule arguments (prefixed by @ in a rule) to their value
     * @param(rule, object, required)
     *     rule that triggered the match
     * @return(boolean)
     *     true if a dynamic resource was found
     */
    this.maybeDynamic = function(match, mapping, rule) {
        log.trace("mapping.maybeDynamic");
        var resourceName = library.resource.findFirst(match.input.substring(1), application.path.dynamic);
        if (resourceName != undefined) {
            invocation.mapping = mapping;
            invocation.rule = rule;
            var extension = library.resource.getExtension(resourceName);
            if (application.options.content.dynamic.extensions[extension] == true) {
                // run it as a script
                if (log.debugEnabled) {
                    log.debug("mapping.maybeDynamic: running script: " + resourceName);
                }
                library.scripting.run(resourceName);
                return true;
            }
            else {
                // serve it as a static resource
                if (log.debugEnabled) {
                    log.debug("mapping.maybeDynamic: using resource: " + resourceName);
                }
                var resource = new library.rest.StaticResource(resourceName);            
                resource.handleRequest();
                return true;
            }
        }
        else {
            if (log.debugEnabled) {
                log.debug("mapping.maybeContent: no such dynamic resource: " + match.input.substring(1));
            }
            return false;
        }
    }
    
});
