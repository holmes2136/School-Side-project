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
 * Controller library module.
 */

library.common.define(library, "controller", function() {
    var log = library.log.get("framework.controller");

    /**
     * Controller base class.
     */
    var Controller = library.lang.createClass();    
    
    Controller.initializeSubclass = function(subclass) {
        log.trace("controller.initializeSubclass");
        subclass.hiddenActions = {};
        subclass.hideAction = function() {
            for (var i = 0; i < arguments.length; ++i) {
                if (library.lang.isString(arguments[i])) {
                    subclass.hiddenActions[arguments[i]] = true;
                }
            }
        }
    }
    
    with(Controller) {
        
        prototype.__onRequest__ = function(mapping) {
            log.trace("controller.__onRequest__");
            try {
                this.__beforeRequest__();
                var actionName = mapping.action;
                if (actionName != undefined && !(actionName in this.constructor.hiddenActions)) {
                    if (log.debugEnabled) {
                        log.debug("controller.__onRequest__: action: " + actionName);
                    }
                    var actionFn = this[actionName];
                    if (library.lang.isFunction(actionFn) && !(actionName in Controller.prototype)) {
                        if (log.debugEnabled) {
                            log.debug("controller.__onRequest__: invoking: " + actionName);
                        }
                        actionFn.call(this, mapping);
                    }
                    else {
                        actionFn = this.onRequest;
                        if (library.lang.isFunction(actionFn)) {
                            log.debug("controller.__onRequest__: invoking: onRequest");
                            actionFn.call(this, mapping);
                        }
                        else {
                            library.httpserver.sendNotFound();
                        }
                    }
                }
                else {
                    library.httpserver.sendNotFound();
                }
            }
            finally {
                this.__afterRequest__();
            }
        }

        prototype.__beforeRequest__ = function() {
            log.trace("controller.__beforeRequest__");
        }
        
        prototype.__afterRequest__ = function() {
            log.trace("controller.__afterRequest__");
        }
        
        /**
         * Render the specified view.
         *
         * Arguments are as in [[library.view.render|library.view.html#render]].
         *
         * If the argument does not provide a layout, use the default one
         * (this.defaultLayout) if defined, otherwise none.
         */
        prototype.render = function(arg) {
            log.trace("controller.render");
            if (this.defaultLayout != undefined) {
                var fullArg;
                if (library.lang.isString(arg)) {
                    fullArg = { view: arg };
                }
                else {
                    fullArg = library.lang.shallowCopy(arg);
                }
                if (fullArg.layout == undefined) {
                    fullArg.layout = this.defaultLayout;
                }
                return library.view.render(fullArg);
            }
        }
        
    }
    
    // module exports
    this.Controller = Controller;
});
