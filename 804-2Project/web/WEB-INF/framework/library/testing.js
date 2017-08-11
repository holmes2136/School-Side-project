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
 * Unit testing library.
 */

library.common.define(library, "testing", function() {

    var log = library.log.get("framework.testing");
    
    /**
     * Run a single script, typically identified by its full name (e.g. "/application/test/foo.js").
     */
    function runSingleTest(scriptName) {
        log.trace("testing.runSingleTest");
        
        var result = {script: scriptName};
        invocation.__testResult__ = result;
        try {
            library.scripting.run(scriptName);
            result.succeeded = true;
        }
        catch (e) {
            result.succeeded = false;
            result.exception = e;
        }
        return result;
    };

    function appendLists(from, to) {
        for (var j = 0; j < from.length; ++j) {
            to.push(from[j]);
        }
        return to;
    }    
    
    /**
     * Run a test suite, i.e. all test scripts inside a directory, plus all
     * its subdirectories, if any.
     */
    function runTestSuite(dirName) {
        log.trace("testing.runTestSuite");
        
        var results = [];
        var mustRecurse = [];
        if (library.resource.isDirectory(dirName) && dirName[0] != '.') {
            var children = library.resource.children(dirName);
            for (var i = 0; i < children.length; ++i) {
                var childName = dirName + "/" + String(children[i]);
                if (childName.substring(childName.length - 3) == ".js" && library.resource.exists(childName)) {
                    var status = runSingleTest(childName);
                    results.push(status);
                }
                else if (library.resource.isDirectory(childName)) {
                    mustRecurse.push(childName);
                }
            }
        }
        for (var i = 0; i < mustRecurse.length; ++i) {
            var partialResults = runTestSuite(mustRecurse[i]);
            appendLists(partialResults, results);
        }
        return results;
    };

    /**
     * Run all test suites, i.e. all scripts in all directories in the test path
     * (the value of the application.path.test variable).
     */
    function runAllTestSuites() {
        log.trace("testing.runAllTestSuites");
        
        var testPath = application.path.test;
        var results = [];
        for (var i = 0; i < testPath.length; ++i) {
            if (library.resource.isDirectory(testPath[i])) {
                appendLists(runTestSuite(testPath[i]), results);
            }
        }
        return results;
    }
    
    /**
     * Run a test case.
     * 
     * A test case is an object with the following properties:
     *
     *   test ...... a function which contains the behavior for the test case
     *   name ...... (optional) a string identifying the test case for reporting purposes
     *   before .... (optional) a function which is executed before the test case proper
     *   after ..... (optional) a function which is executed after the test case proper
     */
    function runTestCase(testcase) {
        log.trace("testing.runTestCase");
        
        var beforeFn = testcase.before;
        var afterFn = testcase.after;
        var testFn = testcase.test;
        if (typeof(testFn) != "function") {
            if (log.errorEnabled) {
                log.error("testing.runTestCase: invalid test: " + testFn);
            }
            throw Error("invalid test (" + testFn + ")");
        }
        if (library.lang.isFunction(beforeFn)) {
            beforeFn();
        }
        try {
            testFn();
        }
        catch (e) {
            if (library.lang.isObject(invocation.__testResult)) {
                invocation.__testResult__.name = testcase.name;
            }
            throw e;
        }
        finally {
            if (library.lang.isFunction(afterFn)) {
                afterFn();
            }
        }
    }
    
    /**
     * Ensure that the specified object is true, throw an error otherwise.
     */
    function assert(obj) {
        log.trace("testing.assert");
        
        var theObj = obj;
        if (typeof(theObj) == "function") {
            theObj = theObj();
        }
        if (typeof(theObj) == "boolean") {
            if (!theObj) {
                if (log.errorEnabled) {
                    log.error("testing.assert: assertion failed");
                }
                throw Error("assertion failed (true " + obj + ")");
            }
        }
        else {
            throw Error("not a boolean (" + obj + ")");
        }
    };

    /**
     * Ensure that the specified object is undefined, throw an error otherwise.
     */
    function assertUndefined(obj) {
        log.trace("testing.assertUndefined");
        
        var theObj = obj;
        if (typeof(theObj) == "function") {
            theObj = theObj();
        }
        if (theObj != undefined) {
            if (log.errorEnabled) {
                log.error("testing.assertUndefined: assertion failed");
            }
            throw Error("assertion failed (undefined " + obj + ")");
        }
    };
    
    /**
     * Ensure that the specified object is not undefined, throw an error otherwise.
     */
    function assertDefined(obj) {
        log.trace("testing.assertDefined");
        
        var theObj = obj;
        if (typeof(theObj) == "function") {
            theObj = theObj();
        }
        if (theObj == undefined) {
            if (log.errorEnabled) {
                log.error("testing.assertDefined: assertion failed");
            }
            throw Error("assertion failed (defined " + obj + ")");
        }
    };

    /**
     * Ensure that the specified object is null, throw an error otherwise.
     */
    function assertNull(obj) {
        log.trace("testing.assertNull");
        
        var theObj = obj;
        if (typeof(theObj) == "function") {
            theObj = theObj();
        }
        if (theObj != null) {
            if (log.errorEnabled) {
                log.error("testing.assertNull: assertion failed");
            }
            throw Error("assertion failed (null " + obj + ")");
        }
    };
    
    /**
     * Ensure that the specified object is not null, throw an error otherwise.
     */
    function assertNotNull(obj) {
        log.trace("testing.assertNotNull");
        
        var theObj = obj;
        if (typeof(theObj) == "function") {
            theObj = theObj();
        }
        if (theObj == null) {
            if (log.errorEnabled) {
                log.error("testing.assertNotNull: assertion failed");
            }
            throw Error("assertion failed (not null " + obj + ")");
        }
    };

    /**
     * Ensure that the specified objects are equal (==), throw an error otherwise.
     */
    function assertEquals(obj1, obj2) {
        log.trace("testing.assertEquals");
        
        var theObj1 = obj1;
        var theObj2 = obj2;
        if (typeof(theObj1) == "function") {
            theObj1 = theObj1();
        }
        if (typeof(theObj2) == "function") {
            theObj2 = theObj2();
        }
        if (theObj1 != theObj2) {
            if (log.errorEnabled) {
                log.error("testing.assertEquals: assertion failed");
            }
            throw Error("assertion failed (equals " + obj1 + " and " + obj2 + ")");
        }
    };

    /**
     * Ensure that the specified objects are not equal (!=), throw an error otherwise.
     */
    function assertNotEquals(obj1, obj2) {
        log.trace("testing.assertNotEquals");
        
        var theObj1 = obj1;
        var theObj2 = obj2;
        if (typeof(theObj1) == "function") {
            theObj1 = theObj1();
        }
        if (typeof(theObj2) == "function") {
            theObj2 = theObj2();
        }
        if (theObj1 == theObj2) {
            if (log.errorEnabled) {
                log.error("testing.assertNotEquals: assertion failed");
            }
            throw Error("assertion failed (not equals " + obj1 + " and " + obj2 + ")");
        }
    };

    /**
     * Ensure that the specified function causes an exception to be thrown.
     */
    function assertException(fn) {
        log.trace("testing.assertException");
        
        var gotException = false;
        try {
            fn();
        }
        catch (e) {
            gotException = true;
        }
        if (!gotException) {
            if (log.errorEnabled) {
                log.error("testing.assertException: assertion failed");
            }
            throw Error("assertion failed (exception)");
        }
    }

    // exports
    this.runSingleTest = runSingleTest;
    this.runTestSuite = runTestSuite;
    this.runTestCase = runTestCase;
    this.runAllTestSuites = runAllTestSuites;
    this.assert = assert;
    this.assertUndefined = assertUndefined;
    this.assertDefined = assertDefined;
    this.assertNull = assertNull;
    this.assertNotNull = assertNotNull;
    this.assertEquals = assertEquals;
    this.assertNotEquals = assertNotEquals;
    this.assertException = assertException;
});
