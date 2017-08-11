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

// Unit test controller

library.common.define(controller.system, "testing", function() {
    this.Testing = function() {
        this.index = function() {
            model = {};
            library.view.render({view: "system/testing/testing.ejs",
                                 layout: "system/main/layout.ejs"});
        }
        
        this.runAll = function() {
            
            var success = true;
            var results = library.testing.runAllTestSuites();
            for (var i = 0; i < results.length; ++i) {
                if (!results[i].succeeded) {
                    success = false;
                    break;
                }
            }
            
            model = {
                success: success,
                results: results
            };
            
            library.view.render({statusCode: success ? 200 : 500,
                                 view: "system/testing/testing.ejs",
                                 layout: "system/main/layout.ejs"});
        }
    }

});
