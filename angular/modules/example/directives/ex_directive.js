// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis

// Initialize
(function ExampleDirective() {
    ngUtils.provideDirective('ex_directive', function() {
        return {
            template: "<h1>{{Test}}</h1>"
        }
    });
})();