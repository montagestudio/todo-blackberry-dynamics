/**
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

  /**
   * @class GDMetadata
   *
   * @classdesc Information about the state of the file or directory
   * @property {Date} modificationTime The time the file/directory was modified last time
   * @property {Number} size The size of file/directory
   *
   * @example 
   * // This ojbect is used by GDDirectoryEntry.getMetadata() and GDFileEntry.getMetadata() methods and is not used directly
   */
  var GDMetadata = function(metadata) {
    if (typeof metadata == "object") {
      this.modificationTime = new Date(metadata.modificationTime);
      this.size = metadata.size || 0;
    } else if (typeof metadata == "undefined") {
      this.modificationTime = null;
      this.size = 0;
    } else {
      this.modificationTime = new Date(metadata);
    }
  };

  Metadata = GDMetadata;
  
  module.exports = Metadata;
})();

// End the Module Definition.
//************************************************************************************************

