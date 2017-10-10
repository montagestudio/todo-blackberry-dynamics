/**
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  /**
   * @class GDProgressEvent
   *
   * @classdesc Is responsible for progress event
   * @property {String} type Type of file being processed
   * @property {Boolean} bubbles false
   * @property {Boolean} cancelBubble false
   * @property {Boolean} cancelable false
   * @property {Boolean} lengthComputable Property that shows if length of file can be computed or not
   * @property {Number} loaded Number of loaded bites at the moment
   * @property {Number} total Total number of bites
   * @property {GDFile} target File being processed
   *
   * @example
   * // This ojbect is used by other classes and is not used directly
   * var fileTransfer = new FileTransfer();
   *
   * fileTransfer.onprogress = function(progressEvent) {
   *     if (progressEvent.lengthComputable) {
   *         var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
   *         console.log(perc + '%');
   *     }
   * };
   */

  var GDProgressEvent = (function() {
    return function ProgressEvent(type, dict) {
      this.type = type;
      this.bubbles = false;
      this.cancelBubble = false;
      this.cancelable = false;
      this.lengthComputable = false;
      this.loaded = dict && dict.loaded ? dict.loaded : 0;
      this.total = dict && dict.total ? dict.total : 0;
      this.target = dict && dict.target ? dict.target : null;
    };
  })();
  
  ProgressEvent = GDProgressEvent;
  
  module.exports = ProgressEvent;
})();

// End the Module Definition.
//************************************************************************************************
