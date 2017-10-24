/**
 * @module "ui/todo-list.reel"
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TodoList
 * @extends Component
 */
exports.TodoList = Component.specialize(/** @lends TodoList.prototype */{
    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.fetchTodos();
            }
        }
    },

    fetchTodos: {
        value: function () {
            var self = this;
            self.actionPending = true;

            this.application.dataServicePromise.then(function (dataService) {
                return dataService.fetchAll().then(function (todos) {
                    return (self.todos = todos);
                });
            }).finally(function () {
                self.actionPending = false;
            });
        }
    }
});
