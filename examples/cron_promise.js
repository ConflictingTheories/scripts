var p = require('../lib/javascript/patterns.js');
var cron = require('node-cron');


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

// CRON WRAPPER
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

// CRON JOB
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
// CRON JOB
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

// CRON JOB
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

// MAIN LOOP
function main() {
    let stack = [];
    let register = p.registrator(stack);
    let schedule = p.scheduler(stack);
    let start = Promise.resolve();
    start
        .then(() => register("action_1", p.via(doActionPM)))
        .then(() => register("action_2", p.via(doActionPM)))
        .then(() => schedule("job_id1","*/2 * * * * *", cronJob))
        .then(() => schedule("job_id2","*/15 * * * * *", cronJob2))
        .then(() => schedule("job_id3","*/10 * * * * *", cronJob3))
        .catch((err) => console.error("ERROR:", err, "\nSTACK DUMP::", stack));
}

main()