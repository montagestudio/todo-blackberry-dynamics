/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  var cordovaExec = require('cordova/exec');
  var DirectoryEntry = require('cordova-plugin-bbd-storage.DirectoryEntry');
  var FileError = require('cordova-plugin-bbd-storage.FileError');

  //**************GDFileSystem****************//
  /**
   * @class GDFileSystem
   * @classdesc An interface representing a secure file system
   * @property {string} name the unique name of the file system (readonly)
   * @property {DirectoryEntry} root directory of the file system (readonly)
   */
  var GDFileSystem = function(name, root) {
	  this.name = name || null;
	  this.root = new DirectoryEntry("GDDocuments", "/", this);
  };

  /**
   * @function GDFileSystem#exportLogFileToDocumentsFolder
   * @description Call this function to create a dump of BlackBerry Dynamics activity logs.
   * The logs will be dumped to a file that is outside the secure store, in the Documents folder.
   * The file will not be encrypted.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     fileSystem.exportLogFileToDocumentsFolder(function() {
   *         console.log("Logs are imported to the Documents folder");
   *     }, null);
   * }, null);
   */
  GDFileSystem.prototype.exportLogFileToDocumentsFolder = function(successCallback, errorCallback) {
	  var win = typeof successCallback !== 'function' ? null : function(result) {
		  successCallback();
	  };
	  var fail = typeof errorCallback !== 'function' ? null : function(code) {
		  errorCallback(new FileError(code));
	  };
	  cordovaExec(win, fail, "GDStorage", "exportLogFileToDocumentsFolder", []);
  };

  /**
   * @function GDFileSystem#uploadLogs
   * @description Call this function to upload BlackBerry Dynamics activity logs for support purposes.
   * The logs will be uploaded to a server in the BlackBerry Technology Network Operation Center (NOC).
   * Upload takes place in background and is retried as necessary.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     fileSystem.uploadLogs(function() {
   *         console.log("Logs are imported to the server");
   *     }, null);
   * }, null);
   */
  GDFileSystem.prototype.uploadLogs = function(successCallback, errorCallback) {
	  var win = typeof successCallback !== 'function' ? null : function(result) {
		  successCallback();
	  };
	  var fail = typeof errorCallback !== 'function' ? null : function(code) {
		  errorCallback(new FileError(code));
	  };
	  cordovaExec(win, fail, "GDStorage", "uploadLogs", []);
  };

  FileSystem = GDFileSystem;

  module.exports = FileSystem;
})();
