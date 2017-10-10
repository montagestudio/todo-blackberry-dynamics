var DataService = function DataService() {
    this.config = {
        database: {
            name: "Database",
            version: "1.0",
            displayname: "ToDoBBD Demo",
            size: 200000,
            success: function () {
                console.log("DB is opened")
            },
            error: function () {
                console.log("Error: ")

                console.log(arguments[0]);
                console.log(arguments[1]);
            },
            insert: function (tx, results) {
                console.log(results);
            }
        }
    };

    this.db = null;
    this.todos = [];
}

DataService.prototype.openDatabase = function () {
    var config = this.config,
        self = this;

    this.db = window.openDatabase(
        config.database.name,
        config.database.version,
        config.database.displayname,
        config.database.size,
        config.database.success,
        config.database.error
    );

    return new Promise(function (resolve, reject) {
        self.db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS Todos;');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Todos( '
                + 'id INTEGER PRIMARY KEY NOT NULL, '
                + 'label VARCHAR(255), '
                + 'done BOOLEAN); ', [], null, config.database.error);

            tx.executeSql('INSERT INTO Todos (label, done) VALUES ("My To-do 001", 1);', [], null, config.database.error);
            tx.executeSql('INSERT INTO Todos (label, done) VALUES ("My To-do 002", 0);', [], null, config.database.error);
        }, reject, resolve);
    });
}

DataService.prototype.fetchAll = function () {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM Todos;', [], function (tx, results) {
                var rows = results.rows,
                    todos = self.todos,
                    todo;

                for (var i = 0, length = rows.length; i < length; i++) {
                    todo = rows.item(i);
                    todos.push({
                        id: todo.id,
                        label: todo.label,
                        done: !!todo.done
                    });
                }
            });
        }, reject, function () {
            resolve(self.todos);
        });
    });
}

DataService.prototype.deleteTodo = function (todo) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.db.transaction(function (tx) {
            tx.executeSql('DELETE FROM Todos WHERE id = ?', [todo.id], function () {
                var todos = self.todos,
                    id = todo.id;

                for (var i = 0, length = todos.length; i < length; i++) {
                    if (todos[i].id === id) {
                        todos.splice(i, 1);
                        break;
                    }
                }
            });
        },reject, resolve);
    });
}

DataService.prototype.addTodo = function (todo) {
    var self = this;
    self.todos.push(todo);

    return new Promise(function (resolve, reject) {
        self.db.transaction(function (tx) {
            tx.executeSql('INSERT INTO Todos (label, done) VALUES (?, ?);', [todo.label, !!todo.done ? 1 : 0], function (tx, results) {
                todo.id = results.insertId;
            });
        }, reject, function () {
            resolve(todo);
        });
    });
}



DataService.prototype.updateTodo = function (todo, newValues) {
    var self = this;

    return new Promise(function (resolve, reject) {
        self.db.transaction(function (tx) {
            tx.executeSql('UPDATE Todos SET done = ? WHERE id = ?', [!!newValues.done ? 1 : 0, todo.id], function (tx, results) {
                var newValuesKeys = Object.keys(newValues),
                    key;

                for (var i = 0, length = newValuesKeys.length; i < length; i++) {
                    key = newValuesKeys[i];
                    todo[key] = newValues[key];
                }
            });
        }, reject, function () {
            resolve(todo);
        });
    });
}

exports.DataService = DataService;
