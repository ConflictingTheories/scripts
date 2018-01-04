// Copyright (c) Kyle Derby MacInnis

var p = require('../lib/patterns.js');

// TOOLS
var via = p.via;
var registrator = p.registrator;
var accumulator = p.accumulator;
var scheduler = p.scheduler;
var repeater = p.repeater;
var stopper = p.stopper;

// MAIN LOOP
(function main() {
    let stack = [];
    let register = registrator(stack);
    let accumulate = accumulator(stack);
    let schedule = scheduler(stack);
    let repeat = repeater(stack);
    let stop = stopper(stack);
    let start = Promise.resolve();
    start
        .then(() => register("setup", via(doActionPM()))) // Setup Actions 
        .then(() => console.log("JOBS STARTED::\n", stack))
        .catch((err) => console.error("ERROR:", err, "\nSTACK DUMP::", stack));
})();

// TEST ACTION DUMMY
function doActionPM() {
    return new Promise((resolve, reject) => {
        try {
            // Perform hash
            let outCode = hashCode("a", 16);
            console.log(outCode);
            let outcode = dehashCode(outCode);
            resolve(outCode);
        } catch (e) {
            reject(e);
        }
    });
}

function hashCode(input, base) {
    console.log("running")
    let codeArray = input.split('');
    let buffer = new Buffer(input);
    let sum = 0;
    let asum = 0;

    let mul = 0xa;
    let amul = 0xa;

    let newArray = [];
    let i = 0;
    let enc = 0;
    let cnt = 0;
    let out = {};

    console.log(buffer);
    while (i < buffer.length) {
        // Read each Byte
        let char = buffer[i];
        // Read Upper / Lower Nibbles
        let upper = (char >> 4) % base; // Upper 4 bits
        let lower = char % base; // Lower 4 bits
        // Read each Bit
        let k = 8;
        while (k--) {
            let bit = (char >> k) & 0x1;
            let bot = calcEncoderA(enc, bit);
            let but = calcEncoderB(bit, bot);
            console.log("OUT::", enc, bit, bot, but);
            enc = bit;
            out.bit = bit;
            out.bot = bot;
            out.but = but;
            out.cnt = out.cnt ? out.cnt + 1 : 1;
        }
        i++;
    }
    return out;
}

function dehashCode(encoded) {
    let bit = null;
    let bot = encoded.bot;
    let but = encoded.but;
    let cnt = encoded.cnt;

    let newArray = [];
    let i = 0;
    let enc = 0;

    while (i < cnt / 8) {
        // Read each Bit
        let char = 0;
        let k = 8;
        while (k--) {
            // console.log("OUT:::", enc, bit, bot, but);
            let A = calcDecoderA(bot);
            // console.log("A:", A);
            let B = calcDecoderB(but)
                // console.log("B", B);
            enc = A.enc;
            bit = A.bit;
            bot = B.encbut;
            let C = calcDecoderA(bot)
            console.log("OUT:::", C, enc, bit, bot, but);
            char = char | (bit << k);
        }
        newArray.unshift(char);
        i++;
    }
    return newArray.join('');
}

function calcEncoderA(enc, bit) {
    var lookupA = [
        [0x1, 0x0],
        [0x3, 0x2]
    ]
    let out = lookupA[enc][bit];
    return out;
}

function calcDecoderA(val) {
    var lookupA = [
        [0x1, 0x0],
        [0x3, 0x2]
    ]
    let i = 2;
    let ret = {};
    while (i--) {
        let j = 2;
        while (j--) {
            if (lookupA[i][j] === val) {
                ret = { enc: i, bit: j };
                break;
            }
        }
    }
    return ret;
}

function calcEncoderB(bit, bot) {
    var lookupB = [
        [0x1, 0x2, 0x3, 0x4],
        [0x5, 0x6, 0x7, 0x0],
        [0xa, 0xb, 0xc, 0x9],
        [0xd, 0xe, 0xf, 0x8]
    ]
    let out = lookupB[bit][bot];
    return out;
}

function calcDecoderB(val) {
    var lookupB = [
        [0x1, 0x2, 0x3, 0x4],
        [0x5, 0x6, 0x7, 0x0],
        [0xa, 0xb, 0xc, 0x9],
        [0xd, 0xe, 0xf, 0x8]
    ]
    let i = 2;
    let ret = {};
    while (i--) {
        let j = 4;
        while (j--) {
            if (lookupB[i][j] === val) {
                ret = {
                    encbut: i,
                    but: j
                };
                break;
            }
        }
    }
    return ret;
}


// TIME JOB
function timeJob() {
    return new Promise((resolve, reject) => {
        let time = Date();
        console.log(time);
        resolve(time);
    });
}