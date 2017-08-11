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

// Main controller

library.common.define(controller.system, "main", function() {
    this.Main = function() {
        this.index = function() {
            model = {};
            model.headers = [];
            for (var ns = request.getHeaderNames(); ns.hasMoreElements();) {
                var name = ns.nextElement();
                var value = request.getHeader(name);
                model.headers.push({name: name, value: value});
            }
            model.properties = [];
            var sortedProperties = new java.util.TreeMap(java.lang.System.getProperties());
            for (var entries = sortedProperties.entrySet().iterator(); entries.hasNext();) {
                var entry = entries.next();
                model.properties.push({name: entry.key, value: entry.value});
            }

            library.view.render({view: "system/main/frontpage.ejs",
                                 layout: "system/main/layout.ejs"});
        }
    };
});
