/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
    var cordovaExec = require('cordova/exec');
    var ProgressEvent = require('cordova-plugin-bbd-storage.ProgressEvent');

    /**
     * This is helper oblect for storing XMLHttpRequest readyState property values
     */
    var readyStateObj = {
        'unsent': 0,
        'opened': 1,
        'headers_received': 2,
        'loading': 3,
        'done': 4
    };

    /**
     * @class XMLHttpRequest
     * @classdesc XMLHttpRequest is a JavaScript object that provides an easy way
     * to retrieve data from a URL without having to do a full page refresh.
     * A Web page can update just a part of the page without disrupting what the user is doing.
     * XMLHttpRequest is used heavily in AJAX programming.
     *
     * @property {string} method The HTTP method to use, such as "GET", "POST", "PUT", "DELETE".
     *
     * @property {string} url The URL to send the request to.
     *
     * @property {boolean} async An optional boolean parameter, defaulting to true, indicating whether or not to perform the operation asynchronously.
     * If this value is false, the send()method does not return until the response is received.
     * If true, notification of a completed transaction is provided using event listeners.
     * This must be true if the multipart attribute is true, or an exception will be thrown.
     *
     * @property {string} user The optional user name to use for authentication purposes; by default, this is an empty string.
     *
     * @property {string} password The optional password to use for authentication purposes; by default, this is an empty string.
     *
     * @property {string} onreadystatechange A JavaScript function object that is called whenever the readyState attribute changes.
     * The callback is called from the user interface thread.
     *
     * @property {number} readyState The state of the request. Possible values are:
     * 0 - when open() method has not been called yet
     * 1 - when send() methos has not been called yet
     * 2 - when send() method has been called, and headers and status are available
     * 3 - downloading; responseText holds partial data
     * 4 - operation is complete
     *
     * @property {string} response The response entity body according to responseType,
     * as an ArrayBuffer, Blob, Document, JavaScript object (for "json"), or string.
     * This is null if the request is not complete or was not successful.
     *
     * @property {string} responseText The response to the request as text, or null if the request was unsuccessful or has not yet been sent.
     *
     * @property {string} responseType Can be set to change the response type. Possible values are:
     * "" (empty string) - String (this is the default)
     * "document" - Document
     * "json" - JavaScript object, parsed from a JSON string returned by the server
     * "text" - String
     * "blob" - JavaScript object, parsed from readable stream of binary data responded by the server
     *
     * @property {string} responseXML The response to the request as a DOM Document object, or null if the request was unsuccessful, has not yet been sent, or cannot be parsed as XML or HTML.
     * The response is parsed as if it were a text/xml stream.
     * When the responseType is set to "document" and the request has been made asynchronously, the response is parsed as a text/html stream.
     *
     * @property {number} status The status of the response to the request. This is the HTTP result code (for example, status is 200 for a successful request).
     *
     * @property {string} statusText The response string returned by the HTTP server. Unlike status, this includes the entire text of the response message ("200 OK", for example).
     *
     * @property {string} timeout The number of milliseconds a request can take before automatically being terminated. A value of 0 (which is the default) means there is no timeout.
     *
     * @property {string} ontimeout A JavaScript function object that is called whenever the request times out.
     *
     * @property {string} upload The upload process can be tracked by adding an event listener to upload.
     *
     * @property {string} withCredentials Indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers.
     * The default is false.
     */

    window.GDXMLHttpRequest = function() {
        this.method = null;
        this.url = null;
        this.async = true;
        this.user = '';
        this.password = '';
        this.onreadystatechange = null;
        this.onload = null;
        this.readyState = readyStateObj.unsent;
        this.response = null;
        this.responseText = null;
        this.responseType = '';
        this.responseXML = null;
        this.status = null;
        this.statusText = null;
        this.timeout = 0;
        this.ontimeout = null;
        this.upload = {
            "ontimeout": null,
            "onprogress": null,
            "onloadstart": null,
            "onloadend": null,
            "onload": null,
            "onerror": null,
            "onabort": null
        };
        this.withCredentials = false;
        this.requestTag = null;
        this.sendOptions = { "RequestHeaders": null, "PostParameters": null, "HttpBody": null };
    };

    // ***** BEGIN: MODULE METHOD DEFINITIONS - XMLHttpRequest *****

    /**
     * @function XMLHttpRequest#open
     *
     * @description Initializes a request.
     * This method is to be used from JavaScript code; to initialize a request from native code.
     *
     * @param {string} method The HTTP method to use, such as "GET", "POST", "PUT", "DELETE".
     *
     * @param {string} url The URL to send the request to.
     *
     * @param {boolean} async An optional boolean parameter, defaulting to true, indicating whether or not to perform the operation asynchronously.
     * If this value is false, the send()method does not return until the response is received.
     * If true, notification of a completed transaction is provided using event listeners.
     * This must be true if the multipart attribute is true, or an exception will be thrown.
     *
     * @param {string} user The optional user name to use for authentication purposes; by default, this is an empty string.
     *
     * @param {string} password The optional password to use for authentication purposes; by default, this is an empty string.
     */

    GDXMLHttpRequest.prototype.open = function(method, url, optAsync, optUser, optPassword) {

        if (arguments.length == 0 || arguments.length == 1) {
            throw ({
                message: "TypeError: Failed to execute 'open' on 'XMLHttpRequest': 2 arguments required, but only " + arguments.length + " present."
            });
        }

        this.method = method;
        this.url = url;
        this.readyState = readyStateObj.opened;

        if (typeof optAsync === "undefined")
            this.async = true;
        else
            this.async = optAsync;

        if (typeof optUser === "undefined")
            this.user = '';
        else
            this.user = optUser;

        if (typeof optPassword === "undefined")
            this.password = '';
        else
            this.password = optPassword;

        return this;
    };

    /**
     * @function XMLHttpRequest#abort
     *
     * @description Aborts the request if it has already been sent.
     */

    GDXMLHttpRequest.prototype.abort = function() {
        var async = (this.async === false) ? "false" : "true";

        if (this.readyState == readyStateObj.unsent || this.readyState == readyStateObj.opened || this.readyState == this.done) {
            return false;
        }

        cordovaExec(function() {}, function() {}, "GDXMLHttpRequest", "abort", [async, this.requestTag]);
    };

    /**
     * @function XMLHttpRequest#send
     *
     * @description Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
     * If the request is synchronous, this method doesn't return until the response has arrived.
     * It takes optional parameter data.
     * Optional parameter data can contain following types of data:
     * ArrayBuffer
     * Document
     * DOMString
     * FormData - object with key/value pairs that can be passed to send method as parameter. User can append file from GDFileSystem by passing valid fullPath to this file as key/value
     */

    GDXMLHttpRequest.prototype.send = function(optData) {

        if (this.readyState != readyStateObj.opened) {
            throw ({
                message: "DOMException: Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED."
            });
        }

        if (optData) {
            if (typeof this.sendOptions.HttpBody === 'undefined' || this.sendOptions.HttpBody === null) {
                this.sendOptions.HttpBody = {};
            }

            if (typeof optData === 'string') {
                this.sendOptions.HttpBody = optData;
            } else if (optData instanceof ArrayBuffer) {
                this.sendOptions.HttpBody = fromArrayBuffer(optData);
            } else if (optData instanceof GDFormData) {
                var boundary = "---------------------------" + uniqueStr();
                var body = '--' + boundary + '\r\n';
                // set request header Content-Type: multipart/form-data
                this.setRequestHeader("Content-Type", "multipart/form-data");
                this.setRequestHeader("Content-Type", "boundary=" + boundary);

                // prepare HTTP Body
                for (var key in optData) {
                    if (optData.hasOwnProperty(key)) {
                        // if user appended file from GDFileSystem by passing valid fullPath to this file as parameter
                        if (optData[key].indexOf("file:///data/") > -1) {
                            body = body + 'Content-Disposition: form-data; name="' + key + '"; ' + 'filename="' + optData[key] + '"' + '\n' + 'Content-Type: text/plain' + '\n\n\n--' + boundary + '\r\n';
                        } else {
                            body = body + 'Content-Disposition: form-data; name="' + key + '"' + '\n\n' + optData[key] + '\n--' + boundary + '\r\n';
                        }
                    }
                }
                this.sendOptions.HttpBody = body;
            }
        }

        this.requestTag = guid();

        var parms = [
            this.method,
            this.url,
            this.async,
            this.user,
            this.password,
            this.timeout,
            this.withCredentials,
            this.responseType,
            this.requestTag,
            this.sendOptions
        ];

        var that = this;

        function successCallback(data) {
            var obj = JSON.parse(data);
            var escapedJson = {};

            for (var i in obj) {
                escapedJson[i] = unescape(obj[i]);
            }

            // handling upload
            // handling upload progress
            if (escapedJson.lengthComputable && escapedJson.total && escapedJson.loaded) {
                // If onloadstart callback
                if (typeof that.upload.onloadstart === "function") {
                    that.upload.onloadstart.call(that, new ProgressEvent("loadstart", { target: escapedJson }));
                }
                // If onload callback
                if (typeof that.upload.onload === "function") {
                    that.upload.onload.call(that, new ProgressEvent("load", { target: escapedJson }));
                }
                // If onprogress callback
                if (escapedJson.lengthComputable == 100) {
                    //If onloadend callback
                    if (typeof that.upload.onloadend === "function") {
                        that.upload.onloadend.call(that, new ProgressEvent("loadend", { target: escapedJson }));
                    }
                } else {
                    if (typeof that.upload.onprogress === "function") {
                        that.upload.onprogress.call(that, new ProgressEvent("progress", { target: escapedJson }));
                    }
                }
                // If ontimeout callback
                if (typeof that.upload.ontimeout === "function") {
                    that.upload.ontimeout.call(that, new ProgressEvent("timeout", { target: escapedJson }));
                }
                // If onerror callback
                if (typeof that.upload.onerror === "function") {
                    that.upload.onerror.call(that, new ProgressEvent("error", { target: escapedJson }));
                }
                // If onabort callback
                if (typeof that.upload.onabort === "function") {
                    that.upload.onabort.call(that, new ProgressEvent("abort", { target: escapedJson }));
                }
                return;
            }

            // handling response... if request was aborted or failed on timeout
            if (escapedJson.isAborted == "true" || escapedJson.isTimeout == "true") {
                that.statusText = "";
                that.status = 0;
                that.response = "";
                that.responseType = "";
                that.responseXML = null;
                that.responseText = "";
                that.readyState = readyStateObj.done;
            } else {
                that.headers = escapedJson.headers;

                that.readyState = readyStateObj.headers_received;
                if (typeof that.onreadystatechange === "function") {
                    that.onreadystatechange.call(that);
                }

                that.readyState = readyStateObj.loading;
                if (typeof that.onreadystatechange === "function") {
                    that.onreadystatechange.call(that);
                }

                that.responseText = escapedJson.responseText.trim();
                that.status = parseInt(escapedJson.status, 10);
                that.statusText = escapedJson.statusText;
                that.readyState = readyStateObj.done;

                // handling response property
                var contentType = that.getResponseHeader("Content-Type");

                if (that.responseType === "" || that.responseType === "text") {
                    that.response = escapedJson.responseText.toString();
                } else if (that.responseType === "json") {
                    that.response = JSON.parse(escapedJson.responseText);
                } else if (that.responseType === "document") {
                    if (window.DOMParser) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(escapedJson.responseText, "text/xml");
                        var htmlDoc = parser.parseFromString(escapedJson.responseText, "text/html");

                        if (xmlDoc && xmlDoc instanceof Document) {
                            that.response = xmlDoc;
                            that.responseXML = escapedJson.responseText;
                        } else if (htmlDoc && htmlDoc instanceof HTMLDocument) {
                            that.response = htmlDoc;
                            that.responseXML = escapedJson.responseText;
                        } else {
                            that.responseXML = null;
                        }
                    }
                } else if (that.responseType === "blob") {
                    var contentType = that.getResponseHeader("Content-Type");

                    that.response = b64toBlob(escapedJson.responseBase64, contentType);
                }

                // handling responseXML property
                if (contentType != null && (contentType == "text/xml" || (contentType.indexOf('application/xml') > -1) || contentType == "text/html")) {
                    if (window.DOMParser) {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(escapedJson.responseText, "text/xml");
                        var htmlDoc = parser.parseFromString(escapedJson.responseText, "text/html");

                        if (xmlDoc || htmlDoc) {
                            that.responseXML = that.responseXML = (xmlDoc) ? xmlDoc : htmlDoc;
                        } else {
                            that.responseXML = null;
                        }
                    }
                }
            }

            if (escapedJson.isTimeout === "true" && typeof that.ontimeout === "function") {
                that.ontimeout.call(that);
            } else {
                if (typeof that.onreadystatechange === "function") {
                    that.onreadystatechange.call(that);
                }
                if (typeof that.onload === "function") {
                    that.onload.call(that);
                }
            }

        };

        this.readyState = readyStateObj.loading;

        cordovaExec(successCallback, null, "GDXMLHttpRequest", "send", parms);
    };

    /**
     * @function XMLHttpRequest#setRequestHeader
     *
     * @description Sets the value of an HTTP request header. You must call setRequestHeader() after open(), but before send().
     * If this method is called several times with the same header, the values are merged into one single request header.
     */

    GDXMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (arguments.length == 0 || arguments.length == 1) {
            throw ({
                message: "TypeError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': 2 arguments required, but only " + arguments.length + " present."
            });
        }

        if (typeof this.sendOptions.RequestHeaders === 'undefined' || this.sendOptions.RequestHeaders === null) {
            this.sendOptions.RequestHeaders = {};
        }

        if (this.sendOptions.RequestHeaders[header]) {
            this.sendOptions.RequestHeaders[header] = this.sendOptions.RequestHeaders[header] + '; ' + value;
        } else {
            this.sendOptions.RequestHeaders[header] = value;
        }
    };

    /**
     * @function XMLHttpRequest#getResponseHeader
     *
     * @description Returns the string containing the text of the specified header,
     * or null if either the response has not yet been received or the header doesn't exist in the response.
     */

    GDXMLHttpRequest.prototype.getResponseHeader = function(header) {
        if (arguments.length == 0) {
            throw ({
                message: "TypeError: Failed to execute 'getResponseHeader' on 'XMLHttpRequest': 1 argument required, but only 0 present."
            });
        }

        if (this.readyState == readyStateObj.done) {
            try {
                var headersArr = this.headers.split('\n'),
                    headersObj = {};

                for (var i = 0; i < headersArr.length; i++) {
                    var key = headersArr[i].slice(0, headersArr[i].indexOf(':')),
                        value = headersArr[i].slice(headersArr[i].indexOf(':') + 1, headersArr[i].length);

                    headersObj[key] = value;
                }

                var headers = Object.keys(headersObj);

                return headersObj[getMatchHeader(headers, header)];

            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * @function XMLHttpRequest#getAllResponseHeaders
     *
     * @description Returns all the response headers as a string, or null if no response has been received.
     * Note: For multipart requests, this returns the headers from the current part of the request, not from the original channel.
     */

    GDXMLHttpRequest.prototype.getAllResponseHeaders = function() {
        return (this.readyState == readyStateObj.done) ? this.headers : null;
    };

    /**
     * @function XMLHttpRequest#overrideMimeType
     *
     * @description Overrides the MIME type returned by the server.
     * This may be used, for example, to force a stream to be treated and parsed as text/xml, even if the server does not report it as such. This method must be called before send().
     */

    GDXMLHttpRequest.prototype.overrideMimeType = function(mimeType) {
        if (arguments.length == 0) {
            throw ({
                message: "TypeError: Failed to execute 'overrideMimeType' on 'XMLHttpRequest': 1 argument required, but only 0 present."
            });
        }

        if (this.readyState == readyStateObj.opened) {
            this.setRequestHeader("Content-Type", mimeType);
        }
    };


    // helper functions
    function getMatchHeader(headers, header) {
        for(var i = 0; i< headers.length; i++) {
            if(isMatch(headers[i], header))
                return headers[i];
        }
    }

    function isMatch(currentValue, value) {
        return currentValue.match(new RegExp(value, 'i'));
    }

    function fromArrayBuffer(arrayBuffer) {
        var array = new Uint8Array(arrayBuffer);

        return uint8ToBase64(array);
    };

    var b64_6bit = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        b64_12bit;

    function uint8ToBase64(rawData) {
        var numBytes = rawData.byteLength,
            output = "",
            segment,
            table = b64_12bitTable();

        for (var i = 0; i < numBytes - 2; i += 3) {
            segment = (rawData[i] << 16) + (rawData[i + 1] << 8) + rawData[i + 2];
            output += table[segment >> 12];
            output += table[segment & 0xfff];
        }
        if (numBytes - i == 2) {
            segment = (rawData[i] << 16) + (rawData[i + 1] << 8);
            output += table[segment >> 12];
            output += b64_6bit[(segment & 0xfff) >> 6];
            output += '=';
        } else if (numBytes - i == 1) {
            segment = (rawData[i] << 16);
            output += table[segment >> 12];
            output += '==';
        }

        return output;
    }

    function b64_12bitTable() {
        b64_12bit = [];

        for (var i = 0; i < 64; i++) {
            for (var j = 0; j < 64; j++) {
                b64_12bit[i * 64 + j] = b64_6bit[i] + b64_6bit[j];
            }
        }
        b64_12bitTable = function() {
            return b64_12bit; };

        return b64_12bit;
    };

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    function uniqueStr() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    };

    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data),
            byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize),
                byteNumbers = new Array(slice.length);

            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });

        return blob;
    };

    XMLHttpRequest = GDXMLHttpRequest;

    module.exports = XMLHttpRequest;
}());

// End XMLHttpRequest.js
//*****************************************************************  //leave empty line after
