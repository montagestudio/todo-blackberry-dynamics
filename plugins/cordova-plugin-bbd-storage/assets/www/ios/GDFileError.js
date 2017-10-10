/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
  /**
   * @class GDFileError
   *
   * @classdesc Describes error codes when working with files.
   * @property {Number} NOT_FOUND_ERR 1
   * @property {Number} SECURITY_ERR 2
   * @property {Number} ABORT_ERR 3
   * @property {Number} NOT_READABLE_ERR 4
   * @property {Number} ENCODING_ERR 5
   * @property {Number} NO_MODIFICATION_ALLOWED_ERR 6
   * @property {Number} INVALID_STATE_ERR 7
   * @property {Number} SYNTAX_ERR 8
   * @property {Number} INVALID_MODIFICATION_ERR 9
   * @property {Number} QUOTA_EXCEEDED_ERR 10
   * @property {Number} TYPE_MISMATCH_ERR 11
   * @property {Number} PATH_EXISTS_ERR 12
   *
   * @example
   * // This ojbect is used by other classes and is not used directly
   * function errorCallback (error) {
   *     console.log(error.code); // 1, 2, 3, ...
   * }
   */
  function GDFileError(error) {
    this.code = error || null;
  }

  GDFileError.NOT_FOUND_ERR = 1;
  GDFileError.SECURITY_ERR = 2;
  GDFileError.ABORT_ERR = 3;
  GDFileError.NOT_READABLE_ERR = 4;
  GDFileError.ENCODING_ERR = 5;
  GDFileError.NO_MODIFICATION_ALLOWED_ERR = 6;
  GDFileError.INVALID_STATE_ERR = 7;
  GDFileError.SYNTAX_ERR = 8;
  GDFileError.INVALID_MODIFICATION_ERR = 9;
  GDFileError.QUOTA_EXCEEDED_ERR = 10;
  GDFileError.TYPE_MISMATCH_ERR = 11;
  GDFileError.PATH_EXISTS_ERR = 12;

  FileError = GDFileError;

  module.exports = FileError;
})();

// End the Module Definition.
//************************************************************************************************
