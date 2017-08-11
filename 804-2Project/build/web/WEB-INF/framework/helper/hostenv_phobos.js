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

/*
 * Phobos host environment - it overrides some of the properties set by hostenv_rhino.js
 */

dojo.hostenv.__log__ = library.log.get("dojo");

dojo.hostenv.println=function(line){
	if(arguments.length > 0){
		dojo.hostenv.__log__.debug(arguments[0]);
		for(var i=1; i<arguments.length; i++){
			var valid=false;
			for (var p in arguments[i]){valid=true;break;}
			if(valid){
				dojo.debugShallow(arguments[i]);
			}
		}
	} else {
		dojo.hostenv.__log__.debug(line);
	}
}

dojo.locale = dojo.locale || java.util.Locale.getDefault().toString().replace('_','-').toLowerCase();
dojo.render.name = dojo.hostenv.name_ = 'phobos';
dojo.hostenv.getVersion = function() {return version();};

if (dj_undef("byId")) {
	dojo.byId = function(id, doc){
		if(id && (typeof id == "string" || id instanceof String)){
			if(!doc){ doc = document; }
			return doc.getElementById(id);
		}
		return id; // assume it's a node
	}
}

// see comments in spidermonkey loadUri
dojo.hostenv.loadUri = function(uri, cb) {
    try {
        if (dojo.hostenv.__log__.debugEnabled) {
            dojo.hostenv.__log__.debug("loading " + dojo.hostenv.libraryScriptUri + uri);
        }
        var script = dojo.hostenv.libraryScriptUri + uri;
        library.scripting.run(script);
        return true;
    }
    catch (e){
        dojo.error("load('" + uri + "') failed. Exception: " + e);
        return false;
    }
}

dojo.hostenv.exit = function(exitcode){ 
    // no-op
}

// mock document object
function MockDocument() {}
MockDocument.prototype.getElementById = function(id) { return undefined; }
document = new MockDocument();

function setTimeout(func, delay){
    // no-op for now
}
