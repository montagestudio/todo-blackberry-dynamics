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
   */
  var GDInterAppCommunication = function() {};

  // ***** BEGIN: MODULE METHOD DEFINITIONS - GDInterAppCommunication *****

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
}()); // End the Module Definition.
//************************************************************************************************
