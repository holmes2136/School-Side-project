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

var log = library.log.get("framework.jsf");

var OUT_BEAN_PROPERTIES_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".BeanProperties";
var OUT_PROPERTY_VALUE_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".PropertyValue";

    // ----------------------------------------------- in arguments to script.
    
var IN_BEAN_NAME_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".BeanName";
var IN_PROPERTY_NAME_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".PropertyName";
var IN_PROPERTY_VALUE_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".PropertyValue";
var IN_OPERATION_REQUEST_ATTRIBUTE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".Operation";

    // ---------------------------------------- operations supported by script.
    
    
var OPERATION_NEW = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".New";
var OPERATION_GET_PROPERTY_NAMES = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".GetPropertyNames";
var OPERATION_GET_PROPERTY = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".GetProperty";
var OPERATION_REMOVE_PROPERTY = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".RemoveProperty";
var OPERATION_PUT_PROPERTY_VALUE = 
            library.jsf.PHOBOS_WEBAPP_PREFIX + ".PutPropertyValue";

var facesContext = 
    Packages.javax.faces.context.FacesContext.getCurrentInstance();
var requestMap = facesContext.getExternalContext().getRequestMap();
var beanName = requestMap.get(IN_BEAN_NAME_REQUEST_ATTRIBUTE);
var propertyName = requestMap.get(IN_PROPERTY_NAME_REQUEST_ATTRIBUTE);
var propertyValue = requestMap.get(IN_PROPERTY_VALUE_REQUEST_ATTRIBUTE);
var operation = requestMap.get(IN_OPERATION_REQUEST_ATTRIBUTE);

var result = "";

if (null == operation) {
    log.error("jsf.beanAccess Cannot perform bean operation because operation is null.");
}
else {
    var operationLength = operation.length();
    if (log.traceEnabled) {
        log.trace("jsf.beanAccess: bean name: " + beanName + 
                  ",\n\t property name: " + propertyName + 
                  ",\n\t operation: " + operation + ".");
    }
    
    if (-1 != operation.indexOf(OPERATION_GET_PROPERTY_NAMES) &&
        operationLength == OPERATION_GET_PROPERTY_NAMES.length) {
        var prop;
        var bean = this[beanName];
        for (prop in bean) {
            if (0 == result.length) {
                result = prop;
            }
            else {
                result = result + "," + prop;
            }
        }
        
        requestMap.put(OUT_BEAN_PROPERTIES_REQUEST_ATTRIBUTE, result);
    }
    else if (-1 != operation.indexOf(OPERATION_NEW) &&
             operationLength == OPERATION_NEW.length) {

        var path = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("application").path.managedBeans;
        var resource = library.common.findFirst(beanName + ".js", path);
        if (log.traceEnabled) {
            log.trace("jsf.beanAccess new: " + beanName + " resource: " + 
                      resource + 
                      " model: " + model);
        }

        var bean = this[beanName];
        var services = Packages.com.sun.phobos.container.PhobosRuntime.getGlobalContext().get("services");
        if (services.resource.isResourcePresent(resource)) {
            services.scripting.evalScript(resource, context);
        }
        var beanModule = library.common.resolve(beanName, model);
        
        if (library.lang.isObject(beanModule)) {
            var uppercaseModelName = beanName.substring(0, 1).toUpperCase() + beanName.substring(1);
            var modelFn = beanModule[uppercaseModelName];
            if (library.lang.isFunction(modelFn)) {
                var beanInstance = new modelFn();
            }
            this[beanName] = beanInstance;
            

        }
        else {
            if (log.errorEnabled) {
                log.error("jsf.beanAccess: no such model: " + beanName);
            }
        }
    } 
    else if (-1 != operation.indexOf(OPERATION_GET_PROPERTY) &&
             operationLength == OPERATION_GET_PROPERTY.length) {
        var bean = this[beanName];

        result = bean[propertyName];
        
        requestMap.put(OUT_PROPERTY_VALUE_REQUEST_ATTRIBUTE, result);
    }
    else if (-1 != operation.indexOf(OPERATION_REMOVE_PROPERTY) &&
             operationLength == OPERATION_REMOVE_PROPERTY.length) {
        var bean = this[beanName];
        result = bean[propertyName];
        bean[propertyName] = null;
        
        requestMap.put(OUT_PROPERTY_VALUE_REQUEST_ATTRIBUTE, result);
    }
    else if (-1 != operation.indexOf(OPERATION_PUT_PROPERTY_VALUE) &&
             operationLength == OPERATION_PUT_PROPERTY_VALUE.length) {
        var bean = this[beanName];
        result = bean[propertyName];
        bean[propertyName] = propertyValue;
        
        requestMap.put(OUT_PROPERTY_VALUE_REQUEST_ATTRIBUTE, result);
    }
    
}
