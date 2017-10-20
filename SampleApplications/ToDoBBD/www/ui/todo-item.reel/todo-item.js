/**
 * @module "ui/todo-item.reel"
 */
var Component = require("montage/ui/component").Component;
var TodoService = require("core/services/todo-service").TodoService;

/**
 * @class TodoItem
 * @extends Component
 */
exports.TodoItem = Component.specialize(/** @lends TodoItem.prototype */{
    actionPending: {
        value: false
    },
   
    todo: {
        set: function (todo) {
            if (todo !== this._todo) {
                this._todo = todo;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this._todo;
        }
    },

    _scheduleActionPending: {
        value: function () {
            var self = this;

            this._clearActionPendingIfNeeded();

            this.actionPendingId = setTimeout(function () {
                self.actionPending = true;
            }, 50);
        }
    },

    _clearActionPendingIfNeeded: {
        value: function () {
            if (this.actionPendingId) {
                clearTimeout(this.actionPendingId);
                this.actionPendingId = null;
            }

            this.actionPending = false;
        }
    },

    handleCheckboxAction: {
        value: function (event) {
            var todo = event.detail.get('todo');

            if (todo) {
                var self = this;

                this.application.dataServicePromise.then(function (dataService) {
                    self._scheduleActionPending();
                    return dataService.updateTodo(todo, {
                        done: !todo.done
                    });
                }).then(function (todo) {
                    self.todo = todo;
                }).finally(function () {
                    self._clearActionPendingIfNeeded();
                });
            }
        }
    },

    handleDeleteAction: {
        value: function (event) {
            var todo = event.detail.get('todo');

            if (todo) {
                var self = this;

                this.application.dataServicePromise.then(function (dataService) {
                    self._scheduleActionPending();
                    return dataService.deleteTodo(todo);
                }).finally(function () {
                    self._clearActionPendingIfNeeded();
                });
            }
        }
    },

    draw: {
        value: function () {
            if (this.todo) {
                var id = "todo-item-" + this.todo.id;
                this.checkboxElement.setAttribute('id', id);
                this.labelElement.setAttribute('for', id);
            }
        }
    }
});
