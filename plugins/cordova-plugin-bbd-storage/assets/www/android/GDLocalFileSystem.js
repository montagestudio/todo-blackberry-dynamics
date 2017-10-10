/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
  /********************GDLocalFileSystem***********************/
  /**
   * @class GDLocalFileSystem
   * @classdesc This object provides a way to obtain root secure file systems. GDFileSystem
   *
   * @example
   *
   * console.log(GDLocalFileSystem.TEMPORARY); // 0 - temporary, with no guarantee of persistence
   * console.log(GDLocalFileSystem.PERSISTENT); // 1 - persistent
   */
  var GDLocalFileSystem = function() {
  };

  GDLocalFileSystem.TEMPORARY = 0; //temporary, with no guarantee of persistence
  GDLocalFileSystem.PERSISTENT = 1; //persistent

  LocalFileSystem = GDLocalFileSystem

  module.exports = LocalFileSystem;
})();
