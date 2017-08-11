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

// Documentation module

library.common.define(module.system, "doc", function() {
    var log = library.log.get("application");
        
    function memberSortFn(m1, m2) {
        var v1 = m1.name;
        var v2 = m2.name;
        return ((v1 < v2) ? -1 : ((v1 > v2) ? 1 : 0));
    }

    /**
     * Parse the documentation for all scripts on the specified path name array
     * (e.g. ["application.path.library"], applying the optional filter function
     * to any generated messages.
     *
     * Returns an object with the following properties:
     *    errorCount .... number of parse errors
     *    succeeded ..... true if no errors
     *    modules ....... a list of module objects
     *    log ........... error log as a string
     *
     */
    function parseDocumentation(pathnames, messageFilterFn) {
        var errorReporter = new Packages.org.mozilla.javascript.ErrorReporter({
            warning: function(message, sourceName, line, lineSource, lineOffset) {
                writer.println("\nWARNING: " + message + " at " + sourceName + ":" + line);
            },
            error: function(message, sourceName, line, lineSource, lineOffset) {
                writer.println("\nERROR:   " + message + " at " + sourceName + ":" + line);
            },
            runtimeError: function(message, sourceName, line, lineSource, lineOffset) {
                throw new Packages.org.mozilla.javascript.EvaluatorException(message);
            },
        });
        var writer = new java.io.StringWriter();
        var parser = new Packages.com.sun.phobos.script.javascript.lang.JavaScriptParser(errorReporter);
        parser.preserveComments = true;
        parser.reservedKeywordAsIdentifier = true;
        var env = {parser: parser,
                   writer: {
                       println: function (s) {
                           writer.println(messageFilterFn ? messageFilterFn(s) : s);
                       }
                   },
                   modules: []
                  };
        
        for (var i = 0; i < pathnames.length; ++i) {
            var pathname = pathnames[i];
            processPath(library.common.resolve(pathname), env);
        }
        
        env.errorCount = parser.syntaxErrorCount;
        env.succeeded = parser.syntaxErrorCount == 0;        
        env.modules = env.modules.sort(memberSortFn);
        env.log = writer.toString();
        delete env.writer;
        
        return env;
    }

    function processPath(path, env) {
        for (var i = 0; i < path.length; ++i) {
            if (library.resource.isDirectory(path[i])) {
                processDirectory(path[i], env);
            }
        }
        return env;
    }
    
    function processDirectory(dirName, env) {
        var mustRecurse = [];
        if (library.resource.isDirectory(dirName) && dirName[0] != '.') {
            var children = library.resource.children(dirName);
            for (var i = 0; i < children.length; ++i) {
                var childName = dirName + "/" + String(children[i]);
                if (childName.substring(childName.length - 3) == ".js" && library.resource.exists(childName)) {
                    var status = processScript(childName, env);
                }
                else if (library.resource.isDirectory(childName)) {
                    mustRecurse.push(childName);
                }
            }
        }
        for (var i = 0; i < mustRecurse.length; ++i) {
            processDirectory(mustRecurse[i], env);
        }
        return env;
    }

    function processScript(resourceName, env) {
        var reader = new java.io.InputStreamReader(library.resource.getResourceAsStream(resourceName));
        try {
            var script = env.parser.parse(reader, resourceName);
            
            ////////////////////
                        
            function MockModule(name) {
                this.__moduleName__ = name;
            }
            
            MockModule.prototype.__makeSubModule__ = function(name) {
                var newModule = new MockModule(this.__moduleName__ + "." + name);
                return newModule;
            }

            MockModule.prototype.__makeAndRegisterSubModule__ = function(name) {
                var newModule = this.__makeSubModule__(name);
                this[name] = newModule;
                return newModule
            }
            
            function isModule(obj) {
                return obj.constructor == MockModule;
            }

            function describe(obj) {
                var s = "";
                if (library.lang.isFunction(obj.__describe__)) {
                    s = obj.__describe__();
                }
                else if (!library.lang.isObject(obj)) {
                    s = String(obj);
                }
                return s;
            }
            
            function summarize(name, obj) {
                if (obj == undefined) {
                    return undefined;
                }
                if (library.lang.isFunction(obj.__summarize__)) {
                    return obj.__summarize__(name);
                }
                if (!library.lang.isObject(obj)) {
                    return { kind: "scalar", value: String(obj), name: name };
                }
                return { kind: "unknown", name: name };
            }
            
            function MockFunction(functionNode) {
                this.functionNode = functionNode;
                this.prototype = {};
                this.__describe__ = function() {
                    var params = this.functionNode.parameters;
                    
                    var s = "function(";
                    var first = true;
                    library.lang.foreach(params, function(param) {
                        if (first) {
                            first = false;
                        }
                        else {
                            s += ", ";
                        }
                        s += param;
                    });
                    s += ")";
                    if (this.__comment__) {
                        s += " \"" + this.__comment__ + "\"";
                    }
                    return s;
                };
                
                this.__summarize__ = function(name) {
                    var result = { kind: "function", args: [], name: name };
                    var params = this.functionNode.parameters;
                    library.lang.foreach(params, function(param) {
                        result.args.push(param);
                    });
                    if (this.__comment__) {
                        result.comment = this.__comment__;
                    }
                    
                    if (result.comment && result.comment.indexOf("@nodoc ") != -1) {
                        result = undefined;
                    }
                    return result
                };
            }
            
            function MockClass() {
                this.prototype = {};
                this.__describe__ = function() {
                    var s = "(";
                    var first = true;
                    for (var p in this.prototype) {
                        if (p.substring(0,2) != "__") {
                            if (first) {
                                first = false;
                            }
                            else {
                                s+= ", ";
                            }
                            s += describe(this.prototype[p]);
                        }
                    }
                    s += ")";
                    if (this.__comment__) {
                        s += " \"" + this.__comment__ + "\"";
                    }
                    return s;
                };
                
                this.__summarize__ = function(name) {
                    var result = { kind: "class", name: name };
                    var members = [];
                    for (var p in this.prototype) {
                        if (p.substring(0,2) != "__") {
                            var v = summarize(p, this.prototype[p]);
                            if (v) {
                                members.push(v);
                            }
                        }
                    }
                    result.members = members.sort(memberSortFn);
                    if (this.__comment__) {
                        result.comment = this.__comment__;
                    }
                    return result
                };
            }
            
            function processComment(s) {
                if (!s) return undefined;
                s = String(s);
                if (s.charAt(0) != '*') {
                    return undefined;
                }
                s = String(s.substring(1));
                s = s.replace(/\n\s*\*/g, "\n");
                return s;
            }
            
            ////////
            
            function Interpreter() {
                this.globalScope = {};
                this.currentScope = this.globalScope;
                this.valueStack = [null];
                this.mockUndefined = {};
                this.currentComment = null;
                this.globalScope.controller = new MockModule("controller");
                this.globalScope.library = new MockModule("library");
                this.globalScope.module = new MockModule("module");
                
                // define special "immediate" functions
                this.specialGlobalScope = {};
                var libraryModule = new MockModule("library");
                var libraryCommonModule = libraryModule.__makeAndRegisterSubModule__("common");
                libraryCommonModule.define = library.lang.makeBoundFunction(this, "defineModule");
                var libraryLangModule = libraryModule.__makeAndRegisterSubModule__("lang");
                libraryLangModule.createClass = library.lang.makeBoundFunction(this, "createClass");
                this.specialGlobalScope.library = libraryModule;                
                this.useSpecialGlobalScope = false;
            }
            
            Interpreter.prototype.dispatchOnNodeType = function(target, prefix, node) {
                var self = this;
                var s = node.getClass().getName();
                if (s.startsWith("com.sun.phobos.script.javascript.lang.ast.") && s.endsWith("Node")) {
                    s = s.substring(s.lastIndexOf('.') + 1, s.length() - 4);
                    s = prefix + s;
                    return library.lang.invokeMethodOrFunction(target, s, function() {
                        return self.mockUndefined;
                    }, node);
                }
                else {
                    return this.mockUndefined;
                }
            }
            
            Interpreter.prototype.createScope = function() {
                var scope = {};
                scope.__parentScope__ = this.currentScope;
                this.currentScope = scope;
                return scope;
            }
            
            Interpreter.prototype.dropScope = function() {
                this.currentScope = this.currentScope.__parentScope__;
            }
            
            Interpreter.prototype.pushObjectScope = function(obj) {
                obj.__parentScope__ = this.currentScope;
                this.currentScope = obj;
            }

            Interpreter.prototype.dropObjectScope = function(obj) {
                var restoredScope = this.currentScope.__parentScope__;
                delete this.currentScope.__parentScope__;
                this.currentScope = restoredScope;
            }
                        
            Interpreter.prototype.findScopeFor = function(name) {
                var scope = this.currentScope;
                while (scope != undefined) {
                    if (scope == this.globalScope && this.useSpecialGlobalScope) {
                        scope = this.specialGlobalScope;
                    }
                    if (scope[name] != undefined) {
                        return scope;
                    }
                    scope = scope.__parentScope__;
                }
                return undefined;
            }
            
            ////////
                                
            Interpreter.prototype.evalPropertyGet = function(node) {
                if (node.expression) {
                    this.dispatchEval(node.expression);
                }
                else {
                    this.push(this.currentScope);
                }
                var root = this.valueStack.pop();
                if (root == null) {
                    this.push(null);
                }
                else if (root == this.currentScope) {
                    var scope = this.findScopeFor(node.name);
                    if (scope) {
                        this.push(scope[node.name]);
                    }
                    else {
                        this.push(null);
                    }
                }
                else if (root[node.name] != undefined) {
                    this.push(root[node.name]);
                }
                else if (isModule(root)) {
                    // automatically define a submodule
                    var newModule = root.__makeAndRegisterSubModule__(node.name);
                    this.push(newModule);
                }
                else {
                    this.push(null);
                }
            }
            
            Interpreter.prototype.evalString = function(node) {
                this.push(node.value);
            }
            
            Interpreter.prototype.evalNumber = function(node) {
                this.push(node.value);
            }
            
            Interpreter.prototype.evalFunctionExpr = function(node) {
                var fn = node.getFunction();
                var value = new MockFunction(fn);
                if (this.currentComment) {
                    value.__comment__ = processComment(this.currentComment);
                }
                if (fn.name != null && fn.name != "") {
                    var scope = this.findScopeFor(fn.name);
                    if (scope) {
                        scope[fn.name] = value;
                    }                    
                }
                this.push(value);
            }
            
            Interpreter.prototype.evalLiteral = function(node) {
                var type = node.type;
                var types = Packages.org.com.sun.phobos.script.javascript.lang.ast.LiteralNode.Type;
                var value;
                if (type == types.TRUE) {
                    value = true;
                }
                else if (type == types.FALSE) {
                    value = false;
                }
                else {
                    value = null;
                }
                this.push(value);
            }
            
            Interpreter.prototype.evalThis = function(node) {
                var scope = this.findScopeFor("this");
                this.push(scope ? scope["this"] : null);
            }
            
            Interpreter.prototype.evalCall = function(node) {
                var self = this;
                var args = [];
                library.lang.foreach(node.arguments, function(n) {
                    args.push(self.eval(n));
                });
                var fn = this.specialEval(node.target);
                if (library.lang.isFunction(fn)) {
                    var result = fn.apply(undefined, args);
                    this.push(result);
                }
                else if (fn instanceof MockFunction) {
                    var scope = this.createScope();
                    // TODO - handle calls with a receiver - how are they represented in the AST?
                    scope["this"] = undefined;
                    // TODO - add "arguments" object to new scope
                    library.lang.foreach(fn.functionNode.parameters, function(name) {
                        scope[name] = args.pop();
                    });
                    library.lang.foreach(fn.functionNode.variables, function(name) {
                        scope[name] = null;
                    });
                    library.lang.foreach(fn.functionNode.functions, function(innerFn) {
                        if (innerFn.name) {
                            scope[innerFn.name] = new MockFunction(innerFn);
                        }
                    });
                    try {
                        this.dispatchExecute(fn.functionNode.body);
                    }
                    finally {
                        this.dropScope();
                    }                    
                }
                else {
                    this.push(this.mockUndefined);
                }
            }
            
            Interpreter.prototype.evalAssignment = function(node) {
                if (!node.target.expression) {
                    var value = this.eval(node.value);
                    if (value != null) {
                        var scope = this.findScopeFor(node.target.name);
                        if (scope) {
                            scope[node.target.name] = value;
                        }
                    }
                }
                else {
                    var target = this.eval(node.target.expression);
                    var value = this.eval(node.value);
                    if (value != null) {
                        if (library.lang.isObject(target)) {
                            target[node.target.name] = value;
                        }
                    }
                }
                this.push(value);
            }
            
            Interpreter.prototype.dispatchEval = function(node) {
                this.dispatchOnNodeType(this, "eval", node);
            }
                
            
            Interpreter.prototype.eval = function(node) {
                this.dispatchEval(node);
                return this.pop();
            }
            
            // eval with a special global scope that knows about built-ins
            // we want to have evaluated immediately, like library.common.define
            Interpreter.prototype.specialEval = function(node) {
                var old = this.useSpecialGlobalScope;
                try {
                    this.useSpecialGlobalScope = true;
                    return this.eval(node);
                }
                finally {
                    this.useSpecialGlobalScope = old;
                }
            }
            
            Interpreter.prototype.push = function(value) {
                this.valueStack.push(value);
            }
            
            Interpreter.prototype.pop = function() {
                return this.valueStack.pop();
            }
                
            ////////
            
            Interpreter.prototype.dispatchExecute = function(node) {
                var old = this.currentComment;
                try {
                    this.currentComment = node.comment;
                    this.dispatchOnNodeType(this, "execute", node);
                }
                finally {
                    this.currentComment = old;
                }
            }
            
            Interpreter.prototype.executeScript = function(node) {
                if (node.comment && !node.body.comment) {
                    // push comment inward
                    var contents = node.body.contents;
                    if (contents.size() > 0) {
                        var first = contents.get(0);
                        if (!first.comment) {
                            first.comment = node.comment;
                        }
                    }
                }
                this.dispatchExecute(node.body);
            }
            
            Interpreter.prototype.executeBlock = function(node) {
                var self = this;
                library.lang.foreach(node.contents, function(n) { self.dispatchExecute(n) });
            }            
            
            Interpreter.prototype.executeExprStatement = function(node) {
                this.dispatchEval(node.expression);
            }

            Interpreter.prototype.executeDeclaration = function(node) {
                var self = this;
                library.lang.foreach(node.variables, function(n) {
                    var value = n.value == null ? null : self.eval(n.value);
                    self.currentScope[n.name] = value;
                });                
            }
            
            Interpreter.prototype.executeWith = function(node) {
                var target = this.eval(node.expression);
                if (library.lang.isObject(target)) {
                    try {
                        this.pushObjectScope(target);
                        this.execute(node.body);
                    }
                    finally {
                        this.dropObjectScope();
                    }
                }
            }
            
            ////////
            
            Interpreter.prototype.execute = function(node) {
                this.dispatchExecute(node);
            }            

            Interpreter.prototype.defineModule = function(parent, name, fn) {
                if (!parent || !isModule(parent)) {
                    return;
                }
  
                var existingModule = parent[name];
                if (existingModule) {
                    var newModule = parent.__makeSubModule__(name);
                }
                else {
                    var newModule = parent.__makeAndRegisterSubModule__(name);
                }
                newModule.__comment__ = processComment(this.currentComment);
                var scope = this.createScope();
                scope["this"] = {};
                library.lang.foreach(fn.functionNode.variables, function(name) {
                    scope[name] = null;
                });
                library.lang.foreach(fn.functionNode.functions, function(innerFn) {
                    if (innerFn.name) {
                        scope[innerFn.name] = new MockFunction(innerFn);
                    }
                })
                try {
                    this.dispatchExecute(fn.functionNode.body);
                }
                finally {
                    this.dropScope();
                }
                
                var moduleScope = scope["this"];
                var members = existingModule ? existingModule.exportedMembers : [];
                for (var p in moduleScope) {
                    var value = moduleScope[p];
                    var summary = this.summarize(p, value);
                    if (summary != undefined) {
                        members.push(summary);
                    }
                }
                
                if (existingModule) {
                    var comment = newModule.__comment__;
                    if (!existingModule.comment && comment) {
                        existingModule.comment = comment;
                    }
                    existingModule.exportedMembers = members.sort(memberSortFn);
                }
                else {
                    var theModule = { name: parent.__moduleName__ + "." + name };
                    var comment = newModule.__comment__;
                    if (comment) {
                        theModule.comment = comment;
                    }

                    theModule.exportedMembers = members.sort(memberSortFn);

                    env.modules.push(theModule);
                }
                
                return null;
            }
            
            Interpreter.prototype.summarize = function(name, obj) {
                return summarize(name, obj);
            }

            Interpreter.prototype.createClass = function() {
                var klass = new MockClass();
                if (this.currentComment) {
                    klass.__comment__ = processComment(this.currentComment);
                }
                return klass;
            }
            
            var interpreter = new Interpreter();
            interpreter.execute(script);
        }
        /*
        catch (e) {
            env.writer.println(e.message);
            // ignore for now
        }
        */
        finally {
            reader.close();
        }
        
        return env;
    }
    
    // exports
    this.parseDocumentation = parseDocumentation;
});
