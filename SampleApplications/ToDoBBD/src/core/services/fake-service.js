var DataService = function DataService() {
    this.todos = [
        { "id": 0, "label": "My todo 1", "done": false },
        { "id": 1, "label": "My todo 2", "done": true },
        { "id": 2, "label": "My todo 3", "done": false }
    ];
}

DataService.prototype.fetchAll = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(self.todos);
        }, 2000);
    });   
}

DataService.prototype.deleteTodo = function (todo) {
    var self = this;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var todos = self.todos,
                id = todo.id;

            for (var i = 0, length = todos.length; i < length; i++) {
                if (todos[i].id === id) {
                    todos.splice(i, 1);
                    break;
                }
            }

            resolve();
        }, 2000);
    });
}

DataService.prototype.addTodo = function (todo) {
    var self = this;
    this.todos.push(todo);

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var todos = self.todos,
                candidate = 0;

            for (var i = 0, length = todos.length; i < length; i++) {
                if (todos[i].id >= candidate) {
                    candidate = todos[i].id + 1;
                }
            }

            todo.id = candidate;
            resolve(todo);
        }, 2000);
    });
}



DataService.prototype.updateTodo = function (todo, newValues) {
    var self = this;

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var newValuesKeys = Object.keys(newValues),
                key;

            for (var i = 0, length = newValuesKeys.length; i < length; i++) {
                key = newValuesKeys[i];
                todo[key] = newValues[key];
            }

            resolve(todo);
        }, 2000);
    });
};

DataService.prototype.openDatabase = function () {
    return Promise.resolve();
}

exports.DataService = DataService;
