// ============================
// Javascript Design Patterns
// ============================
// Copyright (c) Kyle Derby MacInnis

var p = require('../lib/patterns.js');

// TOOLS
var via = p.via;
var registrator = p.registrator;
var accumulator = p.accumulator;
var scheduler = p.scheduler;

// MAIN LOOP
(function main() {
    let stack = [];
    let register = registrator(stack);
    let accumulate = accumulator(stack);
    let schedule = scheduler(stack);
    let scheduleCustom = scheduler(stack, customHandler);
    let start = Promise.resolve();
    start
        .then(() => register("setup", via(doActionPM))) // Setup Actions 
        .then(() => accumulate("setup", via(doActionPM))) // More Setup Actions
        .then(() => schedule("good_jobs", "*/2 * * * * *", cronJob)) // Job 1
        .then(() => schedule("bad_jobs", "*/15 * * * * *", cronJob2)) // Job 2 // Fails -- should kill how system
        .then(() => schedule("good_jobs", "*/10 * * * * *", cronJob3)) // Job 3
        .then(() => console.log("JOBS STARTED::\n", stack))
        .catch((err) => console.error("ERROR:", err, "\nSTACK DUMP::", stack));
})();
// TEST ACTION DUMMY
function doActionPM(ms) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(true), ms)
        } catch (e) {
            reject(e);
        }
    });
}
// CRON WRAPPER (for example purposes --> use scheduler)
function createCronJobWrapper(id, stack, cronJob) {
    return () => {
        let register = p.registrator(stack);
        let start = Promise.resolve();
        start
            .then(() => register("", p.via(cronJob())))
            .catch((err) => {
                console.error("ID:", id, "\nERROR:", err)
                stack[id].destroy();
                process.exit();
            });
    }
}
// CRON JOB #1
function cronJob() {
    return new Promise((resolve, reject) => {
        console.log("running job")
        // Do Job Here
        let a = 1;
        let b = 2;
        if (b == 2) {
            resolve(true);
        }
    });
}
// CRON JOB #2
function cronJob2() {
    return new Promise((resolve, reject) => {
        console.log("WSS:2");
        let client = new WebSocketClient();
        client.connect('wss://echo.websocket.org')
        client.on('connect',function(ws){
            console.log('connected - 2');
            ws.on('error', function(err){
                console.error("error:");
                ws.close();
                reject(err);
            });
            ws.on('message', function(msg){
                console.log("recived - 2");
                ws.close();
                resolve(true);
            });
            ws.on('close',function(ws){
                console.log("closed - 2");
            });
            ws.send('message',"yo");
        });
    });
}

const WebSocketClient = require('websocket').client;

// CRON JOB #3
function cronJob3() {
    return new Promise((resolve, reject) => {
        console.log('WSS:3')
        let client = new WebSocketClient();
        client.connect('wss://echo.websocket.org')
        client.on('connect',function(ws){
            console.log('connected - 3');
            ws.on('error', function(err){
                console.error("error:");
                reject(err);
            });
            ws.on('message', function(msg){
                console.log("recived - 3");
                ws.close();
                resolve(true);
            });
            ws.on('close',function(ws){
                console.log("closed - 3");
            });
            ws.send('message',"yo");
        });
    });
}
// CUSTOM ERROR HANDLER FOR CRON JOBS
function customHandler(stack) {
    return (id, cronJob) => {
        return () => {
            Promise.resolve()
                .then(() => registrator(stack)("",via(cronJob)))
                .catch((err) => {
                    console.error("ID:", id, "\nERROR:", err)
                    for (j_id of stack[id]) {
                        j_id.destroy();
                    }
                    console.log("Custom --- Handler");
                    process.exit();
                });
        }
    }
}