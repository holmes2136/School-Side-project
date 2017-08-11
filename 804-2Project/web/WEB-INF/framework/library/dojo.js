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
 * Dojo library module.
 *
 */

library.common.define(library, "dojo", function() {
    var log = library.log.get("framework.dojo");

    /**
     * Load the Dojo Toolkit on the server.
     *
     *  @kparam(version, string, optional)
     *      either a version number as expressed
     *      in jMaki, e.g. ".4.1", in which case that version of Dojo is loaded
     *      from the jMaki library tree, or a path starting with a slash character,
     *      which causes the Dojo libraries to be loaded from the specified location.
     *      If this argument is missing or undefined, this function uses the value of
     *      the application.options.dojo.preferred variable as a default, if present,
     *      otherwise it uses the first Dojo version listed in the jMaki config.json file.
     *
     */
    function load(version) {
        if (log.traceEnabled) {
            log.trace("dojo.load: " + version);
        }
        
        if (version == undefined) {
            if (application.options.dojo.preferred) {
                version = application.options.dojo.preferred;
            }
            else {
                var config = library.jmaki.readConfiguration();
                if (config != undefined && config.types != undefined) {
                    for (var i = 0; i < config.types.length; ++i) {
                        var type = config.types[i];
                        if (type.id == "dojo") {
                            version = type.version;
                            break;
                        }
                    }
                }
            }
            
            if (version == undefined) {
                log.error("dojo.load: failed to find a default dojo installation");
                throw new Error("failed to find a default dojo installation");
            }
        }

        var path;
        if (version[0] == "/") {
            path = version;
        }   
        else {
            path = "/static/" + application.options.jmaki.prefix + "/libs/dojo/version" + version;
        }

        if (library.resource.exists(path + "/src/bootstrap1.js")) {
            // Dojo 0.4 (or earlier) branch
            library.scripting.run(path + "/src/bootstrap1.js");
            library.scripting.run(path + "/src/loader.js");
            library.scripting.run(path + "/src/hostenv_rhino.js");
            dojo.hostenv.libraryScriptUri = path + "/";
            library.scripting.run("/framework/helper/hostenv_phobos.js");
            library.scripting.maybeRun(path + "/src/bootstrap2.js");        
        }
        else if (library.resource.exists(path + "/dojo/_base/_loader/bootstrap.js")) {
            // Dojo 0.9 branch
            if (typeof(dojo) == "undefined") {
                djConfig = {baseUri: path + "/"};
                library.scripting.run(path + "/dojo/_base/_loader/bootstrap.js");
                library.scripting.run(path + "/dojo/_base/_loader/loader.js");
                library.scripting.run(path + "/dojo/_base/_loader/hostenv_rhino.js");
                djConfig.libraryScriptUri = path + "/dojo/";
                library.scripting.run("/framework/helper/hostenv_phobos_09.js");
                library.scripting.run(path + "/dojo/_base/lang.js");
                library.scripting.run(path + "/dojo/_base/declare.js");
                library.scripting.run(path + "/dojo/_base/connect.js");
                library.scripting.run(path + "/dojo/_base/Deferred.js");
                library.scripting.run(path + "/dojo/_base/json.js");
                library.scripting.run(path + "/dojo/_base/array.js");
                library.scripting.run(path + "/dojo/_base.js");
            }
        }
        else {
            log.error("dojo.load: missing or corrupted dojo installation (" + path + ")");
            throw new Error("missing or corrupted dojo installation (" + path + ")");
        }
        

    }

    // module exports
    this.load = load;
});
