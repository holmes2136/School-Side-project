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
 * Template library module.
 */

library.common.define(library, "template", function() {
    var log = library.log.get("framework.template");

    /**
     * Process a template using the given model and sending the
     * output to the specified writer.
     *
     * @param(templateName, string, required)
     *    name of the template to process
     * @param(model, object, required)
     *    object to be used as the model, to resolve any variables in the template
     * @param(writer, java.io.PrintWriter, required)
     *    writer to send the output to
     * @return(undefined)
     */
    this.process = function (templateName, model, writer) {
        if (log.traceEnabled) {
            log.trace("template.process: " + templateName);
        }
        globals.services.template.process(templateName, model, writer);
    }
    
    /**
     * Process an inline template using the given model and sending the
     * output to the specified writer. An inline template is one in
     * which the template string itself is the template, as opposed to
     * the name of a resource which contains a template.
     *
     * @param(templateName, string, required)
     *    name of the template to process
     * @param(model, object, required)
     *    object to be used as the model, to resolve any variables in the template
     * @param(writer, java.io.PrintWriter, required)
     *    writer to send the output to
     * @return(undefined)
     */
    this.processInline = function (template, model, writer) {
        if (log.traceEnabled) {
            log.trace("template.processInline: " + template);
        }
        globals.services.inlineTemplate.process(template, model, writer);
    }
    
});
