/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;
(function() {

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
     * var uri = "file:///Users/<user>/Library/Developer/CoreSimulator/Devices/0AB70C03-8311-41D4-8AAA-ECF2182A2933/data/Containers/Bundle/Application/F1491C9D-D0FE-4C24-800C-EEFDD941D4B0/<appName>.app/www/img/logo.png"; // on iOS simulator
     * // on device the uri will be like this:
     * // file:///var/containers/Bundle/Application/FCC69EF9-6FFD-4BC5-87FC-C1A65763C2DE/<appName>.app/www/img/logo.png
     * resolveLocalFileSystemURI(uri, function() {
     *     console.log(file.isFile); // true
     *     console.log(file.isDirectory); // false
     *     console.log(file.name); // "logo.png"
     *     console.log(file.fullPath); // "/img/logo.png"
     *     console.log(file.filesystem); // GDFileSystem
     * }, null);
     *
     * // OR you can pass "img/logo.png" uri bundled to "www" folder as parameter, result will be the same
     *
     * var uri = "img/logo.png";
     * resolveLocalFileSystemURI(uri, function() {
     *     console.log(file.isFile); // true
     *     console.log(file.isDirectory); // false
     *     console.log(file.name); // "logo.png"
     *     console.log(file.fullPath); // "/img/logo.png"
     *     console.log(file.filesystem); // GDFileSystem
     * }, null);
     *
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
            var fs = new(require('cordova-plugin-bbd-storage.FileSystem'))('GDFileSystem');

            if (entry) {
                if (typeof successCallback === 'function') {
                    // create appropriate Entry object
                    result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath, fs) : new FileEntry(entry.name, entry.fullPath, fs);
                    try {
                        successCallback(result);
                    } catch (e) {
                        console.log('Error invoking callback: ' + e);
                    }
                }
            } else {
                // no Entry object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };

        if (uri.indexOf("file:///") >= 0 && uri.indexOf("www") >= 0) {
            uri = uri.substr(uri.indexOf("www") + 4, uri.length);
        }

        cordovaExec(success, fail, "GDStorage", "resolveLocalFileSystemURI", [uri]);
    };

    resolveLocalFileSystemURI = gdResolveLocalFileSystemURI;

    module.exports = resolveLocalFileSystemURI;
})();
