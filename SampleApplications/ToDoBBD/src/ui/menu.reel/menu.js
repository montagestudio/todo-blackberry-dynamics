/**
 * @module "ui/footer.reel"
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class Menu
 * @extends Component
 */
exports.Menu = Component.specialize(/** @lends Footer.prototype */{

    enterDocument: {
        value: function (firstime) {
            if (firstime) {
                this._pressComposer = new PressComposer();
                this._pressComposer.lazyLoad = false;
                this.addComposerForElement(this._pressComposer, document);
                this._pressComposer.addEventListener("press", this, true);
                this._pressComposer.delegate = this;
            }
        }
    },

    shouldComposerSurrenderPointerToComponent: {
        value: function (composer, pointer, composerClaimed) {
            return !this.application.isMenuShown;
        }
    },

    capturePress: {
        value: function (event) {
            if (!this.element.contains(event.targetElement)) {
                this.application.isMenuShown = false;
            } else if (event.targetElement.dataset.link) {
                this.application.isMenuShown = false;
                this.application.selectedMenu = event.targetElement.dataset.link;
            }
        }
    }

});
