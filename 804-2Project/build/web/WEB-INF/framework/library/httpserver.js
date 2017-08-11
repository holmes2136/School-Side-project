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
 * HTTP server library module.
 */

library.common.define(library, "httpserver", function() {

    var log = library.log.get("framework.httpserver");
    
    /**
     * Parse the query string into a javascript object.
     *
     * @param(s, string, optional)
     *    query string to be parsed, defaults to ``request.queryString``
     * @return(object)
     *    an object with a property for each parameter
     */
    this.parseQueryString = function(s) {
        log.trace("httpserver.parseQueryString");
        if (s == undefined) {
            s = request.getQueryString();
        }
        var query = String(s);
        var pairs = query.split("&");
        var result = {};
        for(var i = 0; i < pairs.length; ++i){
            if(pairs[i].length > 0){
                var pair = pairs[i].split("=");
                result[pair[0]] = pair[1];
            }
        }
        return result;
    }
    
    /**
     * Parse the request parameters. This only works well when a parameter
     * is not repeated.
     *
     * @return(object)
     *   an object with a property for each parameter in the request
     */
    this.parseRequestParameters = function() {
        log.trace("httpserver.parseRequestParameters");
        var result = {};
        for (var params = request.getParameterNames(); params.hasMoreElements(); ) {
            var name = params.nextElement();
            var value = request.getParameter(name);
            result[name] = value;
        }
        return result;
    }

    /**
     * Send back to the client a static resource.
     *
     * WARNING: this code is superseded by the resource framework in [[library.rest|library.rest.html]].
     *
     * @param(name, string, required) resource name
     * @return(undefined)
     */
    this.sendResource = function(name) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendResource: " + name);
        }
        response.reset();
        response.setStatus(200);
        response.setContentType(library.rest.getContentType(library.resource.getExtension(name)));
        response.setContentLength(library.resource.length(name));
        response.addDateHeader("Last-Modified", library.resource.lastModified(name));
        response.addDateHeader("Expires", java.lang.System.currentTimeMillis() + application.options.content.shelfLife);
        var is = library.resource.getResourceAsStream(name);
        library.lang.using(is, function() {
            var os = response.getOutputStream();
            library.httpserver.copyStream(is, os);
            os.flush();
        });
    }

    /**
     * Send back to the client a NOT FOUND error.
     *
     * @param(name, string, optional)
     *    the name of the resource to be reported as not found; it defaults to the request URI
     * @return(undefined)
     */
    this.sendNotFound = function(name) {
        if (name == undefined) {
            name = request.getRequestURI();
        }
        if (log.debugEnabled) {
            log.debug("httpserver.sendNotFound: " + name);
        }
        response.setStatus(404);
        response.setContentType("text/html");
        var writer = response.getWriter();
        writer.println("<html><head><title>Not Found</title></head><body><h1>404 Not Found</h1><p/>");
        writer.println("The resource " + name + " was not found.");
        writer.println("</body></html>");
        writer.flush();
    }

    /**
     * Send back to the client an INTERNAL SERVER ERROR.
     *
     * @return(undefined)
     */
    this.sendInternalServerError = function() {
        log.debug("httpserver.sendInternalServerError");
        response.setStatus(500);
        response.setContentType("text/html");
        var writer = response.getWriter();
        writer.println("<html><head><title>Internal Server Error</title></head><body><h1>500 Internal Server Error</h1><p/>");
        writer.println("</body></html>");
        writer.flush();
    }

    /**
     * Send back to the client a OK code and nothing else.
     *
     * @return(undefined)
     */
    this.sendOk = function() {
        log.debug("httpserver.sendOk");
        response.setStatus(200);
        response.setContentType("text/plain");
        var writer = response.getWriter();
        writer.println("OK");
        writer.flush();
    }

    /**
     * Send back to the client a created code with the location of the 
     * new resource.
     *
     * @param(location, string, required)
     *    the location of the newly created resource
     * @return(undefined)
     */
    this.sendCreated = function(location) {
        log.debug("httpserver.sendCreated");
        response.setStatus(201);
        response.addHeader("Location", location);
        var writer = response.getWriter();
        writer.flush();
    }

    /**
     * Send back to the client a javascript object in JSON format.
     *
     * @param(obj, object, required)
     *    the object to be JSON-serialized and sent back to the client
     * @return(undefined)
     */
    this.sendJSON = function(obj) {
        log.debug("httpserver.sendJSON");
        response.setStatus(200);
        response.setContentType("text/javascript");
        var writer = response.getWriter();
        var result = library.json.serialize(obj);
        writer.write(result);
        writer.flush();
    }

    // helper function
    function send3XXWithLocation(code, location) {
        if (log.traceEnabled) {
            log.trace("httpserver.send3XXWithLocation: " + code + " " + location);
        }
        response.setStatus(code);
        response.addHeader("Location", location);
        response.setContentType("text/plain");
        var writer = response.getWriter();
        writer.flush();
    }
    
    /**
     * Send back to the client a permanent redirect to the specified location.
     *
     * @param(location, string, required)
     *    the location to redirect to
     * @return(undefined)
     */
    this.sendPermanentRedirect = function(location) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendPermanentRedirect: " + location);
        }
        send3XXWithLocation(301, location);
    }

    /**
     * Send back to the client a found redirect to the specified location.
     *
     * @param(location, string, required)
     *    the location to redirect to
     * @return(undefined)
     */
    this.sendFound = function(location) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendFound: " + location);
        }
        send3XXWithLocation(302, location);
    }

    /**
     * Send back to the client a see other redirect to the specified location.
     *
     * @param(location, string, required)
     *    the location to redirect to
     * @return(undefined)
     */
    this.sendSeeOther = function(location) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendSeeOther: " + location);
        }
        send3XXWithLocation(303, location);
    }

    /**
     * Send back to the client a temporary redirect to the specified location.
     *
     * @param(location, string, required)
     *    the location to redirect to
     * @return(undefined)
     */
    this.sendRedirect = function(location) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendRedirect: " + location);
        }
        send3XXWithLocation(307, location);
    }

    /**
     * Send back to the client a "Method not allowed" error (405).
     *
     * @param(methods, string, required)
     *   a list of allowed methods used as the value of the ``Allow`` HTTP header
     * @return(undefined)
     */
    this.sendMethodNotAllowed = function(methods) {
        if (log.debugEnabled) {
            log.debug("httpserver.sendMethodNotAllowed: " + methods);
        }
        response.setStatus(405);
        response.addHeader("Allow", methods);
        response.setContentType("text/plain");
        var writer = response.getWriter();
        writer.println("Method not allowed");
        writer.flush();
    }

    /**
     * Send back to the client a precondition failed error (412).
     *
     * @return(undefined)
     */
    this.sendPreconditionFailed = function() {
        log.debug("httpserver.sendPreconditionFailed");
        response.setStatus(412);
        response.setContentType("text/plain");
        var writer = response.getWriter();
        writer.println("Precondition failed");
        writer.flush();
    }
    
    /**
     * Copy an input stream onto an output stream.
     *
     * @param(is, java.io.InputStream, required)
     *   input stream to copy from
     * @param(os, java.io.OutputStream, required)
     *   output stream to copy to     
     * @return(undefined)
     */
     this.copyStream = function(is, os) {
        log.trace("httpserver.copyStream");
        var is = new java.io.BufferedInputStream(is);
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4096);
        while(true) {
            var len = is.read(buffer);
            if (len == -1) {
                break;
            }
            os.write(buffer, 0, len);
        }
        os.flush();
        is.close();
    }     

    /**
     * Copy a reader to a writer.
     *
     * @param(reader, java.io.Reader, required)
     *   reader to copy from
     * @param(writer, java.io.Writer, required)
     *   writer to copy to     
     * @return(undefined)
     */
     this.copyReaderWriter = function(reader, writer) {
        log.trace("httpserver.copyReaderWriter");
        var br = new java.io.BufferedReader(reader);
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE, 4096);
        while(true) {
            var len = br.read(buffer);
            if (len == -1) {
                break;
            }
            writer.write(buffer, 0, len);
        }
        writer.flush();
        br.close();
    }     
    
    /**
     * Read an input stream and returns a byte array with its contents.
     *
     * @param(is, java.io.InputStream, required)
     *   input stream to read from
     * @return(byte[])
     *   the contents of the input stream as a byte array
     */
     this.streamToByteArray = function(is) {
        log.trace("httpserver.streamToByteArray");
        var bos = new java.io.ByteArrayOutputStream();
        library.httpserver.copyStream(is, bos);
        return bos.toByteArray();
    }     

    /**
     * Read a string from a reader.
     * @param(reader, java.io.Reader, required)
     *   reader to read from
     * @return(string)
     *   the contents of the reader as a string
     */
     this.readerToString = function(reader) {
        log.trace("httpserver.readerToString");
        var w = new java.io.StringWriter();
        library.httpserver.copyReaderWriter(reader, w);
        return w.toString();
    }
     
    /**
     * Read an input stream and return a string with its contents, using the specified encoding.
     *
     * @param(is, java.io.InputStream, required)
     *   input stream to read from
     * @param(encoding, string, required)
     *   the encoding to use
     * @return(string)
     *   the contents of the input stream as a string
     */
     this.streamToString = function(is, encoding) {
        log.trace("httpserver.streamToString");         
        var r = new java.io.InputStreamReader(is, encoding);
        var w = new java.io.StringWriter();
        library.httpserver.copyReaderWriter(r, w);
        return w.toString();
    }

    
    /**
     * Parse a HTTP date string. Returns -1 if the date is invalid, a number otherwise.
     *
     * @param(s, string, required)
     *   a HTTP date string
     * @return(number)
     *   a date in numeric form
     */
    this.parseHTTPDate = function(s) {
        return Packages.com.sun.phobos.container.util.FastHttpDateFormat.parseDate(s, null);
    }

    /**
     * Return the current date in HTTP format.
     *
     * @return(string)
     *   the current date in HTTP format
     */
    this.getCurrentHTTPDate = function() {
        return Packages.com.sun.phobos.container.simple.FastHttpDateFormat.getCurrentDate();
    }

    /**
     * Convert a date in numeric format to HTTP format.
     *
     * @param(d, number, optional)
     *   a date in numeric format; it defaults to the current date
     *
     * @return(string)
     *   the desidered date in HTTP format
     */
    this.getHTTPDate = function(d) {
        return (d == undefined ?
                    Packages.com.sun.phobos.container.simple.FastHttpDateFormat.getCurrentDate() :
                    Packages.com.sun.phobos.container.simple.FastHttpDateFormat.formatDate(d, null));
    }
            
    /**
     * Invoke the function of the given object whose name
     * is the specified method.
     *
     * If no function matches, try one called "any", otherwise
     * send back to the client a NOT FOUND error.
     *
     * @param(obj, object, required)
     *   the object to invoke a method on
     * @param(method, string, optional)
     *   the method name as a string; it defaults to ``request.method``
     * @return(undefined)
     */
    this.onMethod = function(obj, method) {
        if (log.traceEnabled) {
            log.trace("httpserver.onMethod: method: " + method);
        }
        if (method == undefined) {
            method = request.getMethod();
        }
        if (library.lang.isFunction(obj[method])) {
            obj[method].call(obj);
        }
        else if (library.lang.isFunction(obj.any)) {
            obj.any();
        }
        else {
            this.sendNotFound();
        }
    }

    // cache the base url while processing one particular request
    var baseUrl;
    
    /**
     * Return a url whose protocol, server and port components
     * are taken from the current request and the path is the
     * specified string.
     *
     * @param(path, string, optional)
     *   a HTTP path, e.g. ``/books/page42.html``
     * @return(string)
     *   a URL to the specified path
     */
     this.makeUrl = function(path) {
        if (log.traceEnabled) {
            log.trace("httpserver.makeUrl: " + path);
        }
        if (baseUrl == undefined) {
            var protocol = invocation.request.getScheme();
            if (protocol == null) {
                protocol = "http";
            }
            var server = application.options.httpserver.name || invocation.request.getServerName();
            var port = application.options.httpserver.port || invocation.request.getServerPort();
            if (library.lang.isNumber(port)) {
                port = port.toFixed(0);
            }
            if ((protocol == "http" && port == 80) ||
                (protocol == "https" && port == 443)) {
                port = undefined;
            }
            var sb = new java.lang.StringBuilder();
            sb.append(protocol);
            sb.append("://");
            sb.append(server);
            if (port != undefined) {
                sb.append(":");
                sb.append(port);
            }
            if (invocation.prefix != undefined) {
                sb.append(invocation.prefix);
            }
            baseUrl = String(sb.toString());
        }
        if (path != undefined) {
            if (path.charAt(0) != "/") {
                path = "/" + path;
            }
            return baseUrl + path;
        }
        else {
            return baseUrl + "/";
        }
     }

    /**
     * Set response information, using some reasonable defaults.
     *
     * Unless the ``text`` keyword argument is present, this function
     * won't access either the output stream or the writer for the response,
     * and it's going to be the user's responsibility to do that.
     *
     * @kparam(statusCode, number, optional)
     *     status code, defaults to 200
     * @kparam(characterEncoding, string, optional)
     *     character encoding
     * @kparam(contentLength, number, optional)
     *     content length
     * @kparam(contentType, string, optional)
     *     content type, defaults to text/html
     * @kparam(locale, java.util.Locale, optional)
     *     locale
     * @kparam(headers, object, optional)
     *     an object whose property name/value pairs will be used as HTTP headers
     * @kparam(text, string, optional)
     *     the response text; if present, then this function will retrieve the
     *     response writer, write the text to it and flush the writer
     * @return(undefined)
     */
    this.respond = function(obj) {
        log.trace("httpserver.respond");

        if (obj == undefined) {
            obj = {};
        }

        response.reset();
        response.status = (obj.statusCode != undefined ? obj.statusCode : 200);
        response.contentType = (obj.contentType != undefined ? obj.contentType : "text/html");
        if (obj.contentLength != undefined) {
            response.contentLength = obj.contentLength;
        }
        if (obj.characterEncoding != undefined) {
            response.characterEncoding = obj.characterEncoding;
        }
        if (obj.locale != undefined) {
            response.locale = obj.locale;
        }
        if (obj.headers) {
            for (var i in headers) {
                response.setHeader(i, headers[i]);
            }
        }
        if (library.lang.isString(obj.text)) {
            var writer = response.getWriter();
            writer.write(obj.text);
            writer.flush();
        }
    }
    
    /**
     * Execute a function intercepting all calls to the response object.
     *
     * Returns the captured response object, which can then be modified
     * and ultimately played back on the real response by calling
     * the playbackOn function.
     *
     * Here's an example:
     *
     * {{{
     *
     *    var myResponse = library.httpserver.captureResponse(function() {
     *                          ...
     *                     });
     *    // ... modify myResponse here ...
     *    
     *    myResponse.playbackOn(response);
     *
     * }}}
     *
     * The contents of the response entity for a captured response
     * can be accessed using the ``text`` property.
     *
     * Currently, this only works when the output is textual. If
     * the code inside the function tries to call ``response.getOutputStream``,
     * an exception is thrown.
     *
     * @param(fn, function, required)
     * 
     */
    this.captureResponse = function(fn) {
        log.trace("httpserver.captureResponse");
        
        try {
            var oldResponse = response;
            var newResponse = new CapturedResponse();
            response = newResponse;
            fn();
        }
        finally {
            response = oldResponse;
            newResponse.close();
        }
        
        return newResponse;        
    }
    
    /*
     * Constructor for captured response objects.
     */
    function CapturedResponse() {
        this.reset();
    }
    
    CapturedResponse.prototype.setStatus = function(i) {
        this.status = i;
    }
    
    CapturedResponse.prototype.setContentType = function(s) {
        this.contentType = s;
    }
    
    CapturedResponse.prototype.setContentLength = function(i) {
        this.contentLength = i;
    }

    CapturedResponse.prototype.setCharacterEncoding = function(s) {
        this.characterEncoding = s;
    }

    CapturedResponse.prototype.setLocale = function(loc) {
        this.locale = loc;
    }

    CapturedResponse.prototype.getWriter = function() {
        return this.writer;
    }
    
    CapturedResponse.prototype.addHeader = function(n, v) {
    }
    
    CapturedResponse.prototype.getOutputStream = function() {
        throw new Error("not implemented");
    }
    
    CapturedResponse.prototype.addCookie = function(c) {
        this.__cookies__.push(c);
    }

    CapturedResponse.prototype.__emptyHeaderList__ = function(n) {
        list = [];
        this.__headers__[n] = list;
        return list;
    }
    
    CapturedResponse.prototype.__getHeaderList__ = function(n) {
        var list = this.__headers__[n];
        if (list == undefined) {
            list = this.__emptyHeaderList__(n);
        }
        return list;
    }
    
    CapturedResponse.prototype.addHeader = function(n, v) {
        this.__headers.__getHeaderList__(name).push({name: n, value: v, type: "string"});
    }

    CapturedResponse.prototype.addDateHeader = function(n, v) {
        this.__headers.__getHeaderList__(name).push({name: n, value: v, type: "date"});
    }

    CapturedResponse.prototype.addIntHeader = function(n, v) {
        this.__headers.__getHeaderList__(name).push({name: n, value: v, type: "int"});
    }
    
    CapturedResponse.prototype.setHeader = function(n,v) {
        this.__emptyHeaderList__(n);
        this.addHeader(n, v);
    }

    CapturedResponse.prototype.setDateHeader = function(n,v) {
        this.__emptyHeaderList__(n);
        this.addDateHeader(n, v);
    }

    CapturedResponse.prototype.setIntHeader = function(n,v) {
        this.__emptyHeaderList__(n);
        this.addIntHeader(n, v);
    }

    CapturedResponse.prototype.containsHeader = function(n) {
        var list = this.__headers__[n];
        return (list != undefined && list.length > 0);
    }

    CapturedResponse.prototype.flushBuffer = function() {
    }
    
    CapturedResponse.prototype.getBufferSize = function() {
        return this.bufferSize;
    }
    
    CapturedResponse.prototype.setBufferSize = function(i) {
        throw new Error("not implemented");
    }
    
    CapturedResponse.prototype.resetBuffer = function() {
        throw new Error("not implemented");
    }

    CapturedResponse.prototype.isCommitted = function() {
        return this.committed;
    }
    
    CapturedResponse.prototype.reset = function() {
        this.text = undefined;
        this.__writer__ = new java.io.StringWriter();
        this.writer = new java.io.PrintWriter(this.__writer__);
        
        this.status = 200;
        this.contentType = "text/plain";
        this.contentLength = -1;
        this.characterEncoding = "ISO-8859-1";
        this.locale = java.util.Locale.getDefault();
        this.bufferSize = 0;
        this.committed = false;

        this.__headers__ = {};
        this.__cookies__ = [];
        
        this.__error__ = undefined;
        this.__redirect__ = undefined;
    }
    
    CapturedResponse.prototype.sendError = function(code) {
        this.__error__ = code;
    }

    CapturedResponse.prototype.sendRedirect = function(s) {
        this.__redirect__ = s;
    }
    

    CapturedResponse.prototype.close = function() {
        this.__writer__.flush();
        this.text = this.__writer__.toString();
    }
        
    /*
     * Plays back a captured response on a (most likely real)
     * response object.
     */
    CapturedResponse.prototype.playbackOn = function(r) {
        if (this.__error__ != undefined) {
            r.sendError(this.__error__);
        }
        else if (this.__redirect__ != undefined) {
            r.sendRedirect(this.__redirect__);
        }
        else {
            r.setStatus(this.status);
        }
        r.setContentType(this.contentType);
        r.setContentLength(this.contentLength);

        if (this.characterEncoding != "ISO-8859-1") {
            r.setCharacterEncoding(this.characterEncoding);
        }
        r.setLocale(this.locale);
        for (var n in this.__headers__) {
            var vs = this.__headers__[n];
            for (var i = 0; i < vs.length; ++i) {
                var headerInfo = vs[i];
                if (headerInfo.type == "string") {
                    r.addHeader(headerInfo.name, headerInfo.value);
                }
                else if (headerInfo.type == "int") {
                    r.addIntHeader(headerInfo.name, headerInfo.value);
                }
                else if (headerInfo.type == "date") {
                    r.addDateHeader(headerInfo.name, headerInfo.value);
                }
            }
        }
        for (var i = 0; i < this.__cookies__.length; ++i) {
            r.addCookie(this.__cookies__[i]);
        }
        
        if (this.text == undefined) {
            this.text = "";
        }
        
        var w = r.writer;
        w.print(this.text);
        w.flush();
    }
    
    // static fields of javax.servlet.http.HttpServletResponse
    CapturedResponse.prototype.SC_CONTINUE = 100;
    CapturedResponse.prototype.SC_SWITCHING_PROTOCOLS = 101;
    CapturedResponse.prototype.SC_OK = 200;
    CapturedResponse.prototype.SC_CREATED = 201;
    CapturedResponse.prototype.SC_ACCEPTED = 202;
    CapturedResponse.prototype.SC_NON_AUTHORITATIVE_INFORMATION = 203;
    CapturedResponse.prototype.SC_NO_CONTENT = 204;
    CapturedResponse.prototype.SC_RESET_CONTENT = 205;
    CapturedResponse.prototype.SC_PARTIAL_CONTENT = 206;
    CapturedResponse.prototype.SC_MULTIPLE_CHOICES = 300;
    CapturedResponse.prototype.SC_MOVED_PERMANENTLY = 301;
    CapturedResponse.prototype.SC_MOVED_TEMPORARILY = 302;
    CapturedResponse.prototype.SC_FOUND = 302;
    CapturedResponse.prototype.SC_SEE_OTHER = 303;
    CapturedResponse.prototype.SC_NOT_MODIFIED = 304;
    CapturedResponse.prototype.SC_USE_PROXY = 305;
    CapturedResponse.prototype.SC_TEMPORARY_REDIRECT = 307;
    CapturedResponse.prototype.SC_BAD_REQUEST = 400;
    CapturedResponse.prototype.SC_UNAUTHORIZED = 401;
    CapturedResponse.prototype.SC_PAYMENT_REQUIRED = 402;
    CapturedResponse.prototype.SC_FORBIDDEN = 403;
    CapturedResponse.prototype.SC_NOT_FOUND = 404;
    CapturedResponse.prototype.SC_METHOD_NOT_ALLOWED = 405;
    CapturedResponse.prototype.SC_NOT_ACCEPTABLE = 406;
    CapturedResponse.prototype.SC_PROXY_AUTHENTICATION_REQUIRED = 407;
    CapturedResponse.prototype.SC_REQUEST_TIMEOUT = 408;
    CapturedResponse.prototype.SC_CONFLICT = 409;
    CapturedResponse.prototype.SC_GONE = 410;
    CapturedResponse.prototype.SC_LENGTH_REQUIRED = 411;
    CapturedResponse.prototype.SC_PRECONDITION_FAILED = 412;
    CapturedResponse.prototype.SC_REQUEST_ENTITY_TOO_LARGE = 413;
    CapturedResponse.prototype.SC_REQUEST_URI_TOO_LONG = 414;
    CapturedResponse.prototype.SC_UNSUPPORTED_MEDIA_TYPE = 415;
    CapturedResponse.prototype.SC_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    CapturedResponse.prototype.SC_EXPECTATION_FAILED = 417;
    CapturedResponse.prototype.SC_INTERNAL_SERVER_ERROR = 500;
    CapturedResponse.prototype.SC_NOT_IMPLEMENTED = 501;
    CapturedResponse.prototype.SC_BAD_GATEWAY = 502;
    CapturedResponse.prototype.SC_SERVICE_UNAVAILABLE = 503;
    CapturedResponse.prototype.SC_GATEWAY_TIMEOUT = 504;
    CapturedResponse.prototype.SC_HTTP_VERSION_NOT_SUPPORTED = 505;    
    
    /**
     * Create a new session id.
     */
    function createNewSessionId() {
        var baos = new java.io.ByteArrayOutputStream();
        var ps = new java.io.PrintStream(baos);
        ps.print(String(java.lang.System.currentTimeMillis()));
        ps.print(String(globals.seed));
        var id = baos.toByteArray();
        var md = java.security.MessageDigest.getInstance("MD5");
        var digest = md.digest(id);
        var sb = new java.lang.StringBuilder();
        for (var i in digest) {
            sb.append(java.lang.Integer.toHexString(0xff & digest[i]));
        }
        return sb.toString();
    }
    
    /**
     * Check that the request has a valid session cookie or create
     * a new session and set the corresponding cookie in the response.
     *
     * @return(undefined)
     */
    this.establishSession = function() {
        log.trace("httpserver.establishSession");
        var cookies = request.cookies;
        var cookie = undefined;
        if (cookies != null) {
            for (var i in cookies) {
                if (cookies[i].name == application.options.session.cookieName) {
                    cookie = cookies[i];
                    break;
                }
            }
        }
        var sessionid;
        var session;
        if (cookie != undefined) {
            sessionid = cookie.value;
            session = application.sessionStore[sessionid];
            if (session == undefined || (session.get("__sessionid__") == null)) {
                // not a valid session id
                sessionid = undefined;
            }
            else {
                // check that the session has not become invalid
                var isInvalid = session.get("__invalid__");
                if (isInvalid == "true") {
                    sessionid = undefined;
                }
                else {
                    // extend session lifespan
                   var sessionOptions = application.options.session;
                    if (application.options.duration >= 0) {
                        var currentTime = java.lang.System.currentTimeMillis();
                        var expirationTime = currentTime + (sessionOptions.duration * 1000);
                        session.put("__expirationTime__", expirationTime);                        
                    }
                }
            }
        }
        if (sessionid == undefined) {
            sessionid = createNewSessionId();
            session = new Packages.com.sun.phobos.container.StringOnlyConcurrentHashMap();
            session.put("__sessionid__", sessionid);
            session.put("id", sessionid); // for application use            
            var currentTime = java.lang.System.currentTimeMillis();
            session.put("__creationTime__", currentTime);
            application.sessionStore[sessionid] = session;

            var sessionOptions = application.options.session;
            cookie = new cookieClass(sessionOptions.cookieName,
                                     sessionid);
            cookie.path = sessionOptions.path;
            cookie.maxAge = sessionOptions.maxAge;
            var expirationTime = currentTime + (sessionOptions.duration * 1000);
            session.put("__expirationTime__", expirationTime);
            response.addCookie(cookie);
        }
        
        // flash constructor
        function Flash() {
            this.__has__ = function(name) {
                return session.containsKey(name);
            }
            this.__get__ = function(name) {
                return session.get(name);
            }
            this.__put__ = function(name, value) {
                this.flashedNames += name;
                this.flashedNames += "\t";
                session.put(name, value);
            }
            this.__delete__ = function(name) {
                session.remove(name);
            }

            this.__postProcess__ = function() {
                var names = this.previouslyFlashedNames.split("\t");
                var seen = {};
                for (var i in names) {
                    var name = names[i];
                    if (name == "" || name in seen) {
                        continue;
                    }
                    session.remove(name);
                    seen[name] = true;
                }
                session.put("__flashed__", this.flashedNames);
            }
            
            this.previouslyFlashedNames = session.get("__flashed__");
            if (this.previouslyFlashedNames == null) {
                this.previouslyFlashedNames = "";
            }
            this.flashedNames = "";
        }
        
        // define some new invocation-scoped properties
        invocation.session = library.common.automap(session);
        invocation.__flash__ = new Flash();
        invocation.flash = new JSAdapter(invocation.__flash__);
    }

    /**
     * Perform session-related clean up tasks.
     *
     * @return(undefined)
     */
    this.wrapUpSession = function() {
        log.trace("httpserver.wrapUpSession");
        if (invocation.__flash__) {
            invocation.__flash__.__postProcess__();
        }
    }
        
    // platform-specific code
    var cookieClass,  // cookie class to use
        enableCache;  // function use to tag a resource as cacheable or not
    
    library.lang.dispatch(globals.platform, {
        standalone: function() {
            cookieClass = Packages.com.sun.phobos.container.grizzly.impl.util.Cookie;
            enableCache = function(response, flag) {
                              response.enableCache(flag);
                          }
            },
        glassfish: function() {
            cookieClass = Packages.com.sun.phobos.container.grizzly.impl.util.Cookie;
            enableCache = function() {}
        },
        webapp: function() {
            cookieClass = Packages.javax.servlet.http.Cookie;
            enableCache = function() {}
        },
        simple: function() {
            cookieClass = Packages.com.sun.phobos.container.util.Cookie;
            enableCache = function() {}
        },
        mock: function() {
            cookieClass = Packages.com.sun.phobos.container.util.Cookie;
            enableCache = function() {}
        }
    });
});
