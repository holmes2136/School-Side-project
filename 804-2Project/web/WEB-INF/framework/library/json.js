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
 * JSON library module.
 *
 * This code was adapted from Dojo (dojo.json module).
 * For simplicity, removed the ability to register a serializer function.
 */

library.common.define(library, "json", function() {

    var log = library.log.get("framework.json");
    
    /**
     * Deserialize a javascript object from a JSON-encoded string.
     *
     * @param(s, string, required)
     *   JSON string to deserialize
     * @return(object)
     *   the decoded object
     */
    this.deserialize = function(s) {
        log.trace("json.deserialize");
        
        // TODO - do some validation of the argument
        return eval("(" + s + ")");
    }
    
    /**
     * Serialize a javascript object into JSON format.
     *
     * @param(o, object, optional)
     *   object to serialize, defaults to ``undefined``
     * @return(string)
     *   the JSON representation of the object
     */
    this.serialize = function(o) {
        log.trace("json.serialize");
    
        var reprString = function(str){ 
            return ('"' + str.replace(/(["\\])/g, '\\$1') + '"'
                ).replace(/[\f]/g, "\\f"
                ).replace(/[\b]/g, "\\b"
                ).replace(/[\n]/g, "\\n"
                ).replace(/[\t]/g, "\\t"
                ).replace(/[\r]/g, "\\r");
        };
        
        var objtype = typeof(o);
        if(objtype == "undefined") {
            return "undefined";
        } else if((objtype == "number")||(objtype == "boolean")){
            return o + "";
        } else if(o === null) {
            return "null";
        }
        if(objtype == "string") {
            return reprString(o);
        }
        // recurse
        var me = arguments.callee;
        // short-circuit for objects that support "json" serialization
        // if they return "self" then just pass-through...
        var newObj;
        if(typeof(o.__json__) == "function") {
            newObj = o.__json__();
            if(o !== newObj){
                return me(newObj);
            }
        }
        if(typeof(o.json) == "function") {
            newObj = o.json();
            if (o !== newObj) {
                return me(newObj);
            }
        }
        // array
        if(objtype != "function" && typeof(o.length) == "number") {
            var res = [];
            for(var i = 0; i < o.length; i++) {
                var val = me(o[i]);
                if(typeof(val) != "string") {
                    val = "undefined";
                }
                res.push(val);
            }
            return "[" + res.join(",") + "]";
        }
        // java object
        if (library.lang.isJavaObject(o)) {
            return reprString(String(o));
        }
        // generic object code path
        res = [];
        for (var k in o){
            var useKey;
            if (typeof(k) == "number"){
                useKey = '"' + k + '"';
            } else if (typeof(k) == "string") {
                useKey = reprString(k);
            } else {
                // skip non-string or number keys
                continue;
            }
            val = me(o[k]);
            if(typeof(val) != "string") {
                // skip non-serializable values
                continue;
            }
            res.push(useKey + ":" + val);
        }
        return "{" + res.join(",") + "}";
    }
});
