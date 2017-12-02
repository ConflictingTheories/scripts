// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis

(function ExampleModule() {
    // Module
    var Example = angular.module('example', [])
        // Controller
    console.log(requestController('exCtrl'));
    Example.controller('exCtrl', requestController('exCtrl'));
})();