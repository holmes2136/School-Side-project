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
 * JSF Integration module
 */

library.common.define(library, "jsf", function() {

    var log = library.log.get("framework.jsf");

    // ------------------------------------------------------- Public Methods

    this.PHOBOS_WEBAPP_PREFIX = "com.sun.phobos.webapp";

    this.VIEW_REQUEST_ATTRIBUTE = this.PHOBOS_PREFIX + ".View";

    this.LAYOUT_REQUEST_ATTRIBUTE = this.PHOBOS_PREFIX + ".Layout";

    this.initialize = function initialize() {
        log.trace("jsf.initialize");
        if (!globals.isJsfInitialized) {
            // Perform the steps one finds in FacesServlet.init().

            try {
                // Acquire a reference to the FacesContextFactory.
                globals.facesContextFactory = 
                    Packages.javax.faces.FactoryFinder.getFactory("javax.faces.context.FacesContextFactory");
            }
            catch (e) {
                log.error("jsf.postback: Unable to get FacesContextFactory");
                return;
            }

            try {
                // Acquire a reference to the LifecycleFactory.  
                var lifecycleFactory = 
                    Packages.javax.faces.FactoryFinder.getFactory("javax.faces.lifecycle.LifecycleFactory");
                var lifecycleId = null;

                if (null == (lifecycleId = 
                             globals.servletConfig.getInitParameter("javax.faces.LIFECYCLE_ID"))) {
                    lifecycleId = globals.servletContext.getInitParameter("javax.faces.LIFECYCLE_ID");
                }
                if (null == lifecycleId) {
                    lifecycleId = "DEFAULT";
                }

                // Use the LifecycleFactory to create a Lifecycle instance
                // and keep a reference to it.
                globals.lifecycle = lifecycleFactory.getLifecycle(lifecycleId);

                globals.isJsfInitialized = true;
            }
            catch (e) {
                log.error("jsf.postback: Unable to create JSF Lifecycle");
                return;
            }
        }        
    }

    /**
     * Public function to render a JSF view.
     */

    this.render = function render(obj) {
        log.trace("jsf.render");
        var facesContext = null;
        try {
            facesContext = this._perRequestInit();
        }
        catch (e) {
            throw new Error("Error doing per-request initialization.");
        }

        try {
            var elFlash = 
                Packages.com.sun.faces.extensions.flash.ELFlash.getELFlash();
            elFlash.setKeepAllRequestScopedData(true);
        }
        catch (e) {
            throw new Error("Error initializing flash.");
        }

        try {
            this._postback(facesContext, obj);
            this._render(facesContext, obj);
        }
        catch (e) {
            throw new Error("Error when rendering " + obj);
        }
        finally {
            this._release();
        }
    }

    /**
     * Public function to postback a JSF view.
     */

    this.postback = function postback(obj) {
        log.trace("jsf.postback");
        try {
            var facesContext = this._perRequestInit();

            var elFlash = 
                Packages.com.sun.faces.extensions.flash.ELFlash.getELFlash();
            elFlash.setRedirectAfterPost(true);
            elFlash.setKeepAllRequestScopedData(true);

            this._postback(facesContext, obj);
        }
        catch (e) {
            throw new Error("Error when rendering " + obj);
        }
        finally {
            this._release();
        }
    }


    // ------------------------------------------------------- Private Methods

    this._perRequestInit = function _perRequestInit() {
        var facesContext = null;

        // Use the FacesContextFactory to create a FacesContext
        // instance.  
        try {
            this.initialize();
            facesContext = Packages.javax.faces.context.FacesContext.getCurrentInstance();
            if (null == facesContext || typeof facesContext == 'undefined') {
                facesContext = 
                    globals.facesContextFactory.getFacesContext(globals.servletContext,
                                                                request, response,
                                                                globals.lifecycle);
            }
        }
        catch (e) {
            log.error("jsf.postback: Unable to create FacesContext");
        }

        return facesContext;
    }

    this._postback = function _postback(facesContext, obj) {
        var name, layoutName;
        if (library.lang.isString(obj)) {
            name = obj;
            layoutName = null;
        }
        else if (library.lang.isObject(obj)) {
            name = obj.view;
            layoutName = obj.layout;
        }
        if (name == undefined) {
            if (log.errorEnabled) {
                log.error("jsf.postback: no view name specified");
            }
            throw new Error("no view name specified");
        }

        var requestMap = facesContext.getExternalContext().getRequestMap();

        // Pass the necessary attributes to the ViewHandler
        // via request scoped attributes.
        requestMap.put("com.sun.phobos.webapp.View", name);
        requestMap.put("com.sun.phobos.webapp.Layout", layoutName);

        try {
            // Use the lifecycle instance to call its "execute" method,
            // passing the FacesContext.
            globals.lifecycle.execute(facesContext);
        }
        catch (e) {
            log.error("jsf.postback: Unable call execute on lifecycle");
        }
        
        
    }

    this._render = function _render(facesContext, obj) {
        if (null == facesContext) {
            return;
        }

        try {
            globals.lifecycle.render(facesContext);
        }
        catch (e) {
            log.error("jsf._render: Unable call render on lifecycle");
        }

    }

    this._release = function _release() {
        Packages.javax.faces.context.FacesContext.getCurrentInstance().release();
    }

});
