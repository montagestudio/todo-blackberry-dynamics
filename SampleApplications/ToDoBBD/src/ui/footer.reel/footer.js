/**
 * @module "ui/footer.reel"
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    PressComposer = require("montage/composer/press-composer").PressComposer,
    TodoService = require("core/services/todo-service").TodoService;

/**
 * @class Footer
 * @extends Component
 */
exports.Footer = Component.specialize(/** @lends Footer.prototype */{

    constructor: {
        value: function () {
            this._keyComposer = new KeyComposer();
            this._keyComposer.component = this;
            this._keyComposer.keys = "enter";
            this.addComposer(this._keyComposer);

            this._pressComposer = new PressComposer();
            this._pressComposer.delegate = this;
            this._pressComposer.lazyLoad = false;
            this.addComposerForElement(this._pressComposer, document);
            this._pressComposer.addEventListener("press", this, true);
            this.isActive = false;
        }
    },

    shouldComposerSurrenderPointerToComponent: {
        value: function (composer, pointer, composerClaimed) {
            var response = !this.isActive ||
                this.isActive && composerClaimed.component.identifier === 'add';
            
            return response;
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.input.addEventListener('focus', this);
            this._keyComposer.addEventListener("keyPress", this, false);
        }
    },

    handleFocus: {
        value: function () {
            this.isActive = true;
        }
    },

    handleKeyPress: {
        value: function (evt) {
            this._addTodoFromInput();
        }
    },

    capturePress: {
        value: function (event) {
            if (!this.element.contains(event.targetElement)) {
                this._reset();
            }
        }
    },

    handleAddAction: {
        value: function () {
            this._addTodoFromInput();
        }
    },

    _addTodoFromInput: {
        value: function () {
            if (this.input.value) {
                var self = this;

                return this._addTodo(this.input.value).then(function () {
                    self._reset();
                });
            }

            this._reset();
            return Promise.resolve();
        }
    },

    _addTodo: {
        value: function (text) {
            if (typeof text === "string" && text.length) {
                var self = this;

                return this.application.dataServicePromise.then(function (dataService) {
                    dataService.addTodo({
                        id: void 0,
                        label: text,
                        done: false
                    });
                });
            }

            return Promise.resolve();
        }
    },

    _reset: {
        value: function () {
            this.input.value = "";
            this.isActive = false;
            this.input.blur();
        }
    }

});
