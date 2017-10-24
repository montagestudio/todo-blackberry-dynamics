var Montage = require('montage').Montage;
var TodoService = require("core/services/todo-service").TodoService;

exports.AppDelegate = Montage.specialize({

    willFinishLoading: {
        value: function (app) {
            if (window.cordova) {
                var self = this;
                app.dataServicePromise = new Promise(function (resolve, reject) {
                    document.addEventListener("deviceready", function () {
                        var service = new TodoService();
                        service.dataService.then(function (dataService) {
                            return dataService.openDatabase().then(function () {
                                resolve(service);
                            });
                        });
                    }, false);
                });
            } else {
                app.dataServicePromise = Promise.resolve(new TodoService());
            }
        }
    }
});
