/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;
(function() {
    var cordovaExec = require('cordova/exec');

    /**
     * @class GDHttpResponse
     * @classdesc This class encapsulates the HTTP response returned from a GDHttpRequest's
     * send function.
     *
     * @param {string} json The input data (formatted as JSON text) used to construct the
     * response object.
     *
     * @property {string} headers The HTTP response headers.
     *
     * @property {string} status The HTTP response status.
     *
     * @property {string} statusText The textual HTTP response status, as sent by the server,
     * or details of error if the returned status is 0.
     *
     * @property {string} responseText The data returned from the HTTP request.  This data is
     * retrieved from the JSON string that was passed into this function.  If the input to this
     * function is not in valid JSON format, then this property will be the empty string.
     *
     * @property {string} responseData This is the raw (unparsed) data that was passed into this
     * function.  This data is useful as a means to support manual processing/parsing if the input
     * data could not be parsed as a JSON object.
     *
     * @property {string} responseState This value represents the current state of the opened HTTP
     * process.  The response is not complete until the responseState reaches the "DONE" state.
     * The following states are valid:
     * <ul>
     *     <li>"HEADERS_RECEIVED" Response headers have been received.</li>
     *     <li>"LOADING" Response headers and some data have been received. The loading state is
     *     typically indicative of an incremental request that is in progress.</li>
     *     <li>"DONE" All data has been received, or a permanent error has been encountered. </li>
     * </ul>
     *
     * @return {GDHttpResponse}
     *
     * @example
     * // This ojbect is used by GDHttpRequest.parseHttpResponse() method and is not used directly
     */
    var GDHttpResponse = function(json) {
        this.headers = null;
        this.status = null;
        this.statusText = null;
        this.responseText = null;
        this.responseData = json;
        this.responseState = null;

        try {
            var obj = JSON.parse(json),
                escapedJson = {};

            for (var i in obj) {
                escapedJson[i] = unescape(obj[i]);
            }
            this.headers = escapedJson.headers;
            this.status = parseInt(escapedJson.status);
            this.statusText = escapedJson.statusText;
            this.responseState = escapedJson.responseState;

            /*
             * The response could have been JSON text, which we might need to revert to it's
             * string representation.
             */
            try {
                if (typeof escapedJson.responseText === 'Object') {
                    this.responseText = JSON.stringify(escapedJson.responseText);
                } else {
                    this.responseText = escapedJson.responseText;
                }
            } catch (e) {
                this.responseText = escapedJson.responseText;
            }
        } catch (e) {
            this.responseData = json;
        }
    };

    /**
     * @class GDHttpRequest
     * @classdesc Implements the secure HTTP communications APIs.
     *
     * @property {string} method Case-sensitive string containing the HTTP method, which
     * will be sent to the server. Typical values are: "GET", "POST", "HEAD",
     * "OPTIONS", "TRACE", "PUT", "CONNECT". Any other value is sent as a custom
     * method.
     *
     * @property {string} url Uniform Resource Locator (URL) that will be requested. The
     * URL must be fully qualified, including a scheme, domain, and path. For
     * example: "http://www.example.com/index.html".
     *
     * @property {number} timeout Length of time out in seconds, or 0 (zero) for never.
     * A negative timeout number will allow this request to use the default timeout
     * value (30 seconds).
     *
     * @property {boolean} isAsync Set this value to true to make asynchronous calls.
     *
     * @property {string} user Authentication username. For Kerberos, this is in the
     * user@realm format.
     *
     * @property {string} password Authentication password.
     *
     * @property {string} auth The authentication scheme.  Valid values are:
     * <ul><li>"NTLM" to use NTLM authentication</li>
     * <li>"DIGEST" to use Digest Access authentication</li>
     * <li>"NEGOTIATE" to use negotiated Kerberos authentication</li>
     * <li>"BASIC" or a null pointer to use Basic Access authentication.</li></ul>
     *
     * @property {boolean} isIncremental Determine if the response from an asynchronous HTTP request
     * should be processed incrementally (as soon as data is received), or if the entire
     * request should be returned within a single response.
     *
     * @property {boolean} disableHostVerification Disable host name verification, when
     * making an HTTPS request. Host name verification is an SSL/TLS security option.
     *
     * @property {boolean} disableFollowLocation Disable automatic following of redirections.
     * When automatic following is disabled, the application must handle redirection
     * itself, including handling Location: headers, and HTTP statuses in the 30x range.
     *
     * @property {boolean} disablePeerVerification Disable certificate authenticity
     * verification, when making an HTTPS request. Authenticity verification is an
     * SSL/TLS security option.
     *
     * @property {boolean} disableCookieHandling Disable automatic cookie handling. When
     * automatic handling is disabled, the application must store and process cookies
     * itself.
     *
     * @property {string} cookieState Stores a value that determines whether or not cookies
     * should be cleared prior to sending the request.  This value should not be set
     * directly.  Instead, call the clearCookies method.
     *
     * @property {string} host The address of the proxy. Can be either an Internet Protocol
     * address (IP address, for example "192.168.1.10"), or a fully qualified domain name
     * (for example "www.example.com").
     *
     * @property {number} port Number of the port on the proxy to which connection will be made.
     *
     * @property {string} proxyUser The proxy authentication username.
     *
     * @property {string} proxyPassword The proxy authentication password.
     *
     * @property {string} proxyAuth The proxy authentication scheme.  Valid values are:
     * <ul>
     *	<li>"NTLM" to use NTLM authentication</li>
     *	<li>"DIGEST" to use Digest Access authentication</li>
     *	<li>"BASIC" or a null pointer to use Basic Access authentication.</li>
     * </ul>
     *
     * @property {string} fileName The path (optional) and filename of the file to upload if this
     * is a file upload request. If path is omitted, the file is read from the current working directory.
     * NOTE: There is no need to set this property directly since it will be set during the sendFile
     * function call (see <a href="#sendFile">sendFile</a>).
     *
     * @property {object} sendOptions This object contains any optional parameters that
     * are sent with the HTTP request.  This value should not be set directly.  Instead,
     * call the desired optional methods to set the request parameters (e.g.
     * addPostParameter, addRequestHeader, addHttpBody).
     */
    var GDHttpRequest = function() {
        this.method = null;
        this.url = null;
        this.timeout = -1;
        this.isAsync = false;
        this.user = null;
        this.password = null;
        this.auth = null;
        this.isIncremental = false;
        this.disableHostVerification = false;
        this.disableFollowLocation = false;
        this.disablePeerVerification = false;
        this.disableCookieHandling = false;
        this.cookieState = null;
        this.host = null;
        this.port = -1;
        this.proxyUser = null;
        this.proxyPassword = null;
        this.proxyAuth = null;
        this.fileName = null;
        this.sendOptions = { "RequestHeaders": null, "PostParameters": null, "HttpBody": null };
        this.requestTag = null;
    };

    // ***** BEGIN: MODULE METHOD DEFINITIONS - GDHttpRequest *****

    /**
     * @function GDHttpRequest#createRequest
     *
     * @description Call this function to create the HTTP request, and set the main parameters.
     * NOTE: This function only initializes the HTTP parameters; it does not initiate
     * data transfer (see send).
     *
     * @param {string} method Case-sensitive string containing the HTTP method, which
     * will be sent to the server. Typical values are: "GET", "POST", "HEAD",
     * "OPTIONS", "TRACE", "PUT", "CONNECT". Any other value is sent as a custom
     * method.
     *
     * @param {string} url Uniform Resource Locator (URL) that will be requested. The
     * URL must be fully qualified, including a scheme, domain, and path. For
     * example: "http://www.example.com/index.html".
     *
     * @param {number} timeout Length of time out in seconds, or 0 (zero) for never.
     * A negative timeout number will allow this request to use the default timeout
     * value (30 seconds).
     *
     * @param {boolean} isAsync Set this value to true to make asynchronous calls.
     *
     * @param {string} user Authentication username. For Kerberos, this is in the
     * user@realm format.
     *
     * @param {string} password Authentication password.
     *
     * @param {string} auth The authentication scheme.  Valid values are:
     * <ul>
     *	<li>"NTLM" to use NTLM authentication</li>
     *	<li>"DIGEST" to use Digest Access authentication</li>
     *	<li>"NEGOTIATE" to use negotiated Kerberos authentication</li>
     *	<li>"BASIC" or a null pointer to use Basic Access authentication.</li>
     * </ul>
     *
     * @param {boolean} isIncremental Determine if the response from an aysnchronous HTTP request
     * should be processed incrementally (as soon as data is received), or if the entire
     * request should be returned within a single response.
     *
     * @return {GDHttpRequest} The newly created request object.
     */
    GDHttpRequest.prototype.createRequest = function(method, url, timeout, isAsync, user, password, auth, authDomain, isIncremental) {
        var result = new GDHttpRequest();
        result.method = method;
        result.url = url;
        result.timeout = (timeout === null || timeout === "") ? -1 : timeout;
        result.isAsync = isAsync;
        result.user = user;
        result.password = password;
        result.auth = auth;
        result.authDomain = authDomain;
        if (typeof isIncremental === "undefined")
            result.isIncremental = false;
        else
            result.isIncremental = isIncremental;

        return result;
    };

    /**
     * @function GDHttpRequest#clearCookies
     *
     * @description Clear cookies that were automatically stored. Cookies can be cleared from
     * memory only, or from the persistent cookie store too. If cleared from memory only,
     * cookies will still be reloaded from the persistent cookie store when the application
     * is next launched.  This function is most useful when automatic cookie handling is
     * enabled (i.e. GDHttpRequest.disableCookieHandling = false).
     *
     * @param {boolean} includePersistentStore When this value is set to true, then all
     * cookies are cleared from memory and the persistent cookie storage file.  When
     * this value is false, then all cookies are cleared from memory only.
     */
    GDHttpRequest.prototype.clearCookies = function(includePersistentStore) {
        if (includePersistentStore === true)
            this.cookieState = "persistent";
        else
            this.cookieState = "memory";
    };

    /**
     * @function GDHttpRequest#enableHttpProxy
     *
     * @description Call this function to configure an HTTP proxy address and credentials,
     * and enable connection through the proxy.  The proxy server can be located behind the
     * enterprise firewall. In this case its address must be registered in the enterprise's
     * Good Control (GC) console. Registration would usually be as a enterprise management console additional server.
     * <a href="https://begood.good.com/community/gdn">See the Good Control overview for
     * application developers</a>.  Certificate authenticity verification while using a proxy
     * is not currently supported. When making HTTPS requests through a proxy, SSL/TLS
     * certificate verification must be disabled, see the disablePeerVerification function.
     * This function should be called before <a href="#send">GDHttpRequest.send</a> or
     * <a href="#sendFile">GDHttpRequest.sendFile</a> has been called.
     *
     * @param {string} host The address of the proxy. Can be either an Internet Protocol
     * address (IP address, for example "192.168.1.10"), or a fully qualified domain name
     * (for example "www.example.com").
     *
     * @param {number} port Number of the port on the proxy to which connection will be made.
     *
     * @param {string} user The proxy authentication username.
     *
     * @param {string} password The proxy authentication password.
     *
     *
     * @param {string} auth The proxy authentication scheme.  Valid values are:
     * <ul>
     *	<li>"NTLM" to use NTLM authentication</li>
     *	<li>"DIGEST" to use Digest Access authentication</li>
     *	<li>"BASIC" or a null pointer to use Basic Access authentication.</li>
     * </ul>
     */
    GDHttpRequest.prototype.enableHttpProxy = function(host, port, user, password, auth) {
        this.host = host;
        this.port = port;
        this.proxyUser = user;
        this.proxyPassword = password;
        this.proxyAuth = auth;
    };

    /**
     * @function GDHttpRequest#disableHttpProxy
     *
     * @description Call this function to disable connection through an HTTP proxy.
     * This function should be called before <a href="#send">GDHttpRequest.send</a>
     * or <a href="#sendFile">GDHttpRequest.sendFile</a> has been called.
     */
    GDHttpRequest.prototype.disableHttpProxy = function() {
        this.host = null;
        this.port = -1;
        this.proxyUser = null;
        this.proxyPassword = null;
        this.proxyAuth = null;
    };

    /**
     * @function GDHttpRequest#addRequestHeader
     *
     * @description Call this function to add a Header Field to the HTTP request. This
     * is for standard HTTP Header Fields such as "Authorization".  This function can
     * be called zero or more times, since not all HTTP requests will require headers to
     * be added by the application.  If a header key is added multiple times, only the
     * last stored value will be maintained (e.g. duplicate keys are not allowed).
     * @param {string} key The HTTP Header Field to be added.
     * @param {string} value The header field's value.
     */
    GDHttpRequest.prototype.addRequestHeader = function(key, value) {
        if (typeof this.sendOptions.RequestHeaders === 'undefined' || this.sendOptions.RequestHeaders === null)
            this.sendOptions.RequestHeaders = {};

        this.sendOptions.RequestHeaders[key] = value;
    };

    /**
     * @function GDHttpRequest#clearRequestHeaders
     *
     * @description Call this function to remove all name/value request headers that
     * were added through a call to addRequestHeader.
     */
    GDHttpRequest.prototype.clearRequestHeaders = function() {
        this.sendOptions.RequestHeaders = null;
    };

    /**
     * @function GDHttpRequest#addPostParameter
     *
     * @description Call this function to add a name/value pair to the HTTP request.
     * The request method must be "POST". Multiple name/value pairs can be added, by
     * calling this function multiple times.  When the request is sent, name/value pairs
     * will be encoded in the request body in a way that is compatible with HTML form
     * submission. No other body data can be passed in the send call.
     *
     * @param {string} key The name associated with the value.
     * @param {string} value The value to be set.
     */
    GDHttpRequest.prototype.addPostParameter = function(key, value) {
        if (typeof this.sendOptions.PostParameters === 'undefined' || this.sendOptions.PostParameters === null)
            this.sendOptions.PostParameters = [];

        var entry = {};
        entry[key] = value;
        this.sendOptions.PostParameters.push(entry);
    };

    /**
     * @function GDHttpRequest#clearPostParameters
     *
     * @description Call this function to remove all name/value post variables from the HTTP
     * request. Name/value pairs would have been added with the addPostParameter function.
     * This function need only be called if it is required to clear name/value pairs before
     * sending.
     */
    GDHttpRequest.prototype.clearPostParameters = function() {
        this.sendOptions.PostParameters = null;
    };

    /**
     * @function GDHttpRequest#addHttpBody
     *
     * @description Call this function to add an httpBody to a post request, the body will take
     * the place of any post parameters
     *
     * @param {string} body the http body to be sent
     */
    GDHttpRequest.prototype.addHttpBody = function(body) {
        this.sendOptions.HttpBody = body;
    };

    /**
     * @function GDHttpRequest#clearHttpBody
     *
     * @description Call this function to clear the httpBody of a request
     *
     */
    GDHttpRequest.prototype.clearHttpBody = function() {
        this.sendOptions.HttpBody = null;
    };

    /**
     * @function GDHttpRequest#parseHttpResponse
     *
     * @description Call this function to transform the HTTP response text into a
     * GDHttpResponse object.
     *
     * @param {string} responseText A string representing the HTTP response text.
     *
     * @return {GDHttpResponse} The HTTP response object.
     */
    GDHttpRequest.prototype.parseHttpResponse = function(responseText) {
        return new GDHttpResponse(responseText);
    };

    /**
     * @function GDHttpRequest#send
     * @description Send the HTTP request with it's associated parameters.
     * @param {function} success Callback function to invoke upon successful completion of the request.
     * @param {function} fail Callback function to invoke if the request cannot be completed.
     *
     * @example
     * <pre class="prettyprint"><code>
     * var data_json_url = "http://servername.dev.company.com:8082/data.json";
     * var poster_url = "http://servername.dev.company.com:8082/httpposter/load";
     * var MaxTestDuration = 10 * 1000; // In milliseconds.
     * var gTestTimeoutID = null;
     * var aRequest;
     *
     * function myHTTPRequest(){
     * var method = "POST";
     * var url = data_json_url;
     * var timeout = 30;
     * var isAsync = false;
     * var user = null;
     * var password = null;
     * var auth = null;
     * var isIncremental = true;
     * var requestBody = {key: "value"};
     *
     * //-- createRequest
     * aRequest = window.plugins.GDHttpRequest.createRequest(method, url, timeout, isAsync, user, password, auth, isIncremental);
     *
     * //-- clearCookies in memory
     * aRequest.clearCookies(false);
     *
     * //-- clearCookies in memory and the persistent cookie storage file
     * aRequest.clearCookies(true);
     *
     * //-- enableHttpProxy & disableHttpProxy
     * var host = "some_host.com", port = 8080;
     * user = "some_user";
     * password = "some_pwd";
     * aRequest.enableHttpProxy(host, port, user, password, auth);
     * aRequest.disableHttpProxy();
     *
     * //-- addRequestHeader
     * var headerName = "customHeader", headerValue = "customValue";
     * aRequest.addRequestHeader(headerName, headerValue);
     *
     * //-- addHttpBody & clearHttpBody
     * aRequest.addHttpBody(JSON.stringify(requestBody));
     * aRequest.clearHttpBody();
     *
     * //-- addPostParameter & clearPostParameters
     * var postName = "someName", postValue = "some value";
     * aRequest.addPostParameter(postName, postValue);
     * aRequest.clearPostParameters();
     *
     * //-- send
     * function sendSuccess(response) {
     *  console.log("Received valid response from the send request");
     *  try {
     *      //-- parseHttpResponse
     *      var responseObj = window.plugins.GDHttpRequest.parseHttpResponse(response);
     *      console.log(responseObj.responseText);
     *  } catch(e) {
     *      console.log("Invalid response object returned from call to send.");
     *  }
     *  };
     *
     * function sendFail() {
     *  console.log("The send request resulted in an error.");
     * }
     *
     * aRequest.send(sendSuccess,sendFail);
     * }
     *
     * </code></pre>
     *
     *
     *
     */
    GDHttpRequest.prototype.send = function(success, fail) {
        this.sendRequest(success, fail);
    };

    /**
     * @function GDHttpRequest#sendFile
     * @description Call this function to upload a file using the HTTP request object.  NOTE: this method does not
     * support asynchronous operations.  The HTTP request's method can be "PUT" or a custom method. This function
     * causes the HTTP request to be sent, similarly to the send function, above. The body of the request will be
     * the contents of the specified file.  The file will not be deleted after it is uploaded. Uploading directly
     * from the BlackBerry Dynamics secure file system is supported.
     *
     * @param {string} fileName The path (optional) and filename of the file to upload. If path is omitted, the file
     * is read from the application documents directory.
     *
     * @param {function} success Callback function to invoke upon successful completion of the request.
     *
     * @param {function} fail Callback function to invoke if the request cannot be completed.
     *
     *
     */
    GDHttpRequest.prototype.sendFile = function(fileName, success, fail) {
        if (typeof fileName === 'Object' || typeof fileName === 'undefined') {
            console.log("ERROR: invalid fileName passed to sendFile.");
            this.fileName = null;
        } else
            this.fileName = fileName;

        this.sendRequest(success, fail);
    };

    /* (Private function)
     * @function GDHttpRequest#sendRequest
     * @description Send the HTTP request with it's associated parameters.
     * @param {function} success Callback function to invoke upon successful completion of the request.
     * @param {function} fail Callback function to invoke if the request cannot be completed.
     *
     *
     */
    GDHttpRequest.prototype.sendRequest = function(success, fail) {
        /**
         * The properties of the GDHttpRequest object are passed to the native iOS code as an
         * array of string values in the following order:
         * [method, url, isAsync, user, password, auth, disableHostVerification,
         *  disableFollowLocation, disablePeerVerification, disableCookieHandling].
         */

        if (this.method === null || typeof this.method === 'undefined') {
            console.log("ERROR: No method passed to sendRequest.");
            return;
        }

        if (this.method === null || typeof this.method === 'undefined') {
            console.log("ERROR: No url passed to sendRequest.");
            return;
        }

        var lAsync = (this.isAsync === false) ? "false" : "true";
        var lIsIncremental = (this.isIncremental === true) ? "true" : "false";
        var lHost = (this.disableHostVerification === false) ? "false" : "true";
        var lFollow = (this.disableFollowLocation === false) ? "false" : "true";
        var lPeer = (this.disablePeerVerification === false) ? "false" : "true";
        var lCookie = (this.disableCookieHandling === false) ? "false" : "true";

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        this.requestTag = guid();

        var parms = [this.method,
            this.url,
            this.timeout.toString(),
            lAsync,
            this.user,
            this.password,
            this.auth,
            lIsIncremental,
            lHost,
            lFollow,
            lPeer,
            lCookie,
            this.cookieState,
            this.host,
            this.port.toString(),
            this.proxyUser,
            this.proxyPassword,
            this.proxyAuth,
            this.fileName,
            this.sendOptions,
            this.requestTag
        ];
        cordovaExec(success, fail, "GDHttpRequest", "send", parms);
    };

    GDHttpRequest.prototype.abort = function() {
        var lAsync = (this.isAsync === false) ? "false" : "true";
        cordovaExec(function() {}, function() {}, "GDHttpRequest", "abort", [lAsync, this.requestTag]);
    }

    /**
     * @function GDHttpRequest#enableClientCertAuthOnUIWebView
     *
     * @description This method enables certificate-based authentication for XMLHttpRequest.
     * It has to be called at first place when 'ondeviceready' event occures to connect to WebView.
     * In case of HTTPS your SSL/TLS self-signed cervificate from your server endpoint
     * should be trusted on your device.
     * Please note that this call should be done only once per UIWebView.
     *
     * @example
     * <pre class="prettyprint"><code>
     * window.plugins.GDHttpRequest.enableClientCertAuthOnUIWebView();
     *
     * var url = 'https://your/server/endpoint'; // here should be your server endpiont that requires certificate-based auth
     * var xhr = new XMLHttpRequest();
     * xhr.open("GET", url);
     *
     * xhr.onreadystatechange = function () {
     *     if (xhr.readyState == 4) {
     *
     *         if (xhr.status === 200) {
     *             alert(xhr.responseText)
     *         } else {
     *             alert("Error", xhr)
     *         }
     *     }
     * };
     *
     * xhr.send();
     * </code></pre>
     */
    GDHttpRequest.prototype.enableClientCertAuthOnUIWebView = function() {
        var lAsync = (this.isAsync === false) ? "false" : "true";
        cordovaExec(function() {},
            function() {},
            "GDHttpRequest",
            "enableClientCertAuthOnUIWebView", [lAsync, this.requestTag]);
    };

    // ***** END: MODULE METHOD DEFINITIONS - GDHttpRequest *****

    // Install the plugin.
    module.exports = new GDHttpRequest();
}()); // End the Module Definition.
//************************************************************************************************