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
 * REST library module.
 */

library.common.define(library, "rest", function() {

    var log = library.log.get("framework.rest");
    
    /**
     * Base class for entities.
     */
    var Entity = library.lang.createClass(library.lang.ContractMixin);
    
    with(Entity) {

        /**
         * Return the entity content type.
         *
         * @return(string)
         *    content type
         */
        prototype.getType = function() {
            this.subclassResponsibility();
        }
                
        /**
         * Return the last modification date.
         *
         * @return(number)
         *    last modified
         */
        prototype.getLastModified = function() {
            this.subclassResponsibility();
        }

        /**
         * Return the length of the entity.
         *
         * @return(number)
         *    entity length
         */
        prototype.getLength = function() {
            this.subclassResponsibility();
        }

        /**
         * Return a stream on the entity.
         *
         * @return(java.io.InputStream)
         *    entity contents
         */
        prototype.getEntityAsStream = function() {
            this.subclassResponsibility();
        }

        /**
         * Return a byte array with the entity contents.
         *
         * @return(byte[])
         *    entity contents
         */        
        prototype.getEntityAsByteArray = function() {
            log.trace("rest.Entity.getEntityAsByteArray");
            return library.httpserver.streamToByteArray(this.getEntityAsStream());
        }

        /**
         * Return a string with the entity contents, using the specified encoding.
         *
         * @param(encoding, string, required)
         *    encoding to use
         * @return(string)
         *    entity contents
         */
        prototype.getEntityAsText = function(encoding) {
            log.trace("rest.Entity.getEntityAsText");
            if (encoding == undefined) {
                if (log.errorEnabled) {
                    log.error("rest.Entity.getEntityAsText: missing required argument: encoding");
                }
                throw new Error("missing required argument: encoding");
            }
            return library.httpserver.streamToString(this.getEntityAsStream(), encoding);
        }
                    
        /**
         * Return an ETag for the entity. If missing, one is constructed
         * from the last modified date.
         *
         * @return(string)
         *    ETag
         */
        prototype.getETag = function() {
            log.trace("rest.Entity.getETag");
            if (this.__cachedETag__ == undefined) {
                var s = '"' + String(this.getLastModified()) + '"';
                this.__cachedETag__ = s;
            }
            return this.__cachedETag__;
        }

        /**
         * Return any extension headers.
         *
         * @return(object)
         *    Either undefined or an object. Each property name
         *    becomes a header. If a property value is an array, one header
         *    is written out for each value in the array, otherwise the
         *    property value is written out as a string.
         */
        prototype.getExtensionHeaders = function() {
            log.trace("rest.Entity.getExtensionHeaders");
            return undefined;
        }
        
        /**
         * Return an entity equivalent to the receiver but whose data are cached
         * so that getEntityStream can be called multiple times.
         *
         * @return(library.rest.Entity)
         *   a repeatable entity
         */
        prototype.createRepeatableEntity = function() {
            log.trace("rest.Entity.createRepeatableEntity");
            var ba;
            return new ConcreteEntity({
                type: this.getType(),
                length: this.getLength(),
                lastModified: this.getLastModified(),
                extensionHeaders: this.getExtensionHeaders(),
                streamFactory: function() {
                    if (ba == undefined) {
                        ba = this.getEntityAsByteArray();
                    }
                    return new java.io.ByteArrayInputStream(ba);
                }
            });
        }
                
    }

    /**
     * Concrete entity created from some data residing on the server.
     *
     * @kparam(type, string, optional)
     *    the entity content type, optional when ``text`` is present
     * @kparam(charset, string, optional)
     *    the character set; if specified, it becomes part of the content type
     * @kparam(text, string, optional)
     *    a string that becomes the entity content; if no type is specified defaults to text/plain; 
     *    if no charset is specified, it defaults to utf-8
     * @kparam(data, byte[], optional)
     *    a byte array with the content data
     * @kparam(stream, java.io.InputStream, optional)
     *    an input stream on the content data
     * @kparam(streamFactory, function, optional)
     *    a function returning an input stream on the content data
     * @kparam(length, number, optional)
     *   the content length (for streams only)
     * @kparam(lastModified, number, optional)
     *   last modified data, defaults to current date/time
     * @kparam(extensionHeaders, object, optional)
     *   additional headers, as per the [[Entity.getExtensionHeaders|#Entity$getExtensionHeaders]] method
     *
     */
    var ConcreteEntity = library.lang.createClass(Entity);
    
    with(ConcreteEntity) {

        prototype.initialize = function(obj) {
            log.trace("rest.ConcreteEntity.initialize");
            if (obj == undefined || !library.lang.isObject(obj)) {
                if (log.errorEnabled) {
                    log.error("rest.ConcreteEntity.initialize: missing constructor argument");
                }
                throw new Error("missing constructor argument");
            }
            var charsetSpecifiedByType = undefined;
            if (obj.type != undefined) {
                var m = obj.type.match(/charset=((\w|-)+)/);
                if (m != null) {
                    charsetSpecifiedByType = m[1];
                }
            }
            if (obj.charset == undefined && charsetSpecifiedByType != undefined) {
                    obj.charset = charsetSpecifiedByType;
            }
            if (obj.charset != undefined && obj.type != undefined && charsetSpecifiedByType != undefined) {
                obj.type += "; charset=" + obj.charset;
            }
            if (obj.text != undefined) {
                if (obj.charset == undefined) {
                    obj.charset = "utf-8";
                }
                if (obj.type == undefined) {
                    obj.type = "text/plain; charset=" + obj.charset;
                }
                var ba = new java.lang.String(obj.text).getBytes(obj.charset);
                obj.length = ba.length;
                obj.streamFactory = function() {
                    return new java.io.ByteArrayInputStream(ba);
                }
            }
            else if (obj.data != undefined) {
                if (obj.type == undefined) {
                    obj.type = "application/octet-stream";
                }
                var ba = obj.data;
                obj.length = ba.length;
                obj.streamFactory = function() {
                    return new java.io.ByteArrayInputStream(ba);
                }                
            }
            else if (obj.stream == undefined && obj.streamFactory == undefined) {
                if (log.errorEnabled) {
                    log.error("rest.ConcreteEntity.initialize: no data specified");
                }
                throw new Error("no data specified");
            }
            if (obj.length == undefined) {
                obj.length = -1;
            }
            if (obj.lastModified == undefined) {
                obj.lastModified = java.lang.System.currentTimeMillis();
            }
            this.obj = obj;
        }

        prototype.getType = function() {
            log.trace("rest.Entity.getType");
            return this.obj.type;
        }
    
        prototype.getLength = function() {
            log.trace("rest.Entity.getLength");
            return this.obj.length;
        }
        
        prototype.getLastModified = function() {
            log.trace("rest.Entity.getLastModified");
            return this.obj.lastModified;
        }

        prototype.getEntityAsStream = function() {
            log.trace("rest.Entity.getEntityAsStream");
            if (this.obj.streamFactory != undefined) {
                return this.obj.streamFactory();
            }
            if (this.obj.stream != undefined) {
                return this.obj.stream;
            }
            if (log.errorEnabled) {
                log.error("rest.ConcreteEntity.getEntityAsStream: no stream associated with this entity");
            }
            throw new Error("no stream associated with this entity");
        }

        prototype.getExtensionHeaders = function() {
            log.trace("rest.Entity.getExtensionHeaders");
            return this.obj.extensionHeaders;
        }
        
    }
    
    /**
     * HTTP response info as a single object.
     */
    var HTTPResponse = library.lang.createClass();
    with(HTTPResponse) {
        prototype.initialize = function(obj) {
            log.trace("rest.HTTPResponse.initialize");
            if (obj != undefined && library.lang.isObject(obj)) {
                if (obj.code != undefined) {
                    this.code = obj.code;
                }
                if (obj.entity != undefined) {
                    this.entity = obj.entity;
                }
                else {
                    if (obj.text != undefined) {
                        this.entity = new ConcreteEntity({text: obj.text});
                    }
                    else if (obj.data != undefined) {
                        this.entity = new ConcreteEntity({data: obj.data});
                    }
                }
                if (obj.headers != undefined) {
                    this.headers = obj.headers;
                }
                if (obj.includeBody != undefined) {
                    this.includeBody = obj.includeBody;
                }
                else {
                    this.includeBody = (this.entity != undefined);
                }
            }
        }
        prototype.code = "200";
        prototype.includeBody = false;
    }

    /**
     * Base class for resources.
     */
    var AbstractResource = library.lang.createClass(library.lang.ContractMixin);
    
    with(AbstractResource) {
        
        /**
         * Return the default entity for the resource.
         *
         * @return(Entity)
         *   default entity
         */
        prototype.getDefaultEntity = function() {
            this.subclassResponsibility();
        }
        
        /**
         * Return the allowed HTTP methods.
         *
         * @return(string)
         *   allowed HTTP methods
         */
        prototype.getAllowedMethods = function() {
            log.trace("rest.AbstractResource.getAllowedMethods");
            return this.allowedMethods;
        }
        
        /**
         * Static list of allowed methods.
         *
         * Keys are HTTP method names, values are method names to be looked up
         * in the resource class.
         */
        prototype.allowedMethods = {GET: "GET", HEAD: "HEAD"};
        
        /**
         * Return a entity matching the given request.
         * A result of undefined means that the entity was not found.
         * To send back a specific response circumventing the normal method
         * processing code, call the [[raiseResponse|#AbstractResource$raiseResponse]] method.
         *
         * @return(Entity)
         *   an entity matching the current request
         */
        prototype.getEntity = function() {
            log.trace("rest.AbstractResource.getDefaultEntity");
            return this.getDefaultEntity();
        }

        /**
         * Handle an HTTP request.
         *
         * Implementation uses the global request/response objects.
         */
        prototype.handleRequest = function() {
            log.trace("rest.AbstractResource.handleRequest");
            try {
                var method = request.getMethod();
                var methodSelector = this.getAllowedMethods()[method];
                if (!methodSelector) {
                    return this.sendMethodNotAllowed();
                }
                if (!this.authorizeRequest()) {
                    this.send(new HTTPResponse({code: 401, text: "Unauthorized"}));
                }
                if (log.debugEnabled) {
                    log.debug("rest.AbstractResource.handleRequest: dispatching: " + methodSelector);
                }
                return library.lang.invokeMethodOrFunction(this, methodSelector, function() {
                    if (!response.isCommitted()) {
                        response.reset();
                    }
                    this.sendInternalServerError();
                });
            }
            catch (e) {
                if (!response.isCommitted()) {
                    response.reset();
                }
                if (e instanceof HTTPResponse) {
                    this.send(e, true);
                }
                else {
                    if (log.infoEnabled) {
                        log.info("rest.AbstractResource.handleRequest: error handling request: " + e.message);
                    }
                    this.sendInternalServerError();                
                }
            }
        }

        /**
         * Handle a GET request.
         */         
        prototype.GET = function() {
            log.trace("rest.AbstractResource.GET");
            return this.GETorHEAD(true);
        }
        
        /**
         * Handle a HEAD request.
         */         
        prototype.HEAD = function() {
            log.trace("rest.AbstractResource.HEAD");
            return this.GETorHEAD(false);
        }

        /**
         * Common code for GET/HEAD requests.
         *
         * @param(isGET, boolean, required)
         *   true if the request is a HTTP GET
         */                        
        prototype.GETorHEAD = function(isGET) {
            log.trace("rest.AbstractResource.GETorHEAD");
            var httpResponse;
            
            try {            
                var entity = this.getEntity();
                if (entity == undefined) {
                    var header = request.getHeader("If-Match");
                    if (header == "*") {
                        httpResponse = new HTTPResponse({code: 412, text: "Precondition failed"});
                    }
                    else {
                        httpResponse = new HTTPResponse({code: 404, text: "Not found"});
                    }
                }
                else if (!this.authorizeEntity(entity)) {
                    httpResponse = new HTTPResponse({code: 401, text: "Unauthorized"});
                }
                else {
                    this.handleConditionalHeaders(entity);
                                        
                    // TODO - partial GETs
                    
                    // regular GET code
                    if (httpResponse == undefined) {
                        var headers = {"Last-Modified": entity.getLastModified(),
                                       ETag: entity.getETag()
                        };            
                        var extensionHeaders = entity.getExtensionHeaders();
                        if (library.lang.isObject(extensionHeaders) &&
                            extensionHeaders.Expires == undefined) {
                            headers.Expires = java.lang.System.currentTimeMillis() + application.options.content.shelfLife;
                        }
                        httpResponse = new HTTPResponse({code: 200, entity: entity, headers: headers, includeBody: isGET});                
                    }
                }
            }
            catch (e) {
                if (e instanceof HTTPResponse) {
                    httpResponse = e;
                }
                else {
                    if (log.infoEnabled) {
                        log.info("rest.AbstractResource.GETorHEAD: error handling request: " + e.message);
                    }
                    var exceptionMsg = e.description;
                    if (e.description == null) {
                        exceptionMsg = e.message;
                    }
                    if (exceptionMsg.indexOf("org.apache.derby.client.am.DisconnectException") != -1) {
                        library.log.get("application").error("Problem encountered when connecting to the database. Please ensure that the database is up and running. If you are using Netbeans you could use Tools->Java DB Database to start the database.");            
                        return false;
                    } else {
                        throw(e);
                    }
                }
            }
            this.send(httpResponse);
        }
        
        /**
         * Send back a "Method not allowed" error.
         *
         * @return(undefined)
         */
        prototype.sendMethodNotAllowed = function() {
            log.trace("rest.AbstractResource.sendMethodNotAllowed");
            if (this.__cachedMethodNotAllowedString__ == undefined) {
                var s = "";
                var first = true;
                for (var m in this.getAllowedMethods()) {
                    if (first) {
                        first = false;
                    }
                    else {
                        s += ", ";
                    }
                    s += m;
                }
                this.__cachedMethodNotAllowedString__ = s;
            }
            // library.httpserver.sendMethodNotAllowed(this.__cachedMethodNotAllowedString__);
            this.send(new HTTPResponse({
                code: 405, text: "Method not allowed", headers: {Allow: this.__cachedMethodNotAllowedString__}
            }));
        }
        
        /**
         * Send back an "Internal Server Error" error.
         *
         * @return(undefined)
         */
        prototype.sendInternalServerError = function() {
            log.trace("rest.AbstractResource.sendInternalServerError");
            this.send(new HTTPResponse({code: 500, text: "Internal server error"}));
        }
        
        /**
         * Send back an HTTP response to the client.
         *
         * @param(httpResponse, HTTPResponse, required)
         *   HTTP response object
         * @param(ignoreIfCommitted, boolean, optional)
         *   if true, the specified response will be ignored (= not sent back) if one was already committed
         * @return(undefined)
         */
        prototype.send = function(httpResponse, ignoreIfCommitted) {
            if (log.traceEnabled) {
                log.trace("rest.AbstractResource.send: " + (httpResponse && httpResponse.code ? httpResponse.code : ""));
            }
            var self = this;
            
            if (response.isCommitted()) {
                if (ignoreIfCommitted) {
                    return;
                }
                if (log.errorEnabled) {
                    log.error("rest.AbstractResource.send: cannot send response");
                }
                throw new Error("cannot send response");
            }
            response.reset();

            function processHeaders(headers) {
                if (library.lang.isObject(headers)) {
                    for (var name in headers) {
                        var value = headers[name];
                        if (library.lang.isArray(value)) {
                            for (var i = 0; i < value.length; ++i) { 
                                if (name in self.dateHeaders) {
                                    response.addDateHeader(name, String(value[i]));
                                }
                                else {                           
                                    response.addHeader(name, String(value[i]));
                                }
                            }
                        }
                        else if (value != undefined) {
                            if (name in self.dateHeaders) {
                                response.addDateHeader(name, String(value));
                            }
                            else {
                                response.addHeader(name, String(value));
                            }
                        }
                    }
                }
            }

            var entity = httpResponse.entity;
            response.setStatus(httpResponse.code);
            if (entity) {
                response.setContentType(entity.getType());
                if (entity.getLength() != -1 ) {
                    response.setContentLength(entity.getLength());
                }
                processHeaders(entity.getExtensionHeaders());
            }
            
            processHeaders(httpResponse.headers);
            
            if (entity && !entity.includeBody) {
                var os = response.getOutputStream();
                var is = entity.getEntityAsStream();
                library.lang.using(is, function() {
                    library.httpserver.copyStream(is, os);
                });
                os.flush();
            }
        }

        /**
         * Raise and send back to the client the given HTTP response object,
         * shortcircuting any other request handling logic.
         *
         * @param(httpResponse, HTTPResponse, required)
         *   HTTP response object
         * @return(none)
         *    this function does not return normally
         */
        prototype.raiseResponse = function(httpResponse) {
            log.trace("rest.AbstractResource.raiseResponse");
            throw httpResponse;
        }
            
        /**
         * Headers whose type is "date".
         */
        prototype.dateHeaders = {
            "Last-Modified": true,
            "Expires": true
        }                

        /**
         * Handle the conditional HTTP headers (If-Modified-Since, If-Unmodified-Since, )
         * using the specified entity to check modification timestamps and etags.
         * If the precondition require certain responses to be sent back, e.g. 304 or 412,
         * they are sent back directly via the raiseResponse method. If this method returns
         * normally, then all preconditions are satisfied and the request can be processed
         * as if these headers were not present.
         *
         * @param(entity, Entity, required)
         */
        prototype.handleConditionalHeaders = function(entity) {            
            log.trace("rest.AbstractResource.handleConditionalHeaders");
            var header = request.getHeader("If-Modified-Since");
            if (header) {
                var date = library.httpserver.parseHTTPDate(header);
                if (date != -1 && entity.getLastModified() <= date) {
                        var headers = { ETag: entity.getETag() };
                        this.raiseResponse(new HTTPResponse({code: 304, text: "Not modified", headers: headers}));
                }
            }
            var header = request.getHeader("If-Unmodified-Since");
            if (header) {
                var date = library.httpserver.parseHTTPDate(header);
                if (date != -1 && entity.getLastModified() >= date) {
                    var headers = { ETag: entity.getETag() };
                    this.raiseResponse(new HTTPResponse({code: 412, text: "Precondition failed", headers: headers}));
                }
            }
            var etag = entity.getETag();
            var header = request.getHeader("If-Match");
            if (header && header != "*" && header.indexOf(etag) == -1) {
                    this.raiseResponse(new HTTPResponse({code: 412, text: "Precondition failed"}));                    
            }
            var header = request.getHeader("If-None-Match");
            if (header) {
                if (header == "*" || header.indexOf(etag) != -1) {
                    var method = request.getMethod();
                    if (method == "GET" || method == "HEAD") {
                        var headers = {"Last-Modified": entity.getLastModified(),
                                       ETag: etag
                        };            
                        var extensionHeaders = entity.getExtensionHeaders();
                        if (library.lang.isObject(extensionHeaders) &&
                            extensionHeaders.Expires == undefined) {
                            headers.Expires = java.lang.System.currentTimeMillis() + application.options.content.shelfLife;
                        }
                        this.raiseResponse(new HTTPResponse({code: 304, entity: entity, headers: headers, includeBody: false}));
                    }
                    else {
                        this.raiseResponse(new HTTPResponse({code: 412, text: "Precondition failed"}));                    
                    }
                }
            }
        }
        
        /**
         * Is the client authorized to submit the current request?
         *
         * @return(boolean)
         *   true if the client is authorized
         */
        prototype.authorizeRequest = function() {
            log.trace("rest.AbstractResource.authorizeRequest");
            return true;
        }

        /**
         * Is the client authorized to retrieve the specified entity?
         *
         * @param(entity, Entity, required);
         *   entity to check authorization for
         * @return(boolean)
         *   true if the client is authorized
         */
        prototype.authorizeEntity = function(entity) {
            log.trace("rest.AbstractResource.authorizeEntity");
            return true;
        }

        /**
         * Read a request entity and create an entity object from it.
         *
         * @return(Entity)
         *   entity object parsed from the current HTTP request
         */
        prototype.getRequestEntity = function() {
            log.trace("rest.AbstractResource.getRequestEntity");
            var args = {};
            args.type = request.getContentType();
            args.length = request.getContentLength();
            args.stream = request.getInputStream();
            args.extensionHeaders = {};
            return new ConcreteEntity(args);
        }

    }
    
    /**
     * A static resource. It only supports GET/HEAD operations.
     */
    var StaticResource = library.lang.createClass(AbstractResource);

    with(StaticResource) {
        
        // static resource entity
        prototype.entity = new library.lang.createClass(Entity);
        
        with (prototype.entity) {
            
            prototype.initialize = function(resourceName) {
                log.trace("rest.StaticResource.entity.initialize");
                this.resourceName = resourceName;
                this.resourceType = getContentType(getExtension(this.resourceName));
            }
            
            prototype.getType = function() {
                log.trace("rest.StaticResource.entity.getType");
                return this.resourceType;
            }
            
            prototype.getLastModified = function() {
                log.trace("rest.StaticResource.entity.getLastModified");
                return library.resource.lastModified(this.resourceName);
            }
            
            prototype.getLength = function() {
                log.trace("rest.StaticResource.entity.getLength");
                return library.resource.length(this.resourceName);
            }
            
            prototype.getEntityAsStream = function() {
                log.trace("rest.StaticResource.entity.getEntityAsStream");
                return library.resource.getResourceAsStream(this.resourceName);
            }
    
        }

        prototype.initialize = function(resourceName) {
            log.trace("rest.StaticResource.initialize");
            this.resourceName = resourceName;
        }
        
        prototype.getDefaultEntity = function() {
            log.trace("rest.StaticResource.getDefaultEntity");
            if (this.defaultEntity == undefined) {
                this.defaultEntity = new this.entity(this.resourceName);
            }
            return this.defaultEntity;
        }
    }

    
    /**
     * An updatable resource. It supports HEAD/GET/PUT/DELETE operations.
     */
    var UpdatableResource = library.lang.createClass(AbstractResource);

    with(UpdatableResource) {
         prototype.allowedMethods = {GET: "GET", HEAD: "HEAD", PUT: "PUT", DELETE: "DELETE"};

        /**
         * Handle a PUT request.
         */         
        prototype.PUT = function() {
            this.subclassResponsibility();
        }
        
        /**
         * Handle a DELETE request.
         */         
        prototype.DELETE = function() {
            this.subclassResponsibility();
        }

    }

    // ----------------------------------------
        
    var extContentTypeMap = {
        "css": "text/css",
        "gif": "image/gif",
        "htm": "text/html",
        "html": "text/html",
        "jpg": "image/jpeg",
        "js": "text/javascript",
        "pdf": "application/pdf",
        "png": "image/png",
        "ps": "application/postscript",
        "rtf": "application/rtf",
        "tiff": "image/tiff",
        "txt": "text/plain",
        "xml": "text/xml",
        "zip": "application/zip"
    };
    
    /**
     * Return the content type for a file extension.
     *
     * @param(ext, string, required)
     *   an extension, e.g."html"
     * @return(string)
     *   HTTP content type
     */
    function getContentType(ext) {
        log.trace("rest.getContentType");
        var ct = extContentTypeMap[ext];
        if (ct == undefined) {
            ct = "text/plain"
        }
        return ct;        
    }
    
    /**
     * Return the extension for a file name.
     *
     * @param(name, string, required)
     *   a file name
     * @return(string)
     *   extension, the empty string if none is found
     */
    function getExtension(name) {
        log.trace("rest.getExtension");
        var i = name.lastIndexOf(".");
        if (i == -1) {
            return "";
        }
        return name.substring(i + 1);
    }

    /**
     * Create a new UUID.
     *
     * @return(string)
     *   a freshly created UUID
     */
    function createUUID() {
        log.trace("rest.createUUID");
        return java.util.UUID.randomUUID().toString().toUpperCase();
    }
    
    /**
     * Parse a content type string.
     *
     * @param(s, string, required)
     * @kresult(mediaType, string, required)
     *   the media type, e.g. application/xml
     * @kresult(charset, string, optional)
     *   the charset, if any, e.g. utf-8
     */
    function parseContentType(s) {
        log.trace("rest.parseContentType");
        var result = {};
        var i = s.indexOf(';');
        if (i == -1) {
            result.mediaType = s;
        }
        else {
            result.mediaType = s.substring(0, i);
            s = s.substring(i + 1);
            var m = s.match(/charset=((\w|-)+)/);
            if (m != null) {
                result.charset = m[1];
            }
        }
        return result;
    }

    // export some classes/functions
    this.Entity = Entity;
    this.ConcreteEntity = ConcreteEntity;
    this.HTTPResponse = HTTPResponse;
    this.AbstractResource = AbstractResource;
    this.StaticResource = StaticResource;
    this.UpdatableResource = UpdatableResource;
    this.getContentType = getContentType;
    this.getExtension = getExtension;
    this.createUUID = createUUID;
    this.parseContentType = parseContentType;
});
