// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis

// Initialize
(function ExampleComponent() {
    provideComponent('ex_component', function() {
        return {
            template: "<h1>{{Test}}</h1>",
            controller: function() {
                $scope.Test = "hello";
            }
        }
    });
})();