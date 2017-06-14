// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis


// Initialize
(function ExampleController() {
    provideController('exCtrl', function($scope) {
        $scope.exVar = "I'm an Example Variable";
        $scope.exNum = 10;
    });
})();