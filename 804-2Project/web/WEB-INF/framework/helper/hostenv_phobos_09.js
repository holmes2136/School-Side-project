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
 * Phobos host environment - it overrides some of the properties set by hostenv_rhino.js
 *
 * This version only works with the Dojo 0.9 branch.
 */

dojo._name = 'phobos';
dojo._phobos_log = library.log.get("dojo");

console.debug = function(line) { dojo._phobos_log.debug(line); }

dojo.locale = dojo.locale || java.util.Locale.getDefault().toString().replace('_','-').toLowerCase();

// see comments in spidermonkey loadUri
dojo._loadUri = function(uri, cb) {
    try {
        if (dojo._phobos_log.debugEnabled) {
            dojo._phobos_log.debug("loading " + djConfig.libraryScriptUri + uri);
        }
        var script = djConfig.libraryScriptUri + uri;
        library.scripting.run(script);
        return true;
    }
    catch (e){
        dojo.error("phobos load('" + uri + "') failed. Exception: " + e);
        return false;
    }
}

dojo.exit = function(exitcode){ 
    // no-op
}

// mock document object
function MockDocument() {}
MockDocument.prototype.getElementById = function(id) { return undefined; }
document = new MockDocument();

function setTimeout(func, delay){
    // no-op for now
}
