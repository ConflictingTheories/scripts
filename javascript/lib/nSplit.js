function nSplit(msg, n) {
    let expr = new RegExp(".{1," + n + "}", "g");
    let presplit = msg.match(expr);
    let twoSplit = presplit.map((x) => {
        if (x.length != n) {
            let i = 0;
            let ret = "";
            while (i < n - x.length) {
                ret += " ";
                i++
            };
            return x + ret;
        } else
            return x;
    });
    return twoSplit;
}

function backSwap(msg) {
    let newBw = "";
    let newFw = "";
    let newArr = [];
    for (let fw = 0; fw < msg.length; fw++) {
        let bw = msg.length - (fw + 1);
        let myFw = msg[fw];
        let myBw = msg[bw];
        newFw = myBw[0] + myFw.slice(1);
        newBw = myFw[0] + myBw.slice(1);
        newArr[fw] = newFw;
        newArr[bw] = newBw;
        // console.log(fw, newFw, bw, newBw);
        if (bw <= fw)
            break;
    }
    return newArr;
}

function encode(msg, n) {
    let comp_msg = msg.split(' ').join('');
    let split_msg = nSplit(comp_msg, n);
    return backSwap(split_msg);
}

// var myLoveMsg = "Dear Jade, I love you so much! Lets go on adventures & make memories.";

var myLoveMsg = "Ja de Il ov ey ou so mu ch .Y ou ar ew on de rf ul an da ma zi ng in so ma ny wa ys .Y ou ar et ru ly sp ec ia lt om eb ee b an dl ho pe we ca ns up po rt ea ch ot he ra nd be tw ee nu sd oa ma zi ng th in gs ❤";
// var rvLoveMsg = "se ir oa ee eI ao &e eo us nm vc a! oe gs to Ln hd ue ot ur ys vm lk ,m dm Jr ae D.";
var rvLoveMsg = ".a ge il tv ny zu mo ou sh nY eu tr bw nn re hf ol cn ea ra pi ug nn co wa py ha ds aY bu er et ou ly ip ec sa lt rm eb ae o, .n yl wo ne me sa is np zo mt da ah ut re da od ee aw oe .u cd ma sa oi eg oh In ds J❤";


var nwsMsg = myLoveMsg.split(' ').join('');
var nwsrvMsg = rvLoveMsg.split(' ').join('');



var myCode = nSplit(myLoveMsg, 2);
var nwsCode = nSplit(nwsMsg, 2);
var nwsrvCode = nSplit(nwsrvMsg, 2);

var bsmyCode = backSwap(myCode);
var bsmynwsCode = backSwap(nwsCode);
var bsmynwsrvCode = backSwap(nwsrvCode);

console.log(myLoveMsg);
// console.log(myCode.join(' '));
// console.log(bsmyCode.join(' '));

console.log(nwsCode.join(' '));
console.log(bsmynwsCode.join(' '));


console.log(nwsrvCode.join(' '));
console.log(bsmynwsrvCode.join(' '));

// let myText = encode("Hello Dawg, HEllo DAWGDJLKSAD", 2);
// console.log(myText.join(' '));