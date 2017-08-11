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
 * View library module.
 */

library.common.define(library, "view", function() {

    var log = library.log.get("framework.view");
    
    /**
     * Render a view (i.e. a script, usually with a ".ejs" extension).
     *
     * @param(obj, string or object, required)
     *   either a view name as a string or an object to be used for keyword arguments
     * @kparam(view, string, required)
     *   the name of the view to render
     * @kparam(layout, string, optional)
     *   the name of the layout to use; by default, no layout is used
     * @kparam(contentType, string, optional)
     *   response content type, defaults to text/html
     * @kparam(statusCode, number, optional)
     *   response HTTP status code, defaults to 200
     * @kparam(headers, object, optional)
     *   each property name/value becomes an additional HTTP header
     * @return(undefined)
     */
    this.render = function (obj) {
        log.trace("view.render");
        var name, layoutName, contentType, statusCode, headers;
        if (library.lang.isString(obj)) {
            name = obj;
        }
        else if (library.lang.isObject(obj)) {
            name = obj.view;
            layoutName = obj.layout;
            contentType = obj.contentType;
            statusCode = obj.statusCode;
            headers = obj.headers;
        }
        if (name == undefined) {
            if (log.errorEnabled) {
                log.error("view.render: no view name specified");
            }
            throw new Error("no view name specified");
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.view);
        if (actualName) {
            if (contentType == undefined) {
                contentType = "text/html";
            }
            if (statusCode == undefined) {
                statusCode = 200;
            }
            response.setStatus(statusCode);
            response.setContentType(contentType);
            if (headers != undefined) {
                for (var i in headers) {
                    response.setHeader(i, headers[i]);
                }
            }
            
            if (layoutName != undefined) {
                var layoutActualName = new String(layoutName);
                layoutActualName = library.common.findFirst(layoutActualName, application.path.view);
                if (layoutActualName) {
                    context.setWriter(response.getWriter());
                    invocation.layoutContent = actualName;
                    if (log.debugEnabled) {
                        log.debug("view.render: rendering layout:" + layoutActualName);
                    }
                    library.scripting.run(layoutActualName);
                    context.getWriter().flush();
                }
                else {
                    if (log.errorEnabled) {
                        log.error("view.render: layout not found: " + layoutName);
                    }
                    throw new Error("layout not found: " + layoutName);
                }            
            }
            else {
                // just render the view
                context.setWriter(response.getWriter());
                if (log.debugEnabled) {
                    log.debug("view.render: rendering view:" + actualName);
                }
                library.scripting.run(actualName);
                context.getWriter().flush();
            }
        }
        else {
            if (log.errorEnabled) {
                log.error("view.render: view not found: " + name);
            }
            throw new Error("view not found: " + name);
        }
    }

    /**
     * Silently render a view (i.e. a script, usually with a ".ejs" extension).
     * Unlike the [[render|#render]] function, this function uses the writer currently
     * set on the script context, not the one associated with the HTTP response
     * object. Moreover, it does not use set any properties of the HTTP response
     * itself, like the status code or content type. Thus, an application can use
     * this function to capture the output of a view and post-process it, e.g. by
     * substituting a StringWriter for the default script context writer, all without
     * incurring any side-effects on the HTTP response. As a convenience for the user,
     * the writer to use can be specified using a keyword argument, as described below.
     *
     * @param(obj, string or object, required)
     *   either a view name as a string or an object to be used for keyword arguments
     * @kparam(view, string, required)
     *   the name of the view to render
     * @kparam(layout, string, optional)
     *   the name of the layout to use; by default, no layout is used
     * @kparam(writer, java.io.PrintWriter, optional)
     *   writer to write to, defaults to ``context.writer``
     * @return(undefined)
     */
    this.silentRender = function (obj) {
        log.trace("view.silentRender");
        var name, layoutName, writer;
        if (library.lang.isString(obj)) {
            name = obj;
        }
        else if (library.lang.isObject(obj)) {
            name = obj.view;
            layoutName = obj.layout;
            writer = obj.writer;
        }
        if (name == undefined) {
            if (log.errorEnabled) {
                log.error("view.silentRender: no view name specified");
            }
            throw new Error("no view name specified");
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.view);
        if (actualName) {            
            if (layoutName != undefined) {
                var layoutActualName = new String(layoutName);
                layoutActualName = library.common.findFirst(layoutActualName, application.path.view);
                if (layoutActualName) {
                    invocation.layoutContent = actualName;
                    if (log.debugEnabled) {
                        log.debug("view.silentRender: rendering layout:" + layoutActualName);
                    }
                    var oldWriter;
                    try {
                        if (writer != undefined) {
                            oldWriter = context.getWriter();
                            context.setWriter(writer);
                        }
                        library.scripting.run(layoutActualName);
                        context.getWriter().flush();
                    }
                    finally {
                        if (oldWriter) {
                            context.setWriter(oldWriter);
                        }
                    }
                }
                else {
                    if (log.errorEnabled) {
                        log.error("view.silentRender: layout not found: " + layoutName);
                    }
                    throw new Error("layout not found: " + layoutName);
                }            
            }
            else {
                // just render the view
                if (log.debugEnabled) {
                    log.debug("view.silentRender: rendering view:" + actualName);
                }
                var oldWriter;
                try {
                    if (writer != undefined) {
                        oldWriter = context.getWriter();
                        context.setWriter(writer);
                    }
                    library.scripting.run(actualName);
                    context.getWriter().flush();
                }
                finally {
                    if (oldWriter) {
                        context.setWriter(oldWriter);
                    }
                }
            }
        }
        else {
            if (log.errorEnabled) {
                log.error("view.silentRender: view not found: " + name);
            }
            throw new Error("view not found: " + name);
        }
    }

    /**
     * Insert the content of the view scheduled for use with the current layout.
     * It should only be called inside a layout, but will act as a no-op anywhere
     * else. Furthermore, it will render some content only once. Any subsequent
     * invocation will not produce any output;
     *
     * @return(undefined)
     */
    this.layoutContent = function() {
        log.trace("view.layoutContent");
        if (invocation.layoutContent != undefined) {
            try {
                library.scripting.run(invocation.layoutContent);
            }
            finally {
                delete invocation.layoutContent;
            }
        }
    }
    
    /**
     * Include a subview in the view currently being rendered.
     *
     * @param(name, string, required)
     *   name of the view to include
     * @return(undefined)
     */
    this.include = function(name) {
        if (log.traceEnabled) {
            log.trace("view.include: " + name);
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.view);
        if (actualName) {
            return library.scripting.run(actualName);
        }
        else {
            throw new Error("subview not found: " + name);
        }
    }

    /**
     * Include some static content in the view currently being rendered.
     *
     * @param(name, string, required)
     *   name of the resource to include as static content
     * @return(undefined)
     */
    this.includeContent = function(name) {
        if (log.traceEnabled) {
            log.trace("view.includeContent: " + name);
        }
        var actualName = new String(name);
        actualName = library.common.findFirst(actualName, application.path.content);
        if (actualName) {
            if (log.debugEnabled) {
                log.debug("view.includeContent: including:" + actualName);
            }
            var s = library.resource.readAsString(actualName);
            context.getWriter().write(s);
        }
        else {
            throw new Error("content not found: " + name);
        }
    }

    /**
     * Generate some markup.
     *
     * Here's an example:
     *
     * {{{
     *      library.view.writeMarkup([{
     *            name: "foo",
     *            attrs: {
     *                id: "x",
     *                "class": "test",
     *                yummy: "yes",
     *            },
     *            content: [{
     *                    name: "bar",
     *                    attrs: { "class": "other" },
     *                    content: "nobody"
     *                }, {
     *                    name: "a",
     *                    attrs: { href: "http://there" },
     *                    content: "a link"
     *                }]
     *            }
     *        ]);
     * }}}
     *
     * produces
     *
     * {{{
     *   <foo id="x" class="test" yummy="yes">
     *     <bar class="other>nobody</bar>
     *     <a href="http://there">a link</a>
     *   </foo>
     *
     * }}}
     *
     * (without the prettyprinting).
     *
     * @param(obj, object, required)
     *   object describing the markup
     * @param(writer, java.io.PrintWriter, optional)
     *   writer to write to, defaults to ``context.writer``
     * @return(undefined)
     */
    this.markup = function(obj, writer) {
        log.trace("view.markup");

        function escapeAttributeValue(s) {
            return s.replace(/"/g, '&quot;');
        }
                
        if (writer == undefined) {
            writer = context.getWriter();
        }
        if (library.lang.isArray(obj)) {
            for (var i in obj) {
                arguments.callee.call(this, obj[i], writer);
            }
        }
        else if (library.lang.isObject(obj)) {
            writer.write("<");
            writer.write(obj.name);
            if (obj.attrs) {
                for (var attr in obj.attrs) {
                    writer.write(" ");
                    writer.write(attr);
                    writer.write("=\"");
                    writer.write(escapeAttributeValue(String(obj.attrs[attr])));
                    writer.write("\"");
                }
            }
            if (obj.content) {
                writer.write(">");
                if (library.lang.isString(obj.content)) {
                    writer.write(obj.content);
                }
                else {
                    arguments.callee.call(this, obj.content, writer);
                }
                writer.write("</");
                writer.write(obj.name);
                writer.write(">");
            }
            else {
                writer.write("/>");
            }
        }
    }

    /**
     * Quote a URL for use in a page.
     * Arguments are the same as for [[library.httpserver.makeUrl|library.httpserver.html#makeUrl]].
     *
     * @param(path, string, optional)
     *   a HTTP path, e.g. ``/books/page42.html``
     * @return(string)
     *   a URL to the specified path, enclosed in double quotes
     */
    this.quoteUrl= function(path) {
        log.trace("view.quoteUrl");
        return '"' + library.httpserver.makeUrl(path) + '"';
    }

    /**
     * Prolog for views used as standalone scripts (e.g. as dynamic content), rather
     * than rendered by a controller via the [[render|#render]] function.
     *
     * @kparam(contentType, string, optional)
     *   response content type, defaults to text/html
     * @kparam(statusCode, number, optional)
     *   response HTTP status code, defaults to 200
     * @kparam(characterEncoding, string, optional)
     *   character encoding, defaults to a platform-specific value
     * @kparam(headers, object, optional)
     *   each property name/value becomes an additional HTTP header
     * @param(writer, java.io.PrintWriter, optional)
     *   writer to write to, defaults to ``response.writer``
     * @return(undefined)
     */
    this.start = function (obj) {
        log.trace("view.start");
        library.httpserver.respond(obj);
        var writer = (obj != undefined && obj.writer != undefined ?
                        obj.writer :
                        response.getWriter());
        context.setWriter(writer);
    }
    
    /**
     * Epilog for views used as standalone scripts (e.g. as dynamic content), rather
     * than rendered by a controller via the library.view.render function.
     *
     * @return(undefined)
     */
    this.finish = function () {
        log.trace("view.finish");
        context.getWriter().flush();
    }

    /**
     * Run an embedded JavaScript page (.ejsp) resource.
     *
     * @param(name, string, required)
     *   resource name of the page
     * @param(type, java.lang.Class, optional)
     *   expected type of the result of running the page
     * @return(undefined)
     */
    this.runEmbeddedJavaScriptPage = function (name, type) {
        if (log.traceEnabled) {
            log.trace("view.runEmbeddedJavaScriptPage: " + name);
        }
        var source = library.resource.readAsString(name);
        
        var isStandalone = false;
        
        // TODO - expand this to handle more directives and to be more flexible
        //        in handling the <%@ %> syntax
        if (source.indexOf("<%@ standalone %>") != -1) {
            isStandalone = true;
        }
        
        try {
            if (!isStandalone) {
                library.view.start();
            }
            library.scripting.getScriptingEngine("ejs").evalScriptSource(source, name, type);
        }
        finally {
            if (!isStandalone) {
                library.view.finish();
            }
        }
    }
             
    /**
     * Markup builder class.
     *
     * Allowed keyword arguments for the constructor:
     * @kparam(writer, java.io.PrintWriter, optional)
     *   writer to use, defaults to ``context.writer``
     *
     * Here's an example of how to use it:
     *
     * {{{
     *   var b = new library.view.Builder();
     *   b.foo({id: "x", "class": "test", yummy: "yes"},
     *         function() {
     *             b.bar({"class": "other"},
     *                   "nobody");
     *             b.a({href: "http://there"},
     *                 "a link");
     *         });
     * }}}
     *
     * produces:
     *
     * {{{
     *   <foo id="x" class="test" yummy="yes">
     *     <bar class="other>nobody</bar>
     *     <a href="http://there">a link</a>
     *   </foo>
     *
     * }}}
     */
    this.Builder = function(obj) {
        log.trace("view.Builder");
        var writer;
        if (obj != undefined) {
            writer = obj.writer;
        }
        if (writer == undefined) {
            writer = context.getWriter();
        }

        var builtins = {};
        var impl = {    
            __get__: function(name) {
                if (log.traceEnabled) {
                    log.trace("view.Builder.__get__: " + name);
                }
                if (name in builtins) {
                    return builtins[name];
                }
                return function() {
                    writer.write("<");
                    writer.write(name);
                    var canWriteAttributes = true;
                    var gotContent = false;
                    for (var i = 0; i < arguments.length; ++i) {
                        var arg = arguments[i];
                        if (library.lang.isString(arg)) {
                            if (canWriteAttributes) {
                                writer.write(">");
                                canWriteAttributes = false;
                            }
                            writer.write(arg);
                            gotContent = true;
                        }
                        else if (library.lang.isFunction(arg)) {
                            if (canWriteAttributes) {
                                writer.write(">");
                                canWriteAttributes = false;
                            }
                            arg.call(this, function(s) {
                                writer.write(s);
                            });
                            gotContent = true;
                        }
                        else if (library.lang.isObject(arg)) {
                            if (canWriteAttributes) {
                                for (var attr in arg) {
                                    writer.write(" ");
                                    writer.write(attr);
                                    writer.write("=\"");
                                    writer.write(escapeAttributeValueFn(String(arg[attr])));
                                    writer.write("\"");
                                }                                
                            }
                            else {
                                throw new Error("cannot write attributes at this point");
                            }
                        }
                        else {
                            // TODO - maybe we should just coerce it to string?
                            throw new Error("invalid argument type");
                        }
                    }
                    if (gotContent) {
                        writer.write("</");
                        writer.write(name);                    
                        writer.write(">");
                    }
                    else {
                        writer.write("/>");
                    }
                }
            }
        }

        return new JSAdapter(impl);
    }

    /**
     * Escape the given string so that it can be used as an attribute value.
     *
     * @param(s, string, required)
     *   string to escape
     * @return(string)
     *   escaped string
     */
    this.escapeAttributeValue = function(s) {
        log.trace("view.escapeAttributeValue");
        return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    /**
     * Escape the given string so that it can be used as character content.
     *
     * @param(s, string, required)
     *   string to escape
     * @return(string)
     *   escaped string
     */
    this.escapeCharacterContent = function(s) {
        log.trace("view.escapeCharacterContent");
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // private
    
    var escapeAttributeValueFn = this.escapeAttributeValue;
    var escapeCharacterContentFn = this.escapeCharacterContent;
    
});
