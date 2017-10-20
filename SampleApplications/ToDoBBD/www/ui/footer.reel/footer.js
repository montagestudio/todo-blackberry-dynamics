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
            this._pressComposer = new PressComposer();
            this._keyComposer.component = this;
            this._pressComposer.component = this;
            this._keyComposer.keys = "enter";
            this.addComposer(this._keyComposer);
            this.addComposerForElement(this._pressComposer, document);
            this.isActive = false;
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.input.addEventListener('blur', this);
            this.input.addEventListener('focus', this);
            this._keyComposer.addEventListener("keyPress", this, false);
        }
    },

    handleFocus: {
        value: function () {
            this._pressComposer.addEventListener("press", this, false);
            this.isActive = true;
        }
    },

    handleBlur: {
        value: function (e) {
            this._pressComposer.removeEventListener("press", this, false);
            this.input.value = "";
            this.isActive = false;
        }
    },

    handleKeyPress: {
        value: function (evt) {
            this._addTodoFromInput();
            this.input.blur();
        }
    },

    handlePress: {
        value: function (event) {
            if (!this.element.contains(event.targetElement)) {
                this.input.blur();
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
                    self.input.value = "";
                });
            }
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
    }

});
