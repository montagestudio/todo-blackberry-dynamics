/**
 * @module ui/version.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Header
 * @extends Component
 */
exports.Header = Component.specialize(/** @lends Version# */ {

    todayDate: {
        get: function() {
            return Date.now();
        }
    }
});
