/**
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function () {
  var cordovaExec = require('cordova/exec');
  var ProgressEvent = require('cordova-plugin-bbd-storage.ProgressEvent');

  //***************************** GDFileTransfer ********************************//
  /**
   * 
   * @class GDFileTransfer
   * @classdesc FileTransfer uploads a file to a remote server.
   */
  var GDFileTransfer = function() {
    this.onprogress = null; // optional callback
  };

  function newProgressEvent(result) {
    var pe = new ProgressEvent();
    pe.lengthComputable = result.lengthComputable;
    pe.loaded = result.loaded;
    pe.total = result.total;
    return pe;
  }

  /**
   * @function GDFileTransfer#upload
   * @description Given an absolute file path, uploads a file on the device to a remote server using a multipart HTTP request.
   * @param {String} filePath Full path of the file on the device
   * @param {String} server URL of the server to receive the file
   * @param {Function} successCallback Callback to be invoked when upload has completed
   * @param {Function} errorCallback Callback to be invoked upon error
   * @param {FileUploadOptions} options Optional parameters such as file name and mimetype
   * @param {Boolean} trustAllHosts Optional trust all hosts (e.g. for self-signed certs), defaults to false
   * 
   * @example
   * var ft = new FileTransfer(),
   *     options = new FileUploadOptions(),
   *     filePath = "file.txt",
   *     fileOptions = {create: true, exclusive: false},
   *     uploadUrl = "http://httpbin.org/post";
   * options.fileKey = "file";
   * options.fileName = "data.json";
   * options.mimeType = "text/json";
   *
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     fileSystem.root.getFile(filePath, fileOptions, function (file) {
   *         file.createWriter(function (writer) {
   *             writer.onwriteend = function() {
   *                 ft.upload(file.fullPath, uploadUrl, function (response) {
   *                     consol.log(response);
   *                 }, null, options, true);
   *                 ft.onprogress = function(progress) {
   *                     console.log(progress)
   *                 };
   *             }
   *             writer.write('File writer wrote this text');
   *         }, null);
   *     }, null);
   * });
   */
  GDFileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, trustAllHosts) {
    // check for options
      var fileKey = null;
      var fileName = null;
      var mimeType = null;
      var params = null;
      var headers = null;
      var chunkedMode = true;
      if (options) {
          fileKey = options.fileKey;
          fileName = options.fileName;
          mimeType = options.mimeType;
          headers = options.headers;
          if (options.chunkedMode !== null || typeof options.chunkedMode !== "undefined") {
              chunkedMode = options.chunkedMode;
          }
          if (options.params) {
              params = options.params;
          }
          else {
              params = {};
          }
      }

      var self = this;
      var win = function(result) {
          result.response = decodeURI(result.response);

          if (typeof result.lengthComputable != "undefined") {
              if (self.onprogress) {
                  self.onprogress(newProgressEvent(result));
              }
          } else {
              successCallback && successCallback(result);
          }
      }

      cordovaExec(win, errorCallback, 'GDFileTransfer', 'upload', [filePath, server, fileKey, fileName, mimeType, params, trustAllHosts, chunkedMode, headers]);
  };

  /**
   * @function GDFileTransfer#download
   * @description Downloads a file form a given URL and saves it to the specified directory.
   * @param {String} source URL of the server to receive the file
   * @param {String} target Full path of the file on the device
   * @param {Function} successCallback Callback to be invoked when upload has completed
   * @param {Function} errorCallback Callback to be invoked upon error
   * 
   * @example
   * var fileTransfer = new FileTransfer(),
   *     url = "http://www.textfiles.com/programming/24hrs.txt",
   *     filePath = "/file.txt",
   *     options = {create: true, exclusive: false};
   * options.fileKey = "file";
   * options.fileName = "data.json";
   * options.mimeType = "text/json";
   *
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     fileSystem.root.getFile(filePath, fileOptions, function (file) {
   *         fileTransfer.download(url, file.fullPath, function (downloadedEntry) {
   *             downloadedEntry.file(function (downloadedFile) {
   *                 console.log(downloadedFile);
   *             });
   *         }, null);
   *     }, null);
   * });
   */
  GDFileTransfer.prototype.download = function(source, target, successCallback, errorCallback) {

      var self = this;

      var win = function(result) {
        if (typeof result.lengthComputable != "undefined") {
            if (self.onprogress) {
                self.onprogress(newProgressEvent(result));
            }
        } else {
            var entry = null;
            entry = (result.isDirectory) ? new (require('cordova-plugin-bbd-storage.DirectoryEntry'))(result.name, result.fullPath) : new (require('cordova-plugin-bbd-storage.FileEntry'))(result.name, result.fullPath);
  
            entry.isDirectory = result.isDirectory;
            entry.isFile = result.isFile;
            successCallback(entry);
        };
      }
      
      cordovaExec(win, errorCallback, 'GDFileTransfer', 'download', [source, target]);
  };

  // Install the plugin.
  module.exports = GDFileTransfer;
}());   // End the Module Definition.
//************************************************************************************************