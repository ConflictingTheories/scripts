var p = require('../lib/javascript/patterns.js');
var cron = require('node-cron');


// TOOLS
var via = p.via;
var registrator = p.registrator;
var accumulator = p.accumulator;
var scheduler = p.scheduler;

// MAIN LOOP
(function main() {
    let stack = [];
    let register = registrator(stack);
    let schedule = scheduler(stack);

    let start = Promise.resolve();
    start
        .then(() => register("action_1", via(doActionPM)))
        .then(() => register("action_2", via(doActionPM)))
        .then(() => schedule("job_id1","*/2 * * * * *", cronJob))
        .then(() => schedule("job_id2","*/15 * * * * *", cronJob2))
        .then(() => schedule("job_id3","*/10 * * * * *", cronJob3))
        .then(()=>console.log(stack))
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
        console.log("running job -2")
        // Do Job Here
        let a = 1;
        let b = 2;
        if (b == 2) {
            reject("break::");
        }
    });
}
// CRON JOB #3
function cronJob3() {
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
