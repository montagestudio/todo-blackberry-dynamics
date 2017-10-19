/**
 * @module "ui/footer.reel"
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
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

        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.input.addEventListener('blur', this);
            this._keyComposer.addEventListener("keyPress", this, false);
        }
    },

    handleBlur: {
        value: function (e) {
            this.input.value = "";
        }
    },

    handleKeyPress: {
        value: function (evt) {
            this._addTodoFromInput();
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
