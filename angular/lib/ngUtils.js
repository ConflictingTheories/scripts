// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis


var ngUtils = (function() {
    var modules = [];
    var controllers = [];
    var components = [];
    var directives = [];
    var services = [];
    return {
        provide: function(type) {
            return function(asset, value) {
                switch (type) {
                    case "module":
                        modules[asset] = value;
                        break;
                    case "controller":
                        controllers[asset] = value;
                        break;
                    case "component":
                        components[asset] = value;
                        break;
                    case "directive":
                        directives[asset] = value;
                        break;
                    case "service":
                        services[asset] = value;
                        break;
                    default:
                        break;
                }
            }
        },
        request: function(type) {
            var storage = null;
            return function(asset) {
                switch (type) {
                    case "module":
                        storage = modules[asset];
                        break;
                    case "controller":
                        storage = controllers[asset];
                        break;
                    case "component":
                        storage = components[asset];
                        break;
                    case "directive":
                        storage = directives[asset];
                        break;
                    case "service":
                        storage = services[asset];
                        break;
                    default:
                        break;
                }
                return storage;
            }
        }
    }
})();

// Useful Provide Shortcuts
var provideModule = ngUtils.provide("module");
var provideController = ngUtils.provide("controller");
var provideComponent = ngUtils.provide("component");
var provideDirective = ngUtils.provide("directive");
var provideService = ngUtils.provide("service");
// Useful Request Shortcuts
var requestModule = ngUtils.request("module");
var requestController = ngUtils.request("controller");
var requestComponent = ngUtils.request("component");
var requestDirective = ngUtils.request("directive");
var requestService = ngUtils.request("service");