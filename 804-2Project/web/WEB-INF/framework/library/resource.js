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
 * Resource library module.
 */
library.common.define(library, "resource", function() {
    var resourceService = globals.services.resource;
    var log = library.log.get("framework.resource");
    
    /**
     * Return the extension for a file name.
     *
     * @param(name, string, required)
     *   file name
     * @return(string)
     *   extension, the empty string if none is found
     */
    this.getExtension = function(name) {
        if (log.traceEnabled) {
            log.trace("resource.getExtension: " + name);
        }
        var i = name.lastIndexOf(".");
        if (i == -1) {
            return "";
        }
        return name.substring(i + 1);
    }
    
    /**
     * Return true if a resource of the given name exists.
     *
     * @param(name, string, required)
     *   resource name
     * @return(boolean)
     *   true if a resource with the given name exists
     */
    this.exists = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.exists: " + name);
        }
        return resourceService.isResourcePresent(name);    
    }

    /**
     * Return true if a directory of the given name exists.
     *
     * @param(name, string, required)
     *   directory name
     * @return(boolean)
     *   true if a directory with the given name exists
     */
    this.isDirectory = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.isDirectory: " + name);
        }
        return resourceService.isDirectoryPresent(name);    
    }

    /**
     * Return a new InputStream on the contents of the specified resource.
     *
     * @param(name, string, required)
     *   resource name
     * @return(java.io.InputStream)
     *   input stream on the resource
     */
    this.open = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.open: " + name);
        }
        return resourceService.getResourceAsStream(name);    
    }

    /**
     * Return the date of last modification of the specified resource.
     *
     * @param(name, string, required)
     *   resource name
     * @return(number)
     *   date of last modification of the resource
     */
    this.lastModified = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.lastModified: " + name);
        }
        return resourceService.getLastModified(name);    
    }

    /**
     * Return the size in bytes of the specified resource.
     *
     * @param(name, string, required)
     *   resource name
     * @return(number)
     *   size in bytes of the resources
     */
    this.length = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.length: " + name);
        }
        return resourceService.getLength(name);    
    }

    /**
     * Return a java.io.InputStream on the specified resource.
     *
     * @param(name, string, required)
     *   resource name
     * @return(java.io.InputStream)
     *   input stream on the resource
     */
    this.getResourceAsStream = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.getResourceAsStream: " + name);
        }
        return resourceService.getResourceAsStream(name);    
    }

    /**
     * Return the first resource with the specified name in the
     * given path (an array of strings).
     *
     * @param(name, string, required)
     *   resource name
     * @param(path, array of strings, required)
     *   path to search for the resource
     * @return(string)
     *   full name of the found resource, undefined if none was found
     */
    this.findFirst = function(name, path) {
        if (log.traceEnabled) {
            log.trace("resource.findFirst: " + name);
        }
        return library.common.findFirst(name, path);
    }
        
    /**
     * Return the contents of the specified resource as a string.
     *
     * @param(name, string, required)
     *   resource name
     * @param(encoding, string, optional)
     *   encoding to use, defaults to UTF-8
     * @return(string)
     *   resource contents
     */
    this.readAsString = function (name, encoding) {
        if (log.traceEnabled) {
            log.trace("resource.readAsString: " + name + " " + encoding);
        }
        if (encoding == undefined) {
            encoding = "utf-8";
        }
        var globals = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext();
        var reader = new java.io.InputStreamReader(resourceService.getResourceAsStream(name), encoding);
        var builder = new java.lang.StringBuilder();
        var buffer = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE, 4096);
        while(true) {
            var len = reader.read(buffer, 0, 4096);
            if (len == -1) {
                break;
            }
            builder.append(buffer, 0, len);
        }
        reader.close();
        return String(builder.toString());
    }

    /**
     * Return an array containing the names of all children of the given resource.
     *
     * @param(name, string, required)
     *   resource name
     * @return(array of strings)
     *   names of all the children, empty if the specified resource is not a directory
     */
    this.children = function (name) {
        if (log.traceEnabled) {
            log.trace("resource.children: " + name);
        }
        return library.lang.toArray(resourceService.getChildren(name));
    }

    /**
     * Return an output stream on the specified resource.
     *
     *
     * @param(obj, string or object, required)
     *   either a resource name or an object to be used for keyword arguments
     * @kparam(name, string, required)
     *   resource name
     * @kparam(create, boolean, optional)
     *   if true, the resource is created if it doesn't exist
     * @kparam(append, boolean, optional)
     *   if true, the resource is opened in append mode if it exists
     * @return(java.io.OutputStream)
     *   stream that can be used to write to the resource
     *
     */
    this.getOutputStream = function (obj) {
        if (log.traceEnabled) {
            log.trace("resource.getOutputStream: " + (obj && obj.name ? name : ""));
        }
        var name, create, append;
        if (library.lang.isString(obj)) {
            name = obj;
        }
        else if (library.lang.isObject(obj)) {
            name = obj.name;
            create = obj.create;
            append = obj.append;
        }
        else {
            if (log.errorEnabled) {
                log.error("resource.getOutputStream: invalid argument type");
            }
            throw new Error("invalid argument type");
        }
        if (name == undefined) {
            if (log.errorEnabled) {
                log.error("resource.getOutputStream: missing resource name");
            }
            throw new Error("missing resource name");
        }
        if (create == undefined) {
            create = false;
        }
        if (append == undefined) {
            append = false;
        }
        return resourceService.getOutputStream(name, create, append);
    }

});
