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
 * Common library functions.
 *
 * The functions defined in this library are used to set up the
 * library system itself. For bootstrapping purposes, their
 * definitions are in the {{/framework/common.js}} file and the
 * {{/framework/library/common.js}} file exists only to provide
 * a place to list the documentation of the exported functions.
 */
library.common.define(library, "common", function() {
    
   /**
     * Find the first file with the given name in the specified
     * path (a list of directory names). Names that are already
     * absolute are returned as-is, provided there is a resource
     * with a matching name.
     *
     * @param(name, string, required) file name to resolve
     * @param(path, array, required) list of directory names
     * @return(string) resolved file name
     */
    function findFirst(name, path) {}

    /**
     * Resolve an expression like {{foo.bar.baz}} starting from the
     * base object and navigating down the objects. If the base
     * argument is missing, use the global scriptable as the
     * starting point.
     *
     * Thus, ``resolve("a.b.c")`` is equivalent to evaluating ``a.b.c``
     * in a global context, but no exceptions will be thrown if ``a``
     * does not exist.
     *
     * If the expression contains a ``@`` sign, it is split in two parts:
     * ``fn@arg``. Then if the first part (``fn``) resolves to a function f,
     * the result of resolve is a function which, when invoked, will call f
     * with the string ``arg`` as its first argument.
     *
     * For example, assume that ``module.myFn`` names a function f. Then
     * ``resolve("module.myFn")`` will return f, whereas ``resolve("module.myFn@abc")``
     * will return a function which, when invoked, will call f with ``"abc"`` as an argument.
     *
     * @param(expr, string, required) expression to resolve
     * @param(base, object, optional) object to start the resolution from,
     *   if missing use the global scriptable instead
     * @return(object or undefined) resolved object, if found
     */
    function resolve(expr, base) {}

    /**
     * Define a new namespace.
     *
     * @param(container, object, required) parent namespace
     * @param(name, string, required) name of the namespace to create
     * @param(fn, function, required) namespace definition
     * @return(undefined)
     */
    function define(container, name, fn) {}
    
    /**
     * Run low-level handlers for a given event.
     *
     * @param(name, string, required) event name
     * @return(undefined)
     */
     function runLowLevelHandlersFor(name) {}

    /**
     * Return a Javascript object which autoloads properties
     * by looking for scripts of the same name in the given path.
     *
     * @param(path, array, required) path to autoload from
     * @return(object) dynamic object with autoload functionality
     */
    function autoload(path) {}

    /**
     * Return a Javascript object which is a proxy for the
     * given Java map.
     *
     * @param(javamap, java.util.Map, required) Java map object to be proxied
     * @return(object) proxy to the specified map
     */
    function automap(javamap) {}

    /**
     * Return a Javascript object which is a proxy for a
     * new concurrent Java map.
     *
     * @return(object) proxy to a new concurrent map
     */
    function createConcurrentAutomap() {}

    // exports
    this.findFirst = findFirst;
    this.resolve = resolve;
    this.define = define;
    this.autoload = autoload;
    this.automap = automap;
    this.createConcurrentAutomap = createConcurrentAutomap;
    this.runLowLevelHandlersFor = runLowLevelHandlersFor;
});
