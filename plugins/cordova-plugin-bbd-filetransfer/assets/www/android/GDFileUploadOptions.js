/**
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {

	/**
     * @class GDFileUploadOptions
     *
     * @classdesc Options to customize the HTTP request used to upload files.
     * @example
     * var ft = new FileTransfer(),
     *     options = new FileUploadOptions();
     * options.fileKey = "file";
     * options.fileName = "data.json";
     * options.mimeType = "text/json";
     */ 
	var GDFileUploadOptions = function(fileKey, fileName, mimeType, params, headers, httpMethod) {
	    this.fileKey = fileKey || null;
	    this.fileName = fileName || null;
	    this.mimeType = mimeType || null;
	    this.params = params || null;
	    this.headers = headers || null;
	    this.httpMethod = httpMethod || null;
	};

	FileUploadOptions = GDFileUploadOptions;

	module.exports = FileUploadOptions;
})();	

// End the Module Definition.
//************************************************************************************************