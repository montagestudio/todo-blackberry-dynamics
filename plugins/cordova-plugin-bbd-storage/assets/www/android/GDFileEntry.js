/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  var cordovaExec = require('cordova/exec');
  var File = require('cordova-plugin-bbd-storage.File');
  var FileWriter = require('cordova-plugin-bbd-storage.FileWriter');
  var FileError = require('cordova-plugin-bbd-storage.FileError');
  var Metadata = require('cordova-plugin-bbd-storage.Metadata');

  //************************** GDFileEntry ******************************//
  /**
   * @class GDFileEntry
   * @classdesc An interface representing a directory on the file system.
   * @property {boolean} isFile Always false (readonly)
   * @property {boolean} isDirectory Always true (readonly)
   * @property {string} name Name of the directory, excluding the path leading to it (readonly)
   * @property {string} fullPath The absolute full path to the directory (readonly)
   * @property {FileSystem} filesystem Filesystem on which the directory resides (readonly) - not supported by Cordova
   */
   var GDFileEntry = function(name, fullPath, fileSystem) {
    this.isFile = true;
    this.isDirectory = false;
    this.name = name || '';
    this.fullPath = fullPath || '';
    this.filesystem = fileSystem || '';
  };

  /**
   * @function GDFileEntry#file
   * @description Returns a File that represents the current state of the file that this FileEntry represents.
   * @param {function} successCallback Called with the new File object
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         console.log(file.isFile); //true
   *         console.log(file.isDirectory); //false
   *         console.log(file.name); // "file.txt"
   *         console.log(file.fullPath); // "/file.txt"
   *         console.log(file.filesystem); // "/"
   *
   *         file.file(function (file) {
   *             console.log(file.name); // "file.txt"
   *             console.log(file.fullPath); // "/file.txt"
   *             console.log(file.lastModifiedDate);
   *             console.log(file.size);
   *             console.log(file.type);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.file = function(successCallback, errorCallback) {
    var win = typeof successCallback !== 'function' ? null : function(f) {
      if (f.type === 'null') {
        var file = new File(f.name, f.fullPath, null, f.lastModifiedDate, f.size);
      } else {
        var file = new File(f.name, f.fullPath, f.type, f.lastModifiedDate, f.size);
      }
      successCallback(file);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
      errorCallback(new FileError(code));
    };
    cordovaExec(win, fail, "GDStorage", "getFileMetadata", [this.fullPath]);
  };

  /**
   * @function GDFileEntry#createWriter
   * @descriptionCreates a new FileWriter associated with the file that this FileEntry represents.
   * @param {function} successCallback Called with the new FileWriter
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.createWriter(function (writer) {
   *             // here GDFileWriter methods such as writer.write(), writer.seek() and writer.truncate() are available
   *         });
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.createWriter = function(successCallback, errorCallback) {
    this.file(function(filePointer) {
      var writer = new FileWriter(filePointer);

      if (writer.fileName === null || writer.fileName === "") {
        if (typeof errorCallback === "function") {
          errorCallback(new FileError(FileError.INVALID_STATE_ERR));
        }
      } else {
        if (typeof successCallback === "function") {
          successCallback(writer);
        }
      }
    }, errorCallback);
  };

  //**************************Common to Entry (GDFileEntry)******************************//
  /**
   * @function GDFileEntry#getMetadata
   * @description Look up the metadata of the entry.
   * @param {function} successCallback Called with a Metadata object
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.getMetadata(function (metadata) {
   *             console.log(metadata.modificationTime);
   *             console.log(metadata.size);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.getMetadata = function(successCallback, errorCallback) {
    var success = typeof successCallback !== 'function' ? null : function(lastModified) {
      var metadata = new Metadata(lastModified);
      successCallback(metadata);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
      errorCallback(new FileError(code));
    };
    cordovaExec(success, fail, "GDStorage", "getMetadata", [this.fullPath]);
  };

  /**
   * @function GDFileEntry#moveTo
   * @description Move a file or directory to a new location.
   * @param {GDDirectoryEntry} parent The directory to which to move this entry
   * @param {string} newName New name of the entry, defaults to the current name
   * @param {function} successCallback Called with the new DirectoryEntry object
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getDirectory("parentDirectory", options, function (parentDirectory) {
   *         // "/parentDirectory" is created here
   *         fileSystem.root.getFile("file.txt", options, function (nestedFile) {
   *             // "/file.txt" is created here
   *             nestedFile.moveTo(parentDirectory, "renamedFile.txt", function (file) {
   *                 // now "/file.txt" was moved to "/parentDirectory" with new name "/renamedFile.txt"
   *                 console.log(file.isFile); //true
   *                 console.log(file.isDirectory); //false
   *                 console.log(file.name); // "renamedFile.txt"
   *                 console.log(file.fullPath); // "/parentDirectory/renamedFile.txt"
   *                 console.log(file.filesystem); // "/"
   *             }, null);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.moveTo = function(parent, newName, successCallback, errorCallback) {
    var fail = function(code) {
      if (typeof errorCallback === 'function') {
        errorCallback(new FileError(code));
      }
    };
    // user must specify parent Entry
    if (!parent) {
      fail(FileError.NOT_FOUND_ERR);
      return;
    }
    // source path
    var srcPath = this.fullPath,
      // entry name
      name = newName || this.name,
      success = function(entry) {
      if (entry) {
        if (typeof successCallback === 'function') {
          // create appropriate Entry object
          var fs = new (require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');
          var result = new GDFileEntry(entry.name, entry.fullPath, fs);
          try {
            successCallback(result);
          }
          catch (e) {
            console.log('Error invoking callback: ' + e);
          }
        }
      }
      else {
        // no Entry object returned
        fail(FileError.NOT_FOUND_ERR);
      }
    };
    // copy
    cordovaExec(success, fail, "GDStorage", "moveTo", [srcPath, parent.fullPath, name]);
  };

  /**
   * @function GDFileEntry#copyTo
   * @description Copy a directory to a different location.
   * @param {GDDirectoryEntry} parent The directory to which to copy the entry
   * @param {string} newName New name of the entry, defaults to the current name
   * @param {function} successCallback Called with the new Entry object
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getDirectory("parentDirectory", options, function (parentDirectory) {
   *         // "/parentDirectory" is created here
   *         fileSystem.root.getFile("file.txt", options, function (nestedFile) {
   *             // "/file.txt" is created here
   *             nestedFile.copyTo(parentDirectory, "renamedFile.txt", function (file) {
   *                 // now "/file.txt" was copied to "/parentDirectory" with new name "/renamedFile.txt"
   *                 console.log(file.isFile); //true
   *                 console.log(file.isDirectory); //false
   *                 console.log(file.name); // "renamedFile.txt"
   *                 console.log(file.fullPath); // "/parentDirectory/renamedFile.txt"
   *                 console.log(file.filesystem); // "/"
   *             }, null);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.copyTo = function(parent, newName, successCallback, errorCallback) {
    var fail = function(code) {
      if (typeof errorCallback === 'function') {
        errorCallback(new FileError(code));
      }
    };
    // user must specify parent Entry
    if (!parent) {
      fail(FileError.NOT_FOUND_ERR);
      return;
    }
    // source path
    var srcPath = this.fullPath,
    // entry name
    name = newName || this.name,
    // success callback
    success = function(entry) {
      if (entry) {
        if (typeof successCallback === 'function') {
          // create appropriate Entry object
          var fs = new (require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');
          var result = (entry.isDirectory) ? new (require('cordova-plugin-bbd-storage.DirectoryEntry'))(entry.name, entry.fullPath, fs) :
            new (require('cordova-plugin-bbd-storage.FileEntry'))(entry.name, entry.fullPath, fs);
          try {
            successCallback(result);
          }
          catch (e) {
            console.log('Error invoking callback: ' + e);
          }
        }
      }
      else {
        // no Entry object returned
        fail(FileError.NOT_FOUND_ERR);
      }
    };
    cordovaExec(success, fail, "GDStorage", "copyTo", [srcPath, parent.fullPath, name]);
  };

  /**
   * @function GDFileEntry#toURL
   * @description Return a URL that can be used to identify this entry.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         console.log(file.toURL()); // "/file.txt"
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.toURL = function() {
    // fullPath attribute contains the full URL
    return this.fullPath;
  };

  /**
   * @function GDFileEntry#remove
   * @description Remove a file or directory. It is an error to attempt to delete a
   * directory that is not empty. It is an error to attempt to delete a
   * root directory of a file system.
   * @param {function} successCallback Called with no parameters
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.remove();
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.remove = function(successCallback, errorCallback) {
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
      errorCallback(new FileError(code));
    };
    cordovaExec(successCallback, fail, "GDStorage", "remove", [this.fullPath]);
  };

  /**
   * @function GDFileEntry#getParent
   * @description Look up the parent GDDirectoryEntry of this entry.
   * @param {function} successCallback Called with the parent GDDirectoryEntry object
   * @param {function} errorCallback Called with a FileError
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getDirectory("parentDirectory", options, function (parentDirectory) {
   *         // "/parentDirectory" is created here
   *         fileSystem.root.getFile("parentDirectory/nestedFile.txt", options, function (nestedFile) {
   *             // "/nestedFile.txt" is created here
   *             nestedFile.getParent(function (directory) {
   *                 console.log(directory.isFile); //false
   *                 console.log(directory.isDirectory); //true
   *                 console.log(directory.name); // "parentDirectory"
   *                 console.log(directory.fullPath); // "/parentDirectory"
   *                 console.log(directory.filesystem); // "/"
   *             }, null);
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileEntry.prototype.getParent = function(successCallback, errorCallback) {
    var win = typeof successCallback !== 'function' ? null : function(result) {
      var fs = new (require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');
      var entry = new (require('cordova-plugin-bbd-storage.DirectoryEntry'))(result.name, result.fullPath, fs);
      successCallback(entry);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
      errorCallback(new FileError(code));
    };
    cordovaExec(win, fail, "GDStorage", "getParent", [this.fullPath]);
  };

  FileEntry = GDFileEntry;

  module.exports = FileEntry;
})();
