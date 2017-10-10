/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
  //************************************* GDFile **********************//
  /**
   * @class GDFile
   * @classdesc This object contains attributes of a single file.
   * @property {string} name  Name of the file, without path information
   * @property {string} fullPath The full path of the file, including the name
   * @property {string} type Mime type
   * @property {date} lastModifiedDate Last modified date
   * @property {number} size Size of the file in bytes
   *
   * @example
   * // This ojbect is used by GDFileEntry.file() method to initilize the file and is not used directly
   */
  var GDFile = function(name, fullPath, type, lastModifiedDate, size) {
  	this.name = name || '';
  	this.fullPath = fullPath || null;
  	this.type = type || null;
  	this.lastModifiedDate = lastModifiedDate || null;
  	this.size = size || 0;
  };

  File = GDFile;

  module.exports = File;
})();
