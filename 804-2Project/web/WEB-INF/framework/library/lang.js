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
 * Lang library module.
 */

library.common.define(library, "lang", function() {

    var log = library.log.get("framework.lang");
    
    /**
     * Return true if argument is an array.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is an array
     */
    this.isArray = function(obj) {
        return obj != null && typeof(obj) == "object" && typeof(obj.length) == "number";
    }
    
    /**
     * Return true if argument is a function.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a function
     */
    this.isFunction = function(obj) {
        return typeof(obj) == "function";
    }

    /**
     * Return true if argument is an object.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a JavaScript object
     */
    this.isObject = function(obj) {
        return obj != null && typeof(obj) == "object";
    }
    
    /**
     * Return true if argument is a string.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a JavaScript string
     */
    this.isString = function(obj) {
        return typeof(obj) == "string";
    }

    /**
     * Return true if argument is a boolean.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a JavaScript boolean
     */
    this.isBoolean = function(obj) {
        return typeof(obj) == "boolean";
    }

    /**
     * Return true if argument is a number.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a JavaScript number
     */
    this.isNumber = function(obj) {
        return typeof(obj) == "number";
    }

    /**
     * Return true if argument is a Java string.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a Java string
     */
    this.isJavaString = function(obj) {
        return library.lang.getJavaClass(obj) == "java.lang.String";
    }

    /**
     * Return true if argument is a Java object.
     *
     * @param(obj, any, optional) a value
     * @return(boolean)
     *   true iff the object is a Java object
     */
    this.isJavaObject = function(obj) {
        return library.lang.getJavaClass(obj) != undefined;
    }
    
    /**
     * Return the name of the Java class for a Java object,
     * or undefined if the object is a native Javascript one.
     *
     * @param(obj, any, optional) a value
     * @return(string)
     *   the name of the Java class the object is an instance of, or undefined
     *   if the argument is not a Java object
     */
    this.getJavaClass = function(obj) {
        // we are very careful here because the easy way fails
        // with an exception when dealing with native arrays
        if (typeof(obj) == "object" && library.lang.isFunction(obj['getClass'])) {
            var klass = obj.getClass();
            if (typeof(klass) == "object" && library.lang.isFunction(klass['getName'])) {
                var name = klass.getName();
                if (name) {
                    return String(name);
                }
            }
        }
        return undefined;
    }

    /**
     * Convert an object to an array. Acceptable arguments
     * are undefined, null, Java lists, Java iterables and
     * of course Javascript arrays (no-op). If no conversion
     * is possible, an exception is thrown.
     *
     * @param(obj, any, optional)
     *   object to convert
     * @return(array)
     *   a JavaScript array
     */
    this.toArray = function(obj) {
        log.trace("lang.toArray");
        if (library.lang.isArray(obj)) {
            return obj;
        }
        if (obj == undefined || obj == null) {
            return [];
        }
        
        if (library.lang.isJavaObject(obj) && obj instanceof java.lang.Iterable) {
            var result = [];
            for (var iterator = obj.iterator(); iterator.hasNext();) {
                result.push(iterator.next());
            }
            return result;
        }
        
        if (log.errorEnabled) {
            log.error("lang.toArray: invalid argument type");
        }
        throw new Error("invalid argument type");
    }

    /**
     * Make a shallow copy of an object.
     * Scalars are returned unmodified; objects and arrays are copied
     * in a shallow fashion (one level deep); for objects, only enumerable
     * properties are copied. Java objects are cloned, if possible, otherwise
     * they are simply returned as-is.
     *
     * @param(obj, any, required)
     *   object to copy
     * @return(any)
     *   shallow copy of the argument
     */
    this.shallowCopy = function(obj) {
        log.trace("lang.shallowCopy");
        if (library.lang.isString(obj)) {
            return obj;
        }
        
        if (library.lang.isArray(obj)) {
            var newObj = [];
            for (var i = 0; i < obj.length; ++i) {
                newObj.push(obj[i]);
            }
            return newObj;
        }
                
        if (library.lang.isJavaObject(obj)) {
            if (obj instanceof java.lang.Cloneable) {
                return obj.clone();
            }
            else {
                return obj;
            }
        }
        
        if (library.lang.isObject(obj)) {
            var newObj = {};
            for (var p in obj) {
                newObj[p] = obj[p];
            }
            return newObj;
        }

        return obj;
    }

    /**
     * Make a shallow copy of the first argument and extend it by adding
     * all the properties in the second one.
     *
     * @param(obj, object, required)
     *   object to copy
     * @param(ext, object, optional)
     *   object whose property are to be added to the shallow copy
     * @return(object)
     *   copied and extended object
     */
    this.shallowExtend = function(obj, ext) {
        log.trace("lang.shallowExtend");
        var obj = library.lang.shallowCopy(obj);
        if (library.lang.isObject(obj)) {
            for (var p in ext) {
                if (obj[p] == undefined) {
                    obj[p] = ext[p]
                }
            }
        }
        return obj;
    }

    /**
     * Attempt to instantiate an object (i.e. use it as a constructor).
     * If the argument is a string, try to resolve it into an object
     * using library.common.resolve.
     *
     * @param(obj, function or string, optional)
     *   either a function to be used as a constructor or a string
     *   which is resolved using [[library.common.resolve|library.common.html#resolve]]
     *   to produce a function, which is then used as a constructor
     * @return(object)
     *   an instance of the specified function or ``undefined`` if the
     *   argument didn't result in a function
     */
    this.instantiate = function(obj) {
        log.trace("lang.instantiate");
        if (typeof(obj) == "string") {
            obj = library.common.resolve(obj);
        }
        if (typeof(obj) == "function") {
            return new obj();
        }
        else {
            return undefined;
        }
    }

    /**
     * Attempt to invoke a method on an object.
     *
     * @param(obj, object, required)
     *   object whose method needs to be invoked
     * @param(name, string, required)
     *   method name
     * @return(any)
     *   the result of the method invocation, or ``undefined`` if
     *   the method was not found
     */
     this.invokeMethod = function(obj, name) {
        log.trace("lang.invokeMethod");
        if (obj != undefined) {
            if (typeof(obj[name]) == "function") {
                var args = [];
                for (var i = 2; i < arguments.length; ++i) {
                    args.push(arguments[i]);
                }
                return obj[name].apply(obj, args);
            }
        }
        return undefined;
     }
    
    /**
     * Attempt to invoke a method on an object.
     *
     * If the method does not exist, invoke the given fn.
     *
     * @param(obj, object, required)
     *   object whose method needs to be invoked
     * @param(name, string, required)
     *   method name
     * @param(fn, function, required)
     * @return(any)
     *   the result of the method invocation, or the result of
     *   invoking ``fn`` is the method was not found
     */
     this.invokeMethodOrFunction = function(obj, name, fn) {
        log.trace("lang.invokeMethodOrFunction");
        if (obj != undefined) {
            if (typeof(obj[name]) == "function") {
                var args = [];
                for (var i = 3; i < arguments.length; ++i) {
                    args.push(arguments[i]);
                }
                return obj[name].apply(obj, args);
            }
        }
        return fn();
     }

    /**
     * Mix in the properties of the second object into the first,
     * without overriding the ones that already present.
     *
     * If both arguments are functions, do the mixin at the prototype
     * level, i.e. treat ``mixin(f1, f2)`` as ``mixin(f1.prototype, f2.prototype)``.
     *
     * @param(obj1, function or object, required)
     *   object whose properties must be extended
     * @param(obj2, function or object, required)
     *   object whose properties will be added to the first argument
     * @return(object)
     *   the first object, newly extended
     */
    this.mixin = function(obj1, obj2) {
        log.trace("lang.mixin");
        if (library.lang.isFunction(obj1) &&
            library.lang.isFunction(obj2)) {
            obj1 = obj1.prototype;
            obj2 = obj2.prototype;
        }
        
        for (p in obj2) {
            if (!obj1[p]) {
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    };

    function makeDynamic(parents) {
        return new JSAdapter(new function() {
            this.__has__ = function(name) {
                for (var i = 0; i < parents.length; ++i) {
                    if (name in parents[i]) {
                        return true;
                    }
                }
                return false;
            },
            this.__get__ = function(name) {
                for (var i = 0; i < parents.length; ++i) {
                    if (name in parents[i]) {
                        return parents[i][name];
                    }
                }
                return undefined;
            }
            this.__put__ = function(name, value) {
                if (parents[0]) {
                    parents[0][name] = value;
                }
            }
            this.__getIds__ = function() {
                var result = [];
                var alreadySeen = {};
                for (var i = 0; i < parents.length; ++i) {
                    for (var p in parents[i]) {
                        if (!alreadySeen[p]) {
                            result.push(p);
                            alreadySeen[p] = true;
                        }
                    }
                }
                return result;
            }
        });
    };

    /**
     * Extend the first object by making it delegate to the second one.
     * The second argument can also be a list of objects, in which
     * case delegation happens in order.
     * Unlike the "mixin" function above, properties are not actually
     * copied from one object to the other; instead, we alter the prototype
     * chain using a Rhino-specific javascript extension.
     *
     * @param(obj1, object, required)
     *   object to be extended
     * @param(obj2, object, required)
     *   object whose properties will be added (indirectly) to the first argument
     * @return(object)
     *   the first object, newly extended     
     */
    this.extend = function(obj1, obj2) {
        log.trace("lang.extend");
        if (typeof(obj2) == "object") {
            var parents;
            if (typeof(obj2.length) == "number") {
                parents = obj2;
            }
            else {
                parents = [obj2];
            }
            var proto = obj1.__proto__;
            if (proto) {
                // place the current prototype at the front of the list,
                // so that the new prototype returned by makeDynamic will
                // add new properties to it
                parents.unshift(proto);
            }        
            obj1.__proto__ = makeDynamic(parents);        
        }
        return obj1;
    };
    
    /**
     * Create a new "class", optionally, specifying one or more "superclasses".
     *
     * Each class can define a method called "initialize" that will be called
     * when the "class" function is invoked as a constructor.
     * The "initialize" methods of superclasses are called in reverse order,
     * the one on the "class" itself being last.
     * Property ("field" or "method") lookup proceeds in forward order,
     * starting with the "class" prototype.
     *
     * Additionally, each class can define a method called "initializeSubclass" that
     * will be called whenever a subclass of the current class is created. This
     * function takes one argument, the subclass being initialized. Subclass
     * initialization functions can be used to add to a subclass properties
     * that shouldn't simply be inherited via prototypes. Subclass initializers
     * are called in reverse order too.
     *
     * Classes define a special property, __super__, that can be used to invoke
     * a method in a superclass (via Function.apply).
     *
     */
    this.createClass = function() {
        log.trace("lang.createClass");
        var fn = function() {
            this.__initialize__.apply(this, arguments);
        };
        if (arguments.length > 0) {
            var protos = [fn.prototype];
            var superProtos = [];
            for (var i = 0; i < arguments.length; ++i) {
                if (typeof(arguments[i]) == "function") {
                    if (arguments[i].prototype) {
                        protos.push(arguments[i].prototype);
                        superProtos.push(arguments[i].prototype);
                    }
                }
                else if (library.lang.isObject(arguments[i])) {
                    protos.push(arguments[i]);
                    superProtos.push(arguments[i]);
                }
                else {
                    if (log.errorEnabled) {
                        log.error("lang.createClass: invalid argument");
                    }
                    throw new Error("invalid argument to createClass");
                }
            }
            
            fn.prototype = makeDynamic(protos);            
            fn.prototype.__super__ = superProtos.length == 1 ? superProtos[0] : makeDynamic(superProtos);
            fn.prototype.__initialize__ = function() {
                for (var i = protos.length - 1; i > 0; --i) {
                    if (typeof(protos[i].__initialize__) == "function") {
                        protos[i].__initialize__.apply(this, arguments);
                    }
                }
                if (typeof(protos[0].initialize) == "function") {
                    protos[0].initialize.apply(this, arguments);
                }
            }
            
            for (var i = arguments.length - 1; i >= 0; --i) {
                if (arguments[i] && typeof(arguments[i].__initializeSubclass__) == "function") {
                    arguments[i].__initializeSubclass__(fn);
                }
            }

            var theArgs = arguments;
            fn.__initializeSubclass__ = function(subclass) {
                for (var i = theArgs.length - 1; i >= 0; --i) {
                    if (theArgs[i] && typeof(theArgs[i].__initializeSubclass__) == "function") {
                        theArgs[i].__initializeSubclass__.apply(theArgs[i], arguments);
                    }
                }
                if (fn.initializeSubclass && typeof(fn.initializeSubclass) == "function") {
                    fn.initializeSubclass.apply(fn, arguments);
                }
            }
        }
        else {
            fn.prototype.__initialize__ = function() {
                if (typeof(fn.prototype.initialize) == "function") {
                    fn.prototype.initialize.apply(this, arguments);
                }
            }
            fn.__initializeSubclass__ = function(subclass) {
                if (fn.initializeSubclass && typeof(fn.initializeSubclass) == "function") {
                    fn.initializeSubclass.apply(fn, arguments);
                }
            }
        }
        return fn;
    };
    

    /**
     * Useful mixin to spell out the contract for subclasses of a given class.
     */
    this.ContractMixin = function() {};
    this.ContractMixin.prototype.shouldImplement = function() {
        if (log.errorEnabled) {
            log.error("lang.ContractMixin.shouldImplement: assertion failed");
        }
        throw new Error("subclasses should implement this method");
    }
    this.ContractMixin.prototype.shouldNotImplement = function() {
        if (log.errorEnabled) {
            log.error("lang.ContractMixin.shouldNotImplement: assertion failed");
        }
        throw new Error("subclasses should not implement this method");
    }
    this.ContractMixin.prototype.subclassResponsibility = function(message) {
        if (log.errorEnabled) {
            log.error("lang.ContractMixin.subclassResponsibility: assertion failed");
        }
        var s = "subclasses should implement this method";
        if (message != undefined) {
            s+= ": ";
            s += String(message);
        }
        throw new Error(s);
    }

    /**
     * Interpolate a string using Ruby-like syntax. E.g.
     *
     * {{{
     *   library.lang.interpolate("#{a} #{b}", {a: 5, b: "foo"})
     * }}}
     *
     * returns
     *
     * {{{
     *   "5 foo"
     * }}}
     * 
     * @param(str, string, required)
     *   string to interpolate
     * @param(obj, object, required)
     *   object whose properties are used as variable name/value pairs
     *   to perform the interpolation
     * @return(string)
     *   the interpolated string
     */
     this.interpolate = function(str, obj) {
        log.trace("lang.interpolate");
        if (!library.lang.isString(str)) {
            str = String(str);
        }
        var nextMatch = str.indexOf("#");
        if (nextMatch == -1) {
            return str;
        }
        var result = "";
        var i = 0;
        while (nextMatch != -1) {
            var nextCh = str.charAt(nextMatch + 1);
            if (nextCh == "{"); {
                var closingPos = str.indexOf("}", nextMatch + 2);
                if (closingPos != -1) {
                    var name = str.substring(nextMatch + 2, closingPos);
                    var value = obj[name];
                    if (value == undefined || value == null) {
                        value = "";
                    }
                    value = String(value);
                    result += str.substring(i, nextMatch);
                    result += value;
                    i = closingPos + 1;
                    nextMatch = closingPos;
                }
            }
            nextMatch = str.indexOf("#", nextMatch + 1);
        }
        result += str.substring(i);
        return result;
    }

    /**
     * Look inside the given object for a function-valued
     * property named after the selector. If found, invoke
     * it with the selector as argument. If not, look for
     * a function-valued property called "any" and invoke
     * it (if present) with the selector as argument.
     * Otherwise, do nothing. The third argument is passed
     * as-is to any invoked function.
     *
     * @param(selector, string, required)
     *   name of the targeted method
     * @param(obj, object, required)
     *   object to be used as receiver
     * @param(arg, object, optional)
     *   argument to the dispatched method
     */
    this.dispatch = function(selector, obj, arg) {
        log.trace("lang.dispatch");
        if (selector == undefined) {
            return undefined;
        }
        if (library.lang.isFunction(obj[selector])) {
            return obj[selector].call(obj, selector, arg);
        }
        else if (library.lang.isFunction(obj.any)) {
            return obj.any(selector, arg);
        }
        else {
            return undefined;
        }
    }


    /**
     * Execute the given function with the specified object as argument,
     * making sure to close the object once the function returns. The
     * object can be anything that has a "close" method.
     *
     * @param(obj, object or function, required)
     *   either an object (the resource to be closed) or a function which will be invoked without
     *   arguments to obtain an object, to be used as the resource to be closed
     * @param(fn, function, required)
     *   function to be invoked with ``obj`` as the argument
     * @return(object)
     *   the value returned by the function invocation
     */    
    this.using = function(obj, fn) {
        log.trace("lang.using");
        if (library.lang.isFunction(obj)) {
            obj = (obj)();
        }
        try {
            return fn(obj);
        }
        finally {
            if (obj != undefined) {
                if (library.lang.isFunction(obj.close)) {
                    obj.close();
                }
            }
        }
    }

    /**
     * Execute the given function with the specified object as argument,
     * making sure to close the object once the function returns. The
     * object can be anything that has a "close" method.
     *
     * @param(obj, object or function, required)
     *   either an object (the resource to be closed) or a function which will be invoked
     *   as a constructor without arguments to obtain an object, to be used as the resource
     *   to be closed
     * @param(fn, function, required)
     *   function to be invoked with ``obj`` as the argument
     * @return(object)
     *   the value returned by the function invocation
     */    
    this.usingNew = function(obj, fn) {
        log.trace("lang.usingNew");
        if (library.lang.isFunction(obj)) {
            obj = new (obj)();
        }
        try {
            return fn(obj);
        }
        finally {
            if (obj != undefined) {
                if (library.lang.isFunction(obj.close)) {
                    obj.close();
                }
            }
        }
    }

    /**
     * Apply the specified function to each element/property of the object (an array,
     * a JavaScript object or an iterable Java object.
     * 
     * Whenever the specified function is invoked with two arguments, the second
     * one is a key to the value passed in as the first argument, so that in
     * {{{
     *      foreach(obj, fn(a,b) { ... })
     * }}}
     * it is guaranteed that whenever`` b != undefined`` then ``obj[b] == a``.
     * 
     * @param(obj, object, required)
     *   an iterable object
     * @param(fn, function, required)
     *   the function to iterate
     * @return(undefined)
     */
     this.foreach = function(obj, fn) {         
        log.trace("lang.foreach");
         if (obj != undefined &&
             obj["__foreach__"] != undefined &&
             typeof(obj["__foreach__"]) == "function") {
                 obj["__foreach__"].apply(obj, [fn]);
         }
         else if (library.lang.isArray(obj)) {
             for (var i = 0; i < obj.length; ++i) {
                 fn(obj[i], i);
             }
         }
         else if (library.lang.isJavaObject(obj) && obj instanceof java.lang.Iterable) {
             for (var iterator = obj.iterator(); iterator.hasNext();) {
                fn(iterator.next());
             }
         }
         else if (library.lang.isObject(obj)) {
             for (var p in obj) {
                 fn(obj[p], p);
             }
         }
     }
     
    /**
     * Establish a context from which an inner function can return using
     * the [[deepReturn|library.lang.html#deepReturn]] library function.
     *
     * For example:
     *
     * {{{
     *     function myFunction() {
     *         return library.lang.withDeepReturn(function() {
     *             function f(value) {
     *                 // ...
     *                 library.lang.deepReturn(value);
     *             }
     *             // ... some code here ...
     *             if (...) {
     *                 f(42);
     *             }
     *         });
     *     }
     * }}}
     * 
     * In the example, any calls to [[deepReturn|library.lang.html#deepReturn]]
     * made inside the block protected by withDeepReturn returns from the whole block,
     * not just from the function that called it (f, in this case).
     *
     * If the block returns normally, its result is returned as the
     * result of the deepReturn function.
     *
     * @param(fn, function, required)
     *   function to be invoked with a deep return handler installed
     * @return(any)
     *   value returned by the function ``fn``, either via a normal return
     *   or via a deep return
     */
     this.withDeepReturn = function(fn) {
         log.trace("lang.withDeepReturn");
         try {
             var result = fn();
             return result;
         }
         catch (e) {
             if (e.__deepReturnValue__ != undefined) {
                 return e.__deepReturnValue__;
             }
             else {
                 throw e;
             }
         }
     }
     
     /**
      * Return a value from a deeply nested function. The value is
      * returned all the way out to the closest dynamically scoped
      * [[withDeepReturn|library.lang.html#withDeepReturn]] function.
      *
      * @param(value, any, required)
      *    the value to be returned
      * @return(none)
      *    this function does not return normally
      */
      this.deepReturn = function(value) {
          log.trace("lang.deepReturn");
          throw {__deepReturnValue__: value};
      }
      
      /**
       * Check the given "keyword arguments" object for a function against the template
       * and returns the new argument object.
       *
       * @param(args, object or string, optional)
       *   argument object, may be undefined
       * @param(template, object, optional)
       *   a template used for keyword arguments; if missing, the function returns immediately
       * @kparam(stringDefault, string, optional)
       *     if ``args`` is simply a string, it is converted
       *     to an object with a single property whose name is the value
       *     of this keyword argument
       * @kparam(required, array of strings, optional)
       *     if ``args`` doesn't have a property whose name
       *     is in this list, an exception is thrown
       * @kparam(defaults, object, optional)
       *     if ``args`` doesn't have a property whose name
       *     is a property name in "defaults", it is added with the
       *     specified default value
       * @return(object)
       *     the first argument ``args``        
       */
      this.checkKeywordArguments = function(args, template) {
          log.trace("lang.checkKeywordArguments");
          if (library.lang.isObject(template)) {
              if (args == undefined) {
                  return args;
              }
              if (library.lang.isString(template.stringDefault)) {
                  var oldArgs = args;
                  args = new Object();
                  args[stringDefault] = oldArgs;
              }
              if (library.lang.isArray(template.required)) {
                  for (var i = 0; i < template.required.length; ++i) {
                      if (args[template.required[i]] == undefined) {
                          throw new Error("missing required keyword argument: " + template.required[i]);
                      }
                  }
              }
              if (library.lang.isObject(template.defaults)) {
                  for (var p in template.defaults) {
                      if (args[p] == undefined) {
                          args[p] = template.defaults[p];
                      }
                  }
              }              
          }
          return args;
      }
      
     /**
      * Return a bound function for the object passed as the first argument (the "receiver").
      * This is a function that, when invoked, will use the receiver as ``this``.
      *
      * @param(obj, object, required)
      *   object to use as receiver for the function invocation
      * @param(nameOrFn, function or string, required)
      *   can either be a function, which will be used directly,
      *   or a string which will be used to look up a function-valued property of
      *   the same name in the receiver ``obj``.
      * @return(function)
      *   a function which, when invoked, will invoke the function identified by ``nameOrFn``
      *   as if it was a method of ``obj``
      */
      this.makeBoundFunction = function(obj, nameOrFn) {
          log.trace("lang.makeBoundFunction");
          var fn;
          if (typeof(nameOrFn) == "function") {
              fn = nameOrFn;
          }
          else {
              fn = obj[nameOrFn];              
              if (typeof(fn) != "function") {
                  if (log.errorEnabled) {
                      log.error("lang.makeBoundFunction: not a function: " + nameOrFn);
                  }
                  throw new Error("not a function: " + nameOrFn);
              }
          }
          return function() {
              return fn.apply(obj, arguments);
          }
      }

      /**
       * Create an object that inherits (via delegation) from the given one.
       *
       * For more information, see Douglas Crockford's article at
       * [[http://javascript.crockford.com/prototypal.html]].
       *
       * @param(obj, object, required)
       *   object to delegate to
       * @return(object)
       *   the newly created object
       */
      this.object = function(obj) {
          log.trace("lang.object");
          function Constructor() {}
          Constructor.prototype = obj;
          return new Constructor();
      }    
      
      /**
       * Invoke a function asynchronously.
       *
       * The function is invoked in a separate thread using the task library.
       *
       * The name of function to invoke is resolved using the
       * ``library.common.resolve`` function, so it may include a string argument,
       * separated by a ``@`` character.
       *
       * For example, the following code snippet invokes the function ``module.test.foo``:
       *
       * {{{
       *
       * library.lang.invokeAsync("module.test.foo");
       *
       * }}}
       *
       * @param(functionName, string, required)
       * 
       */
       this.invokeAsync = function(functionName) {
           if (log.traceEnabled) {
               log.trace("lang.invokeAsync: " + functionName);
           }
           if (!library.lang.isString(functionName)) {
               if (log.errorEnabled) {
                   log.error("lang.invokeAsync: argument must be a string");
               }
               throw new Error("argument must be a string: " + functionName);
           }

           library.task.submitScriptTask('/framework/task/invokeAsync.js', functionName);
       }

      /**
       * Invoke a function asynchronously passing an argument which will be
       * serialized and deserialized using JSON.
       *
       * The function is invoked in a separate thread using the task library.
       *
       * The name of function to invoke is resolved to using the
       * ``library.common.resolve`` function, so it may include a string argument,
       * separated by a ``@`` character.
       * 
       * For example, the following code snippet invokes the function ``module.test.foo``
       * with a JavaScript object equivalent to ``{a:1, b:2}`` as argument:
       *
       * {{{
       *
       * library.lang.invokeAsyncJSON("module.test.foo", {a:1, b:2});
       *
       * }}}
       *
       *
       * @param(functionName, string, required)
       * @param(arg, object, required)
       * 
       */
       this.invokeAsyncJSON = function(functionName, arg) {
           if (log.traceEnabled) {
               log.trace("lang.invokeAsync: " + functionName);
           }
           if (!library.lang.isString(functionName)) {
               if (log.errorEnabled) {
                   log.error("lang.invokeAsync: argument must be a string");
               }
               throw new Error("argument must be a string: " + functionName);
           }

           var data = {fn: functionName, arg: arg};
           var newFunctionName = "@" + library.json.serialize(data);
           library.task.submitScriptTask('/framework/task/invokeAsync.js', newFunctionName);
       }

});
