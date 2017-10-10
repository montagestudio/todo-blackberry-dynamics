/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  var cordovaExec = require('cordova/exec');
  var ProgressEvent = require('cordova-plugin-bbd-storage.ProgressEvent');
  var FileError = require('cordova-plugin-bbd-storage.FileError');

  /***************************** GDFileWriter ********************************/
  /**
   * @class GDFileWriter
   * @classdesc This class writes to the mobile device file system.
   * @param {file} file File object containing file properties
   * @param {bool} append If true write to the end of the file, otherwise overwrite the file
   */
  var GDFileWriter = function(file) {
    this.fileName = "";
    this.length = 0;
    if (file) {
      this.fileName = file.fullPath || file;
      this.length = file.size || 0;
    }
    // default is to write at the beginning of the file
    this.position = 0;
    this.readyState = 0; // EMPTY
    this.result = null;
    // Error
    this.error = null;
    // Event handlers
    this.onwritestart = null;   // When writing starts
    this.onprogress = null;     // While writing the file, and reporting partial file data
    this.onwrite = null;        // When the write has successfully completed.
    this.onwriteend = null;     // When the request has completed (either in success or failure).
    this.onabort = null;        // When the write has been aborted. For instance, by invoking the abort() method.
    this.onerror = null;        // When the write has failed (see errors).
  };

  // States
  GDFileWriter.INIT = 0;
  GDFileWriter.WRITING = 1;
  GDFileWriter.DONE = 2;

  /**
   * @function GDFileWriter#abort
   * @Description Abort writing file.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.createWriter(function (writer) {
   *             writer.write("text");
   *             writer.abort();
   *             writer.onabort = function() {
   *                 console.log("Writing was aborted");
   *             };
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileWriter.prototype.abort = function() {
    // check for invalid state
    if (this.readyState === GDFileWriter.DONE || this.readyState === GDFileWriter.INIT) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // set error
    this.error = new FileError(FileError.ABORT_ERR);

    this.readyState = GDFileWriter.DONE;

    // If abort callback
    if (typeof this.onabort === "function") {
      this.onabort(new ProgressEvent("abort", {"target":this}));
    }

    // If write end callback
    if (typeof this.onwriteend === "function") {
      this.onwriteend(new ProgressEvent("writeend", {"target":this}));
    }
  };

  /**
   * @function GDFileWriter#write
   * @Description Writes data to the file
   * @param {string} data Data to be written. Supports string and binary (Blob and ArrayBuffer)
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.createWriter(function (writer) {
   *             writer.onwriteend = function() {
   *                 console.log("Content was written to the file");
   *             };
   *             writer.write("text");
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileWriter.prototype.write = function(data) {

    var that = this;
    var supportsBinary = (typeof window.Blob !== 'undefined' && typeof window.ArrayBuffer !== 'undefined');
    var isBinary;

    // Check to see if the incoming data is a blob
    if (data instanceof File || (supportsBinary && data instanceof Blob)) {
      var fileReader = new FileReader();

      var _fileReader = fileReader._realReader;
      _fileReader.onload = function() {
        // Call this method again, with the arraybuffer as argument
        GDFileWriter.prototype.write.call(that, this.result);
      };
      if (supportsBinary) {
        _fileReader.readAsArrayBuffer(data);
      } else {
        fileReader.readAsText(data);
      }
      return;
    }

    // Mark data type for safer transport over the binary bridge
    isBinary = supportsBinary && (data instanceof ArrayBuffer);

    // Throw an exception if we are already writing a file
    if (this.readyState === GDFileWriter.WRITING) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }
    // WRITING state
    this.readyState = GDFileWriter.WRITING;
    var me = this;
    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
      me.onwritestart(new ProgressEvent("writestart", {"target":me}));
    }

    // Write file
    cordovaExec(
        // Success callback
      function(r) {
        // If DONE (cancelled), then don't do anything
        if (me.readyState === GDFileWriter.DONE) {
          return;
        }

        // position always increases by bytes written because file would be extended
        me.position += r;
        // The length of the file is now where we are done writing.

        me.length = me.position;

        // DONE state
        me.readyState = GDFileWriter.DONE;

        // If onwrite callback
        if (typeof me.onwrite === "function") {
          me.onwrite(new ProgressEvent("write", {"target":me}));
        }

        // If onwriteend callback
        if (typeof me.onwriteend === "function") {
          me.onwriteend(new ProgressEvent("writeend", {"target":me}));
        }
      },
      // Error callback
      function(e) {
        // If DONE (cancelled), then don't do anything
        if (me.readyState === GDFileWriter.DONE) {
          return;
        }

        // DONE state
        me.readyState = GDFileWriter.DONE;

        // Save error
        me.error = new FileError(e);

        // If onerror callback
        if (typeof me.onerror === "function") {
          me.onerror(new ProgressEvent("error", {"target":me}));
        }

        // If onwriteend callback
        if (typeof me.onwriteend === "function") {
          me.onwriteend(new ProgressEvent("writeend", {"target":me}));
        }
      }, "GDStorage", "write", [this.fileName, data, this.position, isBinary]);
  };

  /**
   * @function GDFileWriter#seek
   * @Description Moves the file pointer to the location specified.
   * If the offset is a negative number the position of the file
   * pointer is rewound.  If the offset is greater than the file
   * size the position is set to the end of the file.
   * @param {integer} offset Is the location to move the file pointer to.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.createWriter(function (writer) {
   *             writer.onwriteend = function() {
   *                 console.log("Content was written to the file");
   *             };
   *             writer.write("text");
   *             writer.seek(0); // Pointer is at the beginning of the file now
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileWriter.prototype.seek = function(offset) {
    // Throw an exception if we are already writing a file
    if (this.readyState === GDFileWriter.WRITING) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }

    if (!offset && offset !== 0) {
      return;
    }

    // See back from end of file.
    if (offset < 0) {
      this.position = Math.max(offset + this.length, 0);
    }
    // Offset is bigger then file size so set position
    // to the end of the file.
    else if (offset > this.length) {
      this.position = this.length;
    }
    // Offset is between 0 and file size so set the position
    // to start writing.
    else {
      this.position = offset;
    }
  };

  /**
   * @function GDFileWriter#truncate
   * @Description Truncates the file to the size specified.
   * @param {integer} size Size to chop the file at.
   *
   * @example
   * requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
   *     var path = "file.txt",
   *         options = {create: true, exclusive: false};
   *
   *     fileSystem.root.getFile(path, options, function (file) {
   *         file.createWriter(function (writer) {
   *             writer.onwriteend = function() {
   *                 console.log("Content was written to the file");
   *             };
   *             writer.write("text");
   *             writer.truncate(2); // now content of file will be "te"
   *         }, null);
   *     }, null);
   * }, null);
   */
  GDFileWriter.prototype.truncate = function(size) {
    // Throw an exception if we are already writing a file
    if (this.readyState === GDFileWriter.WRITING) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = GDFileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
      me.onwritestart(new ProgressEvent("writestart", {"target":this}));
    }

    // Write file
    cordovaExec(
      // Success callback
      function(r) {
        // If DONE (cancelled), then don't do anything
        if (me.readyState === GDFileWriter.DONE) {
          return;
        }

        // DONE state
        me.readyState = GDFileWriter.DONE;

        // Update the length of the file
        me.length = r;
        me.position = Math.min(me.position, r);

        // If onwrite callback
        if (typeof me.onwrite === "function") {
          me.onwrite(new ProgressEvent("write", {"target":me}));
        }

        // If onwriteend callback
        if (typeof me.onwriteend === "function") {
          me.onwriteend(new ProgressEvent("writeend", {"target":me}));
        }
      },
      // Error callback
      function(e) {
        // If DONE (cancelled), then don't do anything
        if (me.readyState === GDFileWriter.DONE) {
          return;
        }

        // DONE state
        me.readyState = GDFileWriter.DONE;

        // Save error
        me.error = new FileError(e);

        // If onerror callback
        if (typeof me.onerror === "function") {
          me.onerror(new ProgressEvent("error", {"target":me}));
        }

        // If onwriteend callback
        if (typeof me.onwriteend === "function") {
          me.onwriteend(new ProgressEvent("writeend", {"target":me}));
        }
      }, "GDStorage", "truncate", [this.fileName, size]);
  };

  FileWriter = GDFileWriter;

  module.exports = FileWriter;
})();
