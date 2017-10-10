/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
  var cordovaExec = require('cordova/exec');

  /**
   * @class GDInterAppCommunication
   *
   * @classdesc The GDInterAppCommunication is used to return information about a service provider
   * application.
   *
   */
  var GDInterAppCommunication = function() {};

  // ***** BEGIN: MODULE METHOD DEFINITIONS - GDInterAppCommunication *****

  /** @function GDInterAppCommunication#getGDAppDetails
   *
   * @description This method check for apps installed on device
   *
   * @param {string} id Service ID.
   *
   * @param {string} version Service version
   *
   * @param {function} onSuccess Callback function to invoke when the function returns successfully.
   *
   * @param {function} onError Callback function to invoke for error conditions.
   *
   * @example
   * function success(result) {
   *     alert("Recieved details: " + result);
   * };
   *
   * function fail(result) {
   *     alert("An error occurred while recieving the application details: " + result);
   * };
   *
   *
   * function getGDAppDetails(){
   *    window.plugins.GDInterAppCommunication.getGDAppDetails("", "", success, fail);
   * };
   *
   */

  GDInterAppCommunication.prototype.getGDAppDetails = function(serviceId, version, onSuccess, onError) {
    if(serviceId === null || typeof serviceId === 'undefined') {
      console.log("Null serviceId passed to GDInterAppCommunication.getGDAppDetails.");
      return;
    }

    if(typeof onSuccess !== 'function') {
      console.log("ERROR in GDInterAppCommunication.getGDAppDetails: onSuccess parameter is not a function.");
      return;
    }

    var success = function (res) {
        var result = JSON.parse(res);
        onSuccess(result);
    };

    var parms = [serviceId, version];
    cordovaExec(success, onError, "GDInterAppCommunication", "getGDAppDetails", parms);
  };

  // ***** END: MODULE METHOD DEFINITIONS - GDInterAppCommunication *****

  // Install the plugin.
  module.exports = new GDInterAppCommunication();
}());	// End the Module Definition.
//************************************************************************************************
