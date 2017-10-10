/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  var cordovaExec = require('cordova/exec');
  var FileError = require('cordova-plugin-bbd-storage.FileError');

  //************************* GDDirectoryReader *****************************//
  /**
   * @class GDDirectoryReader
   * @classdesc  An interface that lists the files and directories in a directory.
   */
  function GDDirectoryReader(path) {
	  this.path = path || null;
  }

  /**
   * @function GDDirectoryReader#readEntries
   * @description Returns a list of entries from a directory.
   * @param {function} successCallback Called with a list of entries
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getDirectory("parentDirectory", options, function (parentDirectory) {
   *         // "/parentDirectory" is created here
   *         fileSystem.root.getDirectory("parentDirectory/nestedDirectory", options, function (nestedDirectory) {
   *             var directoryReader = parentDirectory.createReader();
   *             directoryReader.readEntries(function (entries) {
   *                 console.log(entries[0].isFile); //false
   *                 console.log(entries[0].isDirectory); //true
   *                 console.log(entries[0].name); // "nestedDirectory"
   *                 console.log(entries[0].fullPath); // "/parentDirectory/nestedDirectory"
   *                 console.log(entries[0].filesystem); // "/"
   *                 console.log(entries.length); // 1
   *             }, null);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDDirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
	  var win = typeof successCallback !== 'function' ? null : function(result) {
          var retVal = [];
          var fs = new (require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');
          for (var i=0; i<result.length; i++) {
              var entry = null;
                if (result[i].isDirectory) {
                    entry = new (require('cordova-plugin-bbd-storage.DirectoryEntry'))();
                }
                else if (result[i].isFile) {
                    entry = new (require('cordova-plugin-bbd-storage.FileEntry'))();
                }
              entry.isDirectory = result[i].isDirectory;
              entry.isFile = result[i].isFile;
              entry.name = result[i].name;
              entry.fullPath = result[i].fullPath;
              entry.filesystem = fs;
              retVal.push(entry);
          }
          successCallback(retVal);
      };
      var fail = typeof errorCallback !== 'function' ? null : function(code) {
          errorCallback(new FileError(code));
      };
      cordovaExec(win, fail, "GDStorage", "readEntries", [this.path]);
  };

  DirectoryReader = GDDirectoryReader;

  module.exports = DirectoryReader;
})();
