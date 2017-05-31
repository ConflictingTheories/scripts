// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis

// Main Patterns Object
const Patterns = {
    // From Wrapper (For readability)
    from: (fn) => fn.apply(fn, arguments),
    // Creates a promise from input
    via: (object) => {
        // If a promise
        if (typeof object === "object" && typeof object.then === "function") return object;
        // If a function that returns a promise
        else if (typeof object === "function" && typeof object().then === "function") return object();
        // If not a promise or returns a promise
        else return Promise.resolve(object);
    },
    // Memoize a Function (allows for custom key generator)
    memoize: (fn, keygen) => {
        let memoized = () => {
            // Actual Cache Object
            memoized.cache = {};
            // Used to Determine Inputs
            keygen = keygen || JSON.stringify;
            // Setup the Cache
            let cache = memoized.cache;
            // Extract Inputs
            let args = Array.prototype.slice.call(arguments);
            // Generate Cache Key
            let key = keygen.apply(this, args);
            // Return Cached value (if Exists - otherwise cache for next time)
            return (key in cache) ? cache[key] : (cache[key] = fn.apply(this, arguments));
        };
        // Return Memoized Function
        return memoized;
    },
    // Returns functions that can be initialized in part and passed along with memory
    curry: (fn) => {
        // Total number of Arguments in function
        let argCount = fn.length;
        // Use Closures to maintain arg list
        return (function curry() {
            // Copies a list of arguments (if any)
            let memory = Array.prototype.slice.call(arguments);
            // Returns the curried verion (or final result if completed)
            return function () {
                // This is actual storage during partial initialization
                let internal = memory.slice();
                // Push Argument into Memory
                Array.prototype.push.apply(internal, arguments);
                // If all arguments finish - else anotherLayer
                let next = internal.length >= argCount ? fn : curry;
                // continue until finished
                return next.apply(null, internal);
            };
        })();
    },
    // Register for Promises (Object to store results into) ( > ) (injector - Assignor)
    registrator: (stack) => {
        // Returns a function to Chain promises together with property names
        return function (property, promise) {
            // The function returns a new Promise for the Chain itself
            return new Promise((resolve, reject) => {
                // Create Link in the Chain - If Function (not Promise) then resolve to promise
                let doAction = (typeof promise === "function") ? promise() : promise;
                // Resolve Promise and retrieve result
                doAction.then((result) => {
                        // If Property name is Set and prop exists
                        //if (property && property != "" && prop) {
                        // If Property name is Set (includes undefined)    
                        if (property && property != "") {
                            // Set New Property
                            stack[property] = result;
                        }
                        // If "" then send through as if not here
                        else if (property === "") {
                            resolve(result);
                        }
                        // If Property is Null (Used for Chaining Chains) (but not undefined)
                        else if (property === null) {
                            // Merge Keys with New in Favour of Old
                            for (let key in result) {
                                stack[key] = result[key];
                            }
                        }
                        // Resolve New Return Object
                        resolve(stack);
                    })
                    .catch((err) => {
                        console.error("ERROR::", err);
                        reject(err);
                    });
            });
        }
    },
    // Accumulator for Promises into Arrays or Objects at a deeper level (Appends - Doesnt Overwrite) ( >> )
    accumulator: (stack) => {
        // Returns a function to Chain promises together with property names
        return (property, promise) => {
            // The function returns a new Promise for the Chain itself
            return new Promise((resolve, reject) => {
                // Create Link in the Chain - If Function (not Promise) then resolve to promise
                let doAction = (typeof promise === "function") ? promise() : (typeof promise.then === "function") ? promise : Promise.resolve(promise);
                // Resolve Promise and retrieve result
                doAction.then((result) => {
                        // If Array is sent in (Concat)
                        if (ToolLIB._isArray(result)) {
                            // If Property name is Set and prop exists
                            if (property && property !== "") {
                                // Concat new Values into Array
                                if (ToolLIB._isArray(stack[property])) {
                                    stack[property] = stack[property].concat(result);
                                } else {
                                    stack[property] = [stack[property]].concat(result);
                                }
                                resolve(stack);
                            }
                            // Just Pass Through
                            else if (property === "") {
                                resolve(result);
                            }
                        }
                        // Else if number (sum)
                        else if (typeof result === "number") {
                            if (property && property !== "") {
                                if (ToolLIB._isArray(stack[property])) {
                                    stack[property].push(result);
                                } else if (typeof stack[property] === "number") {
                                    stack[property] += result;
                                } else {
                                    stack[property] = stack[property] ? [stack[property]] : [];
                                    stack[property].push(result);
                                }
                            }
                            // Resolve
                            resolve(stack);
                        }
                        // Else - Push value into Property
                        else {
                            if (property && property !== "") {
                                // Push new Value into Array
                                if (ToolLIB._isArray(stack[property])) {
                                    stack[property].push(result);
                                } else {
                                    let newData = stack[property] ? [stack[property]] : [];
                                    newData.push(result);
                                    stack[property] = newData;
                                }
                            }
                            // Just Pass Through 
                            else if (property === "") {
                                resolve(result);
                            }
                            // If Property is Null (Used for Chaining Chains) (but not undefined)
                            else if (property === null) {
                                // Merge Keys with New in Favour of Old
                                for (let key in result) {
                                    if (stack[key]) {
                                        if (ToolLIB._isArray(result[key])) {
                                            stack[key] = stack[key].concat(result[key]);
                                        } else {
                                            stack[key].push(result[key]);
                                        }
                                    } else {
                                        if (ToolLIB._isArray(result[key])) {
                                            stack[key] = stack[key] ? [stack[key]].concat(result[key]) : [].concat(result[key]);
                                        } else {
                                            stack[key] = stack[key] ? [stack[key]] : [];
                                            stack[key].push(result[key]);
                                        }
                                    }
                                }
                            }
                            // Resolve New Return Object
                            resolve(stack);
                        }
                    })
                    .catch((err) => {
                        console.error("ERROR::", err);
                        reject(err);
                    });
            });
        }
    },

    // Look into Strategies

    // Look into Mediators

    // Look into Function Generators (Factories?)

    // Look into Generators

    // Look into Runners

    // Look into Virtual Machine

    // Look into Building out a General Platform of Tools (toolchain)
}

module.exports = Patterns;