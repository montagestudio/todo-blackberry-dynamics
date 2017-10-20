/**
 * @module ui/version.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Header
 * @extends Component
 */
exports.Header = Component.specialize({

    handleMenuAction: {
        value: function () {
            this.application.isMenuShown = true;
        }
    }

});
