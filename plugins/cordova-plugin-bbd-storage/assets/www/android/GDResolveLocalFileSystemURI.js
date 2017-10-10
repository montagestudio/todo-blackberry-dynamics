/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  var cordovaExec = require('cordova/exec');
  var FileEntry = require('cordova-plugin-bbd-storage.FileEntry');
  var DirectoryEntry = require('cordova-plugin-bbd-storage.DirectoryEntry');
  var FileError = require('cordova-plugin-bbd-storage.FileError');

  //***************************** resolveLocalFileSystemURI ********************************//

  /**
   * @class GDResolveLocalFileSystemURI
   *
   * @classdesc Wrapper for resolveLocalFileSystemURI method
   */

  /**
   * @function GDResolveLocalFileSystemURI#resolveLocalFileSystemURI
   * @description Look up file system Entry referred to by local URI.
   * @param {string}  uri URI referring to a local file or directory
   * @param {function} successCallback Invoked with Entry object corresponding to URI
   * @param {function} errorCallback Invoked if error occurs retrieving file system entry
   *
   * @example
   * resolveLocalFileSystemURI("file:///example.txt", function() {
   *     console.log(file.isFile); // true
   *     console.log(file.isDirectory); // false
   *     console.log(file.name); // "example.txt"
   *     console.log(file.fullPath); // "/example.txt"
   *     console.log(file.filesystem); // "/"
   * }, null);
   */

  var gdResolveLocalFileSystemURI = function(uri, successCallback, errorCallback) {
    // error callback
    var fail = function(error) {
      if (typeof errorCallback === 'function') {
        errorCallback(new FileError(error));
      }
    };
    // if successful, return either a file or directory entry
    var success = function(entry) {
      var result;
      var fs = new (require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');

      if (entry) {
        if (typeof successCallback === 'function') {
          // create appropriate Entry object
          result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath, fs) : new FileEntry(entry.name, entry.fullPath, fs);
          try {
            successCallback(result);
          }
          catch (e) {
            console.log('Error invoking callback: ' + e);
          }
        }
      } else {
        // no Entry object returned
        fail(FileError.NOT_FOUND_ERR);
      }
    };
    cordovaExec(success, fail, "GDStorage", "resolveLocalFileSystemURI", [uri]);
  };

  resolveLocalFileSystemURI = gdResolveLocalFileSystemURI;

  module.exports = resolveLocalFileSystemURI;
})();
