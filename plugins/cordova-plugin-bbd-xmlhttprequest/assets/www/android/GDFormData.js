/*
 * (c) 2017 BlackBerry Limited. All rights reserved.
 */

;(function() {
	/**
	 * @class GDFormData
	 * @classdesc GDFormData objects provide a way to easily construct a set of key/value pairs representing form fields and their values, which can then be easily sent using the XMLHttpRequest send() method.
	 */
	window.GDFormData = function() {};

	/**
	 * @function GDFormData#append
	 * @description Appends a key/value pair to the FormData object.
	 * @param {String} key Key for FormData value
	 * @param {String} value Value for FormData key
	 *
	 * @example
	 * var formData = new FormData();
	 * formData.append("key", "value");
	 * console.log(formData.key); // "value"
	 */
	GDFormData.prototype.append = function(key, value) {
		if (arguments.length == 0 || arguments.length == 1) {
			throw ({
				message: "TypeError: Failed to execute 'append' on 'FormData': 2 arguments required, but only " + arguments.length + " present."
			});
		}

		if (!this[key]) {
			this[key] = value;
		}

		return this;
	};

	FormData = GDFormData;

	module.exports = FormData;
})();
