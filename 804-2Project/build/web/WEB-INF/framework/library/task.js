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
 * Task library module.
 */

library.common.define(library, "task", function() {
    var taskService = globals.services.task;
    var log = library.log.get("framework.task");

    /**
     * Execute a script as a background task in a different thread.
     *
     * @param(name, string, required)
     *   name of the script to execute
     * @param(arg, string, optional)
     *   argument to be passed to the script
     * @return(java.util.concurrent.Future)
     *   task future
     */
    this.submitScriptTask = function(name, arg) {
        if (log.traceEnabled) {
            log.trace("task.submitScriptTask: " + name);
        }
        return taskService.submitScriptTask(name, arg);
    }

    /**
     * Schedule a script for periodic execution after the specified
     * initial delay and at every delay time units.
     *
     * @param(name, string, required)
     *   name of the script to execute
     * @param(initialDelay, number, required)
     *   initial delay in time units
     * @param(delay, number, required)
     *   delay in time units
     * @param(timeUnit, number, required)
     *   time unit to be used for the delay arguments
     * @param(arg, string, optional)
     *   argument to be passed to the script
     * @return(java.util.concurrent.Future)
     *   task future
     */
    this.scheduleScriptTaskFixedRate = function(name, initialDelay, delay, timeUnit, arg) {
        if (log.traceEnabled) {
            log.trace("task.scheduleScriptTaskFixedRate: " + name);
        }
        return taskService.scheduleScriptTaskFixedRate(name, initialDelay, delay, timeUnit, arg);
    }

    /**
     * Schedule a script for periodic execution after the specified
     * initial delay and at the given constant delays between executions.
     *
     * @param(name, string, required)
     *   name of the script to execute
     * @param(initialDelay, number, required)
     *   initial delay in time units
     * @param(delay, number, required)
     *   delay in time units
     * @param(timeUnit, number, required)
     *   time unit to be used for the delay arguments
     * @param(arg, string, optional)
     *   argument to be passed to the script
     * @return(java.util.concurrent.Future)
     *   task future
     */
    this.scheduleScriptTaskFixedDelay = function(name, initialDelay, delay, timeUnit, arg) {
        if (log.traceEnabled) {
            log.trace("task.scheduleScriptTaskFixedDelay: " + name);
        }
        return taskService.scheduleScriptTaskFixedDelay(name, initialDelay, delay, timeUnit, arg);
    }
    
    /**
     * Shut down the task service.
     *
     * @return(undefined)
     */
    this.shutdown = function() {
        log.trace("task.shutdown");
        taskService.shutdown();
    }

    /**
     * Seconds time unit.
     */
    this.seconds = taskService.seconds;

    /**
     * Milliseconds time unit.
     */
    this.milliseconds = taskService.milliseconds;

    /**
     * Microseconds time unit.
     */
    this.microseconds = taskService.microseconds;

    /**
     * Nanoseconds time unit.
     */
    this.nanoseconds = taskService.nanoseconds;
});
