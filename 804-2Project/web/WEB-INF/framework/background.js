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
 * Background script. This script is used to run any background scripts.
 * It needs to set up an environment similar to that set up by the
 * service script, so that application code won't have to know the
 * difference. (Of course, background scripts don't have access to
 * request and response objects.)
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

    argument = invocation.backgroundScriptArgument;
    
    library.scripting.run(invocation.backgroundScriptName);
    
})();
