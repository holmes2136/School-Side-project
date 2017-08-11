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
 * Copyright 2007 Sun Microsystems, Inc. All rights reserved.
 */

/*
 * Background script to invoke a function asynchronously.
 */

(function() {
    var lw = Packages.com.sun.phobos.container.PhobosRuntime.currentAdapter.logWriter;

    argument = String(argument);
    var fnName, arg;
    if (argument && argument.charAt(0) == "@") {
        var data = library.json.deserialize(argument.substring(1));
        fnName = data.fn;
        arg = data.arg;
    }
    else {
        fnName = argument;
    }
    if (fnName) {
        var fn = library.common.resolve(fnName);
        if (typeof(fn) == "function") {
            if (arg) {
                fn.call(this, arg);
            }
            else {
                fn.call(this);
            }
        }
    }
})();
