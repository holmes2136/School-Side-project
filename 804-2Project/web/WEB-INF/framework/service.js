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
 * Service script. It handles every HTTP request that comes into the system.
 */

/* 

  Defining a good load function isn't easy at this stage.
  The following function works, but unfortunately it produces
  poor error traces, making debugging hard. Also, eval always
  uses interpreted mode, so in some cases it may be the wrong
  choice.

  load = function(name) {
    if (services.resource.isResourcePresent(name)) {
        var source = services.staticResource.getResourceAsString(name);
        return eval(source);
    }

  Instead we use this definition which is a bit heavyweight, since it uses
  a new engine to load each script, but it works fine and results in good
  error messages.

    load = function(name) {
        if (services.resource.isResourcePresent(name)) {
            services.scripting.evalScript(name, context);
        }

 */

(function() {

    load = function(name) {
        var services = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("services");
        if (services.resource.isResourcePresent(name)) {
            services.scripting.evalScript(name, context);
        }
    }

    load('/framework/common.js');

    /*
     * Environment setup boilerplate ends here.
     */

    request = invocation.request;
    response = invocation.response;

    try {
        library.lifecycle.onService();
    }
    finally {
        /*
         * Nuke all the global variables that we defined earlier and which
         * are not really global. This will prevent any functions which
         * persist beyond an HTTP request from accessing out-of-date
         * request and response objects (unless they take special steps
         * to do so, of course).
         */
        delete request;
        delete response;
    }
})();
