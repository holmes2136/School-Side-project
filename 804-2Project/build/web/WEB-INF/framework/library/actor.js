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

/**
 * Actor library module.
 */

library.common.define(library, "actor", function() {

    var log = library.log.get("framework.actor");

    /**
     * Initialize the global data structures used by the actor library.
     */
    function initialize() {
        log.trace("actor.initialize");
        
        if (application.__actorData__ == undefined) {
            application.__actorData__ = {
                started: new java.util.concurrent.atomic.AtomicBoolean(),
                stopping: new java.util.concurrent.atomic.AtomicBoolean(),
                actors: new Packages.com.sun.phobos.container.StringOnlyConcurrentHashMap(),
                actorIsActive: new java.util.concurrent.ConcurrentHashMap(),
                messageQueues: new java.util.concurrent.ConcurrentHashMap(),
                newActorNotificationQueue: new java.util.concurrent.LinkedBlockingQueue()
            };
        }
    }
    
    /**
     * Start dispatching messages to actors.
     *
     * If the library hasn't been initialized before, it is initialized now.
     */
    function start() {
        log.trace("actor.start");
        
        initialize();
        
        if (application.__actorData__.started.get() == false) {
            library.lang.invokeAsync("library.actor.messageDispatchLoop");
        }
    }
    
    /**
     * Stop dispatching messages to actors.
     *
     * Existing actor definitions and messages in mailboxes are preserved.
     * 
     */
    function stop() {
        log.trace("actor.stop");
        
        initialize();
        var data = application.__actorData__;
        if (data.started.get() == true) {
            data.stopping.set(true);
        }
    }
    
    /**
     * Return true if message dispatching is on.
     */
    function isRunning() {
        log.trace("actor.isRunning");
        
        initialize();
        var data = application.__actorData__;
        return data.started.get();
    }
    
    /**
     * Stop message dispatching and reset all internal data structures.
     *
     * The existing actor definitions are lost.
     */
    function reset() {
        log.trace("actor.reset");

        stop();
        var data = application.__actorData__;
        // wait for dispatcher thread to stop
        while (data.started.get() == true) {
            // empty block
        }
        delete application.__actorData__;
    }
    
    /**
     * Message dispatch loop.
     *
     * This function should not be called directly by application code.
     * Use [[start|#start]] instead.
     */
    function messageDispatchLoop() {
        log.trace("actor.messageDispatchLoop");
        
        var data = application.__actorData__;
        
        if (data == undefined) {
            return;
        }

        data.started.set(true);
        
        function computeActorList() {
            var result = [];
            for (var e = data.messageQueues.keys(); e.hasMoreElements();) {
                result.push(e.next());
            }
            return result;
        }
        
        var actorList = computeActorList();
        var nextIndex = 0;
        
        while (true) {
            try {
                if (data.stopping.get()) {
                    break;                
                }
                
                var newJname = data.newActorNotificationQueue.poll();
                if (newJname != null) {
                    actorList = computeActorList();
                    continue;
                }

                if (nextIndex >= actorList.length) {
                    nextIndex = 0;
                }
            
                var jname = actorList[nextIndex++];
                var isActiveAtomic = data.actorIsActive.get(jname);
                if (isActiveAtomic.get()) {
                    continue;
                }
                
                var queue = data.messageQueues.get(jname);
                
                if (queue) {
                    var msgData = queue.poll();
            
                    if (msgData != null) {
                        isActiveAtomic.set(true);
                        library.lang.invokeAsyncJSON("library.actor.dispatchMessage", msgData);
                    }
                }
            }
            catch (e) {
                // it's unclear where to log this error in normal circumstances
                if (log.debugEnabled) {
                    log.debug("actor.messageDispatchLoop: exception: " + e.message);
                }
            }
        }
        
        log.trace("actor.messageDispatchLoop: exited dispatch loop");
    }
    
    /**
     * Dispatch a single message.
     *
     * This function should not be called directly by application code.
     * Use [[send|#send]] instead.
     *
     * @param(msgData, object, required)
     */
    function dispatchMessage(msgData) {
        if (log.traceEnabled) {
            log.trace("actor.dispatchMessage: dispatching " + msgData)
        }
        var data = application.__actorData__;
        
        var msg = library.json.deserialize(msgData);
        if (msg.actor) {
            var jname= new java.lang.String(msg.actor);
            try {
                var actorFnName = String(data.actors.get(jname));
                if (actorFnName) {
                    var fn = library.common.resolve(actorFnName);                    
                    if (typeof(fn) == "function") {
                        fn.call(this, msg.message);
                    }
                }
            }
            finally {
                var isActiveAtomic = data.actorIsActive.get(jname);
                if (isActiveAtomic) {
                    isActiveAtomic.set(false);
                }
            }
        }
    }

    /**
     * Register an actor.
     *
     * Actors must have unique names. The implementation of an actor is a function, whose name
     * is resolved using the [[library.common.resolve|library.common.html#resolve]] function.
     *
     * param(name, string, required)  actor name
     * param(functionName, string, required) name of the function that implements the actor's behavior
     */
    function register(name, functionName) {
        if (log.traceEnabled) {
            log.trace("actor.register: actor \"" + name + "\" with function \"" + functionName + "\"");
        }
        
        if (!name) {
            if (log.errorEnabled) {
                log.error("actor.register: missing actor name");
            }
            throw new Error("missing actor name");            
        }
        if (!functionName || !library.lang.isString(functionName)) {
            if (log.errorEnabled) {
                log.error("actor.register: missing name of actor function");
            }
            throw new Error("missing name of actor function");
        }
        
        var data = application.__actorData__;
        if (data) {
            var jname = new java.lang.String(name);
            data.actors.put(jname, functionName);
            data.messageQueues.put(jname, new java.util.concurrent.LinkedBlockingQueue());
            data.actorIsActive.put(jname, new java.util.concurrent.atomic.AtomicBoolean(false));
            data.newActorNotificationQueue.offer(jname);
        }
    }
    
    /**
     * Send a message to an actor.
     *
     * Actors are identified by the name used to register them with [[register|#register]].
     * A message is a JavaScript object which will be serialized to JSON before being sent
     * and deserialized at the receiving end.
     *
     * @param(name, string, required)   the name of the actor to send the message to
     * @param(message, object, required)   the message to be send
     */
    function send(name, message) {
        if (log.traceEnabled) {
            log.trace("actor.send: destination \"" + name + "\"");
        }
        
        if (!name) {
            if (log.errorEnabled) {
                log.error("actor.send: missing actor name");
            }
            throw new Error("missing actor name");            
        }

        if (message == undefined) {
            if (log.errorEnabled) {
                log.error("actor.send: missing message");
            }
            throw new Error("missing message");            
        }

        var data = application.__actorData__;
        if (data) {
            var jname = new java.lang.String(name);
            var queue = data.messageQueues.get(jname);
            if (queue) {
                var msg = {actor: name, message: message};
                queue.offer(new java.lang.String(library.json.serialize(msg)));
            }
        }
    }
    
    // export
    this.initialize = initialize;
    this.start = start;
    this.stop = stop;
    this.isRunning = isRunning;
    this.reset = reset;
    this.messageDispatchLoop = messageDispatchLoop;
    this.dispatchMessage = dispatchMessage;
    this.register = register;
    this.send = send;
});
