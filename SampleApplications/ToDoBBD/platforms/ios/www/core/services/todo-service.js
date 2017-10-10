var TodoService = function TodoService() {
    this._dataService = null;
};

Object.defineProperty(TodoService.prototype, 'dataService', {

    get: function () {
        var promise;

        if (window.cordova) {
            promise = require.async('core/services/blackberry-service');
        } else {
            promise = require.async('core/services/fake-service');
        }

        return this._dataService || (this._dataService = promise.then(function (module) {
            return new module.DataService();
        }));
    }
});

TodoService.prototype.fetchAll = function () {
    return this.dataService.then(function (todoService) {
        return todoService.fetchAll();
    });
};

TodoService.prototype.addTodo = function (todo) {
    return this.dataService.then(function (todoService) {
        return todoService.addTodo(todo);
    });
};

TodoService.prototype.deleteTodo = function (todo) {
    return this.dataService.then(function (todoService) {
        return todoService.deleteTodo(todo);
    });
};

TodoService.prototype.updateTodo = function (todo, newValues) {
    return this.dataService.then(function (todoService) {
        return todoService.updateTodo(todo, newValues);
    });
};

exports.TodoService = TodoService;
