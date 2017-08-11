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
 * HTTP client library module.
 */

library.common.define(library, "httpclient", function() {
    var log = library.log.get("framework.httpclient");

    var proxy = application.options.httpProxy != undefined ?
                    new java.net.Proxy(java.net.Proxy.Type.HTTP,
                        new java.net.InetSocketAddress(application.options.httpProxy.name,
                                                       application.options.httpProxy.port)) :
                    java.net.Proxy.NO_PROXY;
    
    /**
     * Return the resource at the given URL.
     *
     * @param(obj, string or object, required)
     *    if a string, it is assumed to be a URL, otherwise it is used for keyword arguments
     * @kparam(url, string, required)
     *     a URL to the resource to be accessed
     * @kparam(headers, object, optional)
     *     an object whose properties will be mapped to HTTP headers
     * @kreturn(code, number, required)
     *     HTTP response code
     * @kreturn(alive, boolean, required)
     *     true if the connection was successfully established
     * @kreturn(close, function, required)
     *     a function that can be used to close the connection to the resource after use
     * @kreturn(data, java.io.InputStream, optional)
     *     if the resource was successfully retrieved, an input stream on its contents
     * @kreturn(lastModified, number, optional)
     *     if the resource was successfully retrieved, its date of last modification
     */
    this.fetch = function(obj) {
        log.trace("httpclient.fetch");
        // TODO - add keyword arguments, handle more status codes, response headers
        var url, requestHeaders;
        if (library.lang.isString(obj)) {
            url = obj;
        }
        else if (library.lang.isObject(obj)) {
            url = obj.url;
            requestHeaders = obj.headers;
        }
        else {
            if (log.errorEnabled) {
                log.error("httpclient.fetch: invalid argument type");
            }
            throw new Error("invalid argument type");
        }
        var connection = new java.net.URL(url).openConnection(proxy);
        if (requestHeaders != undefined) {
            for (var i in requestHeaders) {
                connection.addRequestProperty(i, requestHeaders[i]);
            }
        }
        var rc = connection.responseCode;

        if (rc == 200) {
            return {
                connection: connection,
                data: connection.inputStream,
                lastModified: connection.lastModified,
                code: connection.responseCode,
                alive: true,
                close: function() {
                    connection.disconnect();
                }
            };
        }
        else {
            connection.disconnect();
            return {
                code: connection.responseCode,
                alive: false,
                close: function() {}
            }
        }        
    }

    /**
     * Base64 encode the given string.
     *
     * @param(str, string, required)
     *    the string to be Base64-encoded
     * @return(string)
     *    the encoded string
     */
    this.base64encode = function(str) {
        return String(Packages.com.sun.phobos.container.Base64Util.encode(new java.lang.String(str).bytes));
    }

    /**
     * Return the URL for the actual resource starting at the given URL and
     * following redirects.
     *
     * @param(url, string, required)
     *   the URL to follow
     * @return(string)
     *   the new location for the resource
     */
    this.follow = function(url) {
        if (log.traceEnabled) {
            log.trace("httpclient.follow: " + url);
        }
        var connection = new java.net.URL(url).openConnection(proxy);
        connection.setInstanceFollowRedirects(false);
        connection.setRequestMethod("HEAD");
        var rc = connection.responseCode;
        if ((rc / 100).toFixed(0) == 3) {
            var location = connection.getHeaderField("Location");
            if (location) {
                return String(location);
            }
        }
        connection.disconnect();
        return url;
    }
    
});
