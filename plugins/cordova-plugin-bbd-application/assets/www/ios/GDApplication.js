/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
	var cordovaExec = require('cordova/exec');

	/**
	 * @class GDApplication
	 *
	 * @classdesc The GD Application object provides access to information that is globally available to
	 * any BlackBerry Dynamics Application.
	 */
	var GDApplication = function() {};

	// ***** BEGIN: MODULE METHOD DEFINITIONS - GDApplication *****

	/**
	 * @function GDApplication#getApplicationConfig
	 *
	 * @description This function returns a collection of configuration settings. The settings will have
	 * been entered in the Good Control (GC) console, and retrieved by the BlackBerry Dynamics run-time.
	 *
	 * @param {function} onSuccess Callback function to invoke when the function returns successfully.
	 *
	 * @param {function} onError Callback function to invoke for error conditions.
	 *
	 * @return A JSON string representing a configuration dictionary of name/value pairs.  Use
	 * the JSON.parse function to transform the data into a JavaScript object.
	 * <table border="1" style="border-spacing:0px;">
	 * <tr><th>Key Constant</th><th>Setting</th></tr>
	 * <tr>
	 *     <td>appHost</td>
	 *     <td>Application server address.  An application server address can be entered in the enterprise management console, in
	 *     the application management user interface.</td>
	 * </tr>
	 * <tr>
	 *     <td>appPort</td>
	 *     <td>Application server port number.  An application port number can also be entered in the enterprise management console,
	 *     in the application management user interface.</td>
	 * </tr>
	 * <tr>
	 *     <td>appConfig</td>
	 *     <td>Application-specific configuration data.  As well as the application server details, above, a free
	 *     text can also be entered in the enterprise management console. Whatever was entered is passed through and made available
	 *     to the application client here.</td>
	 * </tr>
	 * <tr>
	 *     <td>copyPasteOn</td>
	 *     <td>Data Leakage security policy indicator.  false means that enterprise security policies require that the
	 *     end user must be prevented from taking any action that is classified as data loss or data leakage in the
	 *     BlackBerry Dynamics Security Compliance Requirements document.  true means that the above policy is not in effect,
	 *     so the user is permitted to take those actions.</td>
	 * </tr>
	 * <tr>
	 *     <td>detailedLogsOn</td>
	 *     <td>Logging level.  0 means that the logging level is low, and only minimal logs should be written.  1
	 *     means that the logging level is high, and detailed logs should be written. Detailed logs facilitate
	 *     debugging of run-time issues.  The BlackBerry Dynamics run-time will automatically adjust its logging according
	 *     to the configured setting. The setting is present in the API so that the application can adjust its logging
	 *     consistently with the run-time.</td>
	 * </tr>
	 * <tr>
	 *     <td>userId</td>
	 *     <td>Enterprise e-mail address.  The end user will have entered their e-mail address in the enterprise
	 *     activation user interface when the application was run for the first time, during authorization processing.
	 *     This will be the same as the e-mail address to which the access key was sent when the user was provisioned
	 *     in the enterprise management console.</td>
	 * </tr>
	 * </table>
	 *
	 * @example
	 * <pre class="prettyprint"><code>
	 * function success(result) {
     * try {
     *      JSON.parse(result);
     *      console.log("Successfully parsed the configuration JSON format: " + result);
     *  } catch(e) {
     *       console.log("Unable to parse configuration JSON format: " + result);
     * }
     * };
     *
     * function fail(result) {
     *   console.log("An error occurred while retrieving the application configuration: " + result);
     * };
     *
     * function getApplicationConfiguration(){
     *   window.plugins.GDApplication.getApplicationConfig(success,fail);
     * };
	 * </code></pre>
	 *
	 *
	 *
	 */
	GDApplication.prototype.getApplicationConfig = function(onSuccess, onError) {
		if(typeof onSuccess !== 'function') {
			console.log("ERROR in GDApplication.getApplicationConfig: onSuccess parameter is not a function.");
			return;
		}

		cordovaExec(onSuccess, onError, "GDApplication", "getApplicationConfig", ["none"]);
	};

	/**
	 * @function GDApplication#getVersion
	 *
	 * @description This function returns a string containing the library version in major.minor.build format.
	 *
	 * @param {function} onSuccess Callback function to invoke when the function returns successfully.
	 *
	 * @param {function} onError Callback function to invoke for error conditions.
	 *
	 * @return String
	 *
	 * @example
	 * <pre class="prettyprint"><code>
	 *
	 * function success(result) {
     *   console.log("Retrieved the version data: " + result);
	 * };
	 *
	 * function fail(result) {
     *   console.log("An error occurred while retrieving the application version: " + result);
	 * };
	 *
	 *
	 * function getApplicationVersion(){
     * window.plugins.GDApplication.getVersion(success,fail);
	 * };
	 * </code></pre>
	 *
	 *
	 */
	GDApplication.prototype.getVersion = function(onSuccess, onError) {
		if(typeof onSuccess !== 'function') {
			console.log("ERROR in GDApplication.getVersion: onSuccess parameter is not a function.");
			return;
		}

		cordovaExec(onSuccess, onError, "GDApplication", "getVersion", ["none"]);
	};

	/**
	 * @function GDApplication#showPreferenceUI
	 *
	 * @description Call this function to show the BlackBerry Dynamics (GD) preferences user interface (UI). This is
	 * the UI in which the end user sets any options that are applied by the library directly, without reference
	 * to the application. This includes, for example, changing their security password.  This function enables
	 * the GD preferences UI to be included in the application's own user interface.
	 *
	 * @param {function} onSuccess Callback function to invoke when the function returns successfully.
	 *
	 * @param {function} onError Callback function to invoke for error conditions.
	 */
	GDApplication.prototype.showPreferenceUI = function(onSuccess, onError) {
		cordovaExec(onSuccess, onError, "GDApplication", "showPreferenceUI", ["none"]);
	};


	// ***** END: MODULE METHOD DEFINITIONS - GDApplication *****

	// Install the plugin.
	module.exports = new GDApplication();
}());	// End the Module Definition.
//************************************************************************************************

