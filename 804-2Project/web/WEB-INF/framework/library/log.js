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
 * Log library module.
 */

library.common.define(library, "log", function() {

    /**
     * Return a log object for the logical log with the specified name.
     *
     * The log levels are: ``trace``, ``debug``, ``info``, ``warn``, ``error``, ``fatal``.
     *
     * For each log level, a log object exposes two properties:
     *  ``<<levelName>>Enabled``, e.g. ``debugEnabled``, a boolean which is
     *  true if this level of logging is enabled, and ``<<levelname>>``, e.g. ``debug``,
     *  a function which logs all the arguments passed to it. Any function-typed arguments are
     *  invoked and their result used as a value; all other types of values are converted to strings.
     *  If the logging level is below that identified by the function's name,
     *  then logging is a no-op
     *
     * Log names are hierarchical. When asked to produce a log ``foo.bar.baz``,
     * the system looks for log configuration under ``foo.bar.baz``, then ``foo.bar``,
     * then ``foo``, finally ``any`` (the default log).
     *
     * A log can be configured by using the ``application.options.log`` object.
     * At creation time, the system looks under ``application.options.log`` to find the
     * property with the longest name matching the specified log name. The property
     * value must be an object with two properties: ``level``, a number identifying the
     * logging level, and ``timestamp``, an optional boolean which, if set, causes
     * the logger to print a timestamp before each entry
     *
     * &&Examples&&
     *
     *   Configuring logs:
     *
     * {{{
     *     application.options.log["user"] = { level: library.log.ERROR, timestamp: true };
     *
     *     application.options.log["framework"] = { level: library.log.DEBUG, timestamp: false };
     *
     * }}}
     *
     *   Using logs:
     *
     * {{{
     *     var log = library.log.get("user");
     *
     *     log.error("invalid resource name");
     *
     *     if (log.infoEnabled) {
     *         log.info("I just sent " + foo + " and got back " + bar);
     *     }
     *
     * }}}
     *
     * @param(name, string, required)
     *   name of the log to retrieve
     * @return(object)
     *   the log (see above for a description of its properties)
     */
    this.get = function(name) {
        var log = logs[name];
        if (log == undefined) {
            log = createLog(name);
        }
        return log;
    }
    
    /**
     * Discard the log with the specified name, if any.
     * The log will be recreated the next time library.log.get is called.
     *
     * @param(name, string, required)
     *   name of the log to discard
     * @return(undefined)
     */
    this.discard = function(name) {
        if (logs[name]) {
            delete logs[name];
        }
    }

    /**
     * Log level names.
     */
    this.TRACE = 1;
    this.DEBUG = 2;
    this.INFO = 3;
    this.WARN = 4;
    this.ERROR = 5;
    this.FATAL = 6;
    
    // implementation
    function createLog(name) {
        if (application && application.options && application.options.log) {
            var theLog;
            var obj = findLogInfo(name);
            if (obj) {
                if (logs[obj.name]) {            
                    theLog = logs[obj.name];
                }
                else {
                    theLog = new Log(obj);
                    logs[obj.name] = theLog;
                }
                logs[name] = theLog;
                return logs[name];
            }
        }
        else {
            return new Log({name: name, level: maxLevel});
        }
     }

    function findLogInfo(name) {
        var base = application.options.log;
        function safeGetLogInfo(s) {
            if (typeof(base[s]) == "object" &&
                typeof(base[s].level) == "number") {
                return {name: s, level: base[s].level, timestamp: base[s].timestamp};
            }
            else {
                return undefined;
            }
        }
        var result = safeGetLogInfo(name);
        while (result == undefined) {
            var i = name.lastIndexOf(".");
            if (i != -1) {
                name = name.substring(0, i);
                result = safeGetLogInfo(name);
            }
            else {
                break;
            }
        }
        if (result == undefined) {
            result = safeGetLogInfo("any");
        }
        return result;
    }
        
    // log constructor
    function Log(obj) {
        var name = obj.name;
        var level = obj.level;
        var timestamp = (obj.timestamp != undefined ? obj.timestamp : true);
        
        this.name = name;
        if (level > maxLevel) {
            level = maxLevel;
        }
        else if (level < 1) {
            level = 1;
        }
        this.level = level;
        this.timestamp = timestamp;
        this.formatter = new java.text.SimpleDateFormat("'LOG " + name + " 'yyyy-MM-dd' 'HH:mm:ss' 'Z", java.util.Locale.US);
        
        function noLogFn() {}
        function makeLogFn(levelName) {
            return function() {
                this.doLog.call(this, levelName, arguments);
            }
        }
        for (var i = 1; i < level; ++i) {
            this[names[i-1] + "Enabled"] = false;
            this[names[i-1]] = noLogFn;
        }
        for (; i <= maxLevel; ++i) {
            this[names[i-1] + "Enabled"] = true;
            this[names[i-1]] = makeLogFn(levelNames[i-1]);
        }
    }

    // level definition
    var maxLevel = 6;
    var names = ["trace", "debug", "info", "warn", "error", "fatal"];
    var levelNames = ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"];    
        
    Log.prototype.doLog = function(levelName, args) {
        var w = Packages.com.sun.phobos.container.PhobosRuntime.getCurrentAdapter().getLogWriter();
        lock.lock();
        try {
            if (this.timestamp) {
                w.println(this.formatter.format(new java.util.Date()));
            }
            w.print(levelName);
            w.print(": ");
            for (var i = 0; i < args.length; ++i) {
                var arg = args[i];
                if (typeof(arg) == "function") {
                    arg = arg();
                }
                w.print(String(arg));
            }
            w.println();
            w.flush();
        }
        finally {
            lock.unlock();
        }
    }

    // log storage
    var logs = {};

    // lock to prevent logging messages from being interleaved
    var lock = new java.util.concurrent.locks.ReentrantLock();    
});
