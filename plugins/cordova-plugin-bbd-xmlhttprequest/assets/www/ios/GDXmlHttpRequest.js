/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
	var cordovaExec = require('cordova/exec');

  if (typeof XMLHttpRequest.prototype.__open !== "function")
  {
    XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function()
    {
        this.__open.apply(this, arguments);
        if (arguments.length >= 5)
        {
            var _user = arguments[3];
            var _pass = arguments[4];
            if (typeof _user != "string")
            {
                console.error("\"user\" param must have a string type");
                return;
            }
            if (typeof _pass != "string")
            {
                console.error ("\"user\" param must have a string type");
                return;
            }
            this.setRequestHeader.apply(this, ["Authorization", "Basic " + btoa(_user + ":" + _pass)]);
        }
    }
  }

	module.exports = XMLHttpRequest;
}());

// End XMLHttpRequest.js
//*****************************************************************  //leave empty line after

