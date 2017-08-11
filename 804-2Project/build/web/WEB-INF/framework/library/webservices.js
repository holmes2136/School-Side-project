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
 * webservices.js
 */
 

library.common.define(library, "webservices", function() {
    
    /**
      Initialization
     */
    var log = library.log.get("framework.webservices");
  
    //load the js source for a WebServices library that does
    //not depend on Phobos
    var initString = 
        Packages.com.sun.script.webservices.ServiceManager.getInitString();
    
    //eval the js library in this interpreter.
    eval("" + initString);
    
    //create an instance of the js WebServiceManager class in the library.
    var serviceManager = new WebServiceManager();

    //look for WebService Clients that have been added to 
    // application.options by the application programmer
    var serviceNames = application.options.webservices.serviceClasses;
    for (var s = 0; s < serviceNames.length; s++) {
                serviceManager.addService(serviceNames[s]);
    }
    
    //export findService method from WebServiceManager
    this.find = serviceManager.findService;
    
    
});
    
    
    
    
