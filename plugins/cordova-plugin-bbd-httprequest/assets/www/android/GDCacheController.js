/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
	var cordovaExec = require('cordova/exec');

	/**
	 * @class GDCacheController
	 * @classdesc Use this class to control the secure authentication caches of the
	 * GDURLLoadingSystem and GDHttpRequest classes. (Currently, there are only two controls.)
	 * The secure authentication cache is used by these classes as follows:<br/>
	 * <br/>
	 * <b>GD URL Loading System</b>
	 * <ul>
	 *     <li>Stores credentials for all authentication methods.</li>
	 *     <li>Stores tickets for Kerberos authentication.</li>
	 * </ul>
	 * <b>GD HTTP Request</b>
	 * <ul>
	 *     <li>Stores tickets for Kerberos authentication.</li>
	 * </ul>
	 */
	var GDCacheController = function() {};

	// ***** BEGIN: MODULE METHOD DEFINITIONS - GDCacheController *****

	/**
	 * @function GDCacheController#clearCredentialsForMethod
	 *
	 * @description Call this function to clear the cached credentials for a
	 * particular authentication method, or to clear for all methods. Calling this
	 * function clears the session cache, and the permanent cache if present.
	 * (Currently, the BlackBerry Dynamics client library only has a permanent cache for
	 * Kerberos authentication tickets.)
	 *
	 * @param {string} method One of the following constants, specifying which cache
	 * or caches are to be cleared:
	 * <ul>
	 *	<li>"HTTPBasic" clears Basic Authentication credentials</li>
	 *	<li>"Default" also clears Basic Authentication credentials</li>
	 *	<li>"HTTPDigest" clears Digest Authentication credentials</li>
	 *	<li>"NTLM" clears Kerberos Authentication credentials and tickets</li>
	 *	<li>"Negotiate" clears Kerberos Authentication credentials and tickets</li>
	 *	<li>"All" clears all of the above</li>
	 * </ul>
	 *
	 * @param {function} success Callback function to invoke upon successful completion of the request.
	 * @param {function} fail Callback function to invoke if the request cannot be completed.
	 *
	 * @example
	 * <pre class="prettyprint"><code>
	 * function gdccOnSuccess(response) {
     *  console.log("The function call succeeded.");
	 * };
     *
	 * function gdccOnError(response) {
     *   console.log("The function call failed: " + response);
     * };
     *
     * function clearCredential(){
     *  var method = "HTTPDigest";
     *  try {
     *      window.plugins.GDCacheController.clearCredentialsForMethod(method, gdccOnSuccess, gdccOnError);
     *  } catch(e) {
     *      console.log("A try catch error was caught on GDCacheController.clearCredentialsForMethod");
     *  };
     * }
     *  </code></pre>
	 */
	GDCacheController.prototype.clearCredentialsForMethod = function(method, success, fail) {
		switch(method) {
		case "HTTPBasic":
		case "Default":
		case "HTTPDigest":
		case "NTLM":
		case "Negotiate":
		case "All":
			// Send it.
			cordovaExec(success, fail, "GDHttpRequest", "clearCredentialsForMethod", [method]);
			break;
		default:
			console.log("Invalid method passed to GDCacheController.clearCredentialsForMethod: " + method);
			break;
		}
	};

	/**
	 * @function GDCacheController#kerberosAllowDelegation
	 *
	 * @description Call this function to allow or disallow Kerberos delegation within BlackBerry Dynamics
	 * secure communications. By default, Kerberos delegation is not allowed.  When Kerberos delegation
	 * is allowed, the BlackBerry Dynamics run-time behaves as follows:
	 *
	 * <ul>
	 *	<li>Kerberos requests will be for tickets that can be delegated.</li>
	 *	<li>Application servers that are trusted for delegation can be sent tickets that can be
	 *      delegated, if such tickets were issued.</li>
	 * </ul>
	 *
	 * When Kerberos delegation is not allowed, the BlackBerry Dynamics run-time behaves as follows:
	 *
	 * <ul>
	 *	<li>Kerberos requests will not be for tickets that can be delegated.</li>
	 *	<li>No application server will be sent tickets that can be delegated, even if such tickets were issued.</li>
	 * </ul>
	 *
	 * After this function has been called, delegation will remain allowed or disallowed until this function is
	 * called again with a different setting.  When this function is called, the Kerberos ticket and credentials
	 * caches will be cleared. I.e. there is an effective call to the clearCredentialsForMethod: function with an
	 * NSURLAuthenticationMethodNegotiate parameter.  Note: User and service configuration in the Kerberos Domain
	 * Controller (typically a Microsoft Active Directory server) is required in order for delegation to be
	 * successful. On its own, calling this function will not make Kerberos delegation work in the whole end-to-end
	 * application.
	 *
	 * @param {boolean} allow true to allow delegation, false to disallow.
	 * @param {function} success Callback function to invoke upon successful completion of the request.
	 * @param {function} fail Callback function to invoke if the request cannot be completed.
	 *
	 * @example
	 * <pre class="prettyprint"><code>
	 * function gdccOnSuccess(response) {
     *  console.log("The function call succeeded.");
	 * };
	 *
	 * function gdccOnError(response) {
     *  console.log("The function call failed: " + response);
	 * };
	 *
	 * function clearCredential(){
     *  try {
     *      window.plugins.GDCacheController.kerberosAllowDelegation(true, gdccOnSuccess, gdccOnError);
     *  } catch(e) {
     *       console.log("A try catch error was caught on GDCacheController.kerberosAllowDelegation");
     *  };
	 * }
	 * </code></pre>
	 *
	 *
	 */
	GDCacheController.prototype.kerberosAllowDelegation = function(allow, success, fail) {
		if(allow === true || allow === false)
			cordovaExec(success, fail, "GDHttpRequest", "kerberosAllowDelegation", [allow]);
		else
			console.log("Invalid boolean value passed to GDCacheController.kerberosAllowDelegation. Type: " + typeof allow);
	};

	// Install plugin
	module.exports = new GDCacheController();
	// ***** END: MODULE METHOD DEFINITIONS - GDCacheController *****
})();
