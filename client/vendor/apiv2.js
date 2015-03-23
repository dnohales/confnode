/**
 * Created by lisandro on 23/03/15.
 */

document.write('<iframe src="http://iswebrtcready.appear.in/lite.html" frameborder="0" height="0" width="0" id="webrtc-compatability-tester"></iframe>');
document.close();

(function () {
    /**
     * Global method **to be renamed!**
     *
     * @class
     */
    window.API = {};
    var iframe = document.getElementById('webrtc-compatability-tester');
    var isReady = false;

    iframe.onload = function () {
        isReady = true;
    }
    var attemptNumber = 0;
    var ttl = 50;

    var callbacks = {};

    var messageHandler = function (e) {
        var payload = e.data;

        switch (payload.event) {
            case 'registeredListener':
                break;
            case 'appearinSupport':
            case 'testResult':
                var result = payload.data;
                var successCallback = callbacks[payload.data.callbackToken].successCallback;
                delete callbacks[payload.callbackToken];
                delete result['callbackToken'];
                successCallback(result);
                break;
        }
    }

    window.addEventListener('message', messageHandler, false);



    /**
     * Runs the entire battery of tests available.
     *
     * ##### Example
     *
     * ```
     * window.isAppearinCompatible(function (data) {
     *     // Test was performed successfully
     *     console.log(data.result); // returns true or false depending on result of test
     * }, function (error) {
     *     // Test was not performed, due to an error
     *     console.error(error);
     * });
     * ```
     *
     * @function
     * @memberof API
     * @param {successCallback} successCallback - Function to be executed when the query has been done successfully.
     * @param {errorCallback} errorCallback - Function to be executed if the query fails.
     */
    window.API.isAppearinCompatible = function (successCallback, errorCallback) {
        if (!isReady) {
            if(attemptNumber < ttl) {
                attemptNumber++;
                window.setTimeout(function () {
                    window.API.isAppearinCompatible(successCallback, errorCallback);
                }, 100);
            }
            else {
                console.error('Error: Timeout. Took more than 5 seconds.');
                errorCallback({"error": "Error: Timeout. Request took more than 5 seconds."})
            }
        }
        else {
            callbacks.onAllTestsPerformed = {
                successCallback: successCallback,
                errorCallback: errorCallback
            }

            var payload = {
                "event": "performAllTests",
                "callbackToken": "onAllTestsPerformed"
            }
            iframe.contentWindow.postMessage(payload, '*');
        }
    }


    /**
     * Performs a single, specified test.
     *
     * ##### Example
     *
     * ```
     * window.performTest('html5video', function (data) {
     *     // Test was performed successfully
     *     console.log(data.result); // returns true or false depending on result of test
     * }, function (error) {
     *     // Test was not performed, due to an error
     *     console.error(error);
     * });
     *
     * ```
     *
     * ##### Available tests
     * * `html5videoTest`
     * * `vp8CodecTest`
     * * `getUserMediaTest`
     * * `RTCPeerConnectionTest`
     * * `ICETest`
     *
     *
     * An array of the available tests can be retrieved from the {@link getAvailableTests} method.
     *
     * ##### Future development
     * Will accept an array of tests in the future. (might even implement this today).
     *
     * @function
     * @memberof API
     * @param {string} testId - The test ID of the test that is to be performed.
     * @param {successCallback} successCallback - Function to be executed when the query has been done successfully.
     * @param {errorCallback} errorCallback - Function to be executed if the query fails.
     */
    window.API.performTest = function(testId, successCallback, errorCallback) {
        if (!isReady) {
            if(attemptNumber < ttl) {
                attemptNumber++;
                window.setTimeout(function () {
                    window.API.performTest(testId, successCallback, errorCallback);
                }, 100);
            }
            else {
                console.error('Error: Timeout. Took more than 5 seconds.');
                errorCallback({"error": "Error: Timeout. Request took more than 5 seconds."})
            }
        }
        else {
            callbacks.onTestPerformed = {
                successCallback: successCallback,
                errorCallback: errorCallback
            }

            var payload = {
                "testId": testId,
                "event": "performTest",
                "callbackToken": "onTestPerformed"
            }
            iframe.contentWindow.postMessage(payload, '*');
        }
    }





    /**
     * Retrieve an array of all the available tests
     *
     * ##### Example
     *
     * ```
     * window.getAvailableTests(function (tests) {
     *     // Test was performed successfully
     *     console.log(tests);
     * }, function (error) {
     *     // Test was not performed, due to an error
     *     console.error(error);
     * });
     *
     * ```
     *
     * ##### Future development
     * Actually implementing this.
     *
     * @function
     * @memberof API
     * @name getAvailableTests
     * @param {successCallback} successCallback - Function to be executed when the query has been done successfully.
     * @param {errorCallback} errorCallback - Function to be executed if the query fails.
     */
    window.API.getAvailableTests = function(successCallback, errorCallback) {
        if (!isReady) {
            if(attemptNumber < ttl) {
                attemptNumber++;
                window.setTimeout(function () {
                    window.API.getAvailableTests(successCallback, errorCallback);
                }, 100);
            }
            else {
                console.error('Error: Timeout. Took more than 5 seconds.');
                errorCallback({"error": "Error: Timeout. Request took more than 5 seconds."})
            }
        }
        else {
            callbacks.onAvailableTestsReceived = {
                successCallback: successCallback,
                errorCallback: errorCallback
            }

            var payload = {
                "event": "getAvailableTests",
                "callbackToken": "onAvailableTestsReceived"
            }
            iframe.contentWindow.postMessage(payload, '*');
        }
    }


    /**
     * This is a test
     * @callback successCallback
     * @param {object} data - Data object containing test results.
     *
     * ```
     * isSupported: boolean
     * results : Array
     *      0: Object
     *          description: string
     *          id: string
     *          name: string
     *          isSupported: boolean
     * ```
     */

})();