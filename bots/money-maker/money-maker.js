"using strict";
// PARSING
const request = require('request');
const parser = require('htmlparser2');
const bigint = require('big-integer');
// SENDGRID EMAIL STUFF
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
// URLS
const DIRECTORY_URL = "http://directory.io";
const BLOCKCHAIN_URL = "https://blockchain.info/address";
// Max Page
const MAX_PAGE = '904625697166532776746648320380374280100293470930272690489102837043110636675';
const SEED = bigint.randBetween(0, MAX_PAGE);
const MOD_LEN = MAX_PAGE;
const ADD_LEN = bigint.randBetween(0, MAX_PAGE);
// Parsing Details
let count = -1;
let page_cnt = 0;
// Parsing
let curr_addr = "";
let private_key = "";
// Values
let money_keys = [];
let money_addrs = [];
let money_trans = [];
let money_balances = [];
let money_totals = [];
// Counts
let t_count = -1;
let tran_count = -1;
let mny_count = -1;
// Flags
let trans_set = false;
let total_set = false;
let balance_set = false;
let brk = false;

// Run Data Miner
(function() {
    // Request Directory Page
    rec_req(SEED);
})();

// HTML PARSER - Blockchain
const blockParser = new parser.Parser({
    onopentag: function(name, attrs) {
        // What to do when you get a tag
    },
    ontext: function(text) {
        // What to do with the text
        switch (text) {
            case "No. Transactions":
                //console.log(text);
                tran_count = 0;
                break;
            case "Total Received":
                //console.log(text);
                t_count = 0;
                break;
            case "Final Balance":
                //console.log(text);
                mny_count = 0;
                break;
        }
        if (tran_count === 2) {
            money_trans.push(text);
            trans_set = true;
            tran_count = -1;
        }
        if (t_count === 2) {
            money_totals.push(text);
            total_set = true;
            t_count = -1;
        }
        if (mny_count === 2) {
            money_balances.push(text);
            balance_set = true;
            mny_count = -1;
        }
        if (balance_set && total_set && trans_set) {
            //money_out
            balance_set = false;
            total_set = false;
            trans_set = false;

            let bal = money_balances.shift();
            let key = money_keys.shift();
            let addr = money_addrs.shift();
            let tot = money_totals.shift();
            let tr = money_trans.shift();

            if (bal !== "0 BTC") {
                console.log("FOUND:", key, addr, bal, tot, tr);
                var fromEmail = new helper.Email('confidential.inc@gmail.com');
                var toEmail = new helper.Email('kderbyma@gmail.com');
                var subject = 'BITCOIN FOUND :: Collect Now!';
                var content = new helper.Content('text/plain', 'ADDR<' + addr + '> : KEY<' + key + '> : BALANCE<' + bal + '>');
                var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                var req = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });
                // Send Email out
                sg.API(req, function(error, response) {
                    if (error) {
                        console.log('Error response received');
                        console.error(error);
                    } else {
                        console.log("EMAIL SENT")
                    }
                });
            }
        }
        if (t_count != -1)
            t_count++;
        if (mny_count != -1)
            mny_count++;
        if (tran_count != -1)
            tran_count++;
    },
    onclosetag: function(tagname) {
        // What to do at the end of a tag
    }
}, { decodeEntities: true });
// HTML PARSER - Directory
const directoryParser = new parser.Parser({
    onopentag: function(name, attrs) {
        // What to do when you get to a tag
    },
    ontext: function(text) {
        // What is the InnerHTML
        if (count == 4) {
            curr_addr = text;
            money_addrs.push(curr_addr);
            money_keys.push(private_key);
            request(BLOCKCHAIN_URL + "/" + curr_addr, (err, resp, bdy) => {
                blockParser.write(bdy);
                blockParser.end();
            });
            count = -1;
        } else if (count == 3) {
            count = 4;
        } else if (count == 2) {
            private_key = text;
            count = 3;
        } else if (count == 1) {
            count = 2;
        } else if (count == -1) {
            if (text === "+") {
                count = 1;
            }
        } else {
            //count = count++;
        }
    },
    onclosetag: function(tagname) {
        // What to do when you get to the end of a tag
    }
}, { decodeEntities: true });
// Rec Page Function
function rec_req(seed) {
    let SLICE_LEN = Math.floor((MAX_PAGE.length - 1) * Math.random());
    let page = seed ? seed.mod(MOD_LEN).toString().slice(0, SLICE_LEN) : toFixed(Math.floor(Math.random() * MAX_PAGE)).slice(Math.floor(Math.random() * 21));
    console.log(DIRECTORY_URL + "/" + page);
    request(DIRECTORY_URL + "/" + page, (error, response, body) => {
        count = -1;
        directoryParser.write(body);
        directoryParser.end();
        if (brk) {
            // do nothing
        } else
            rec_req(seed.add(ADD_LEN)); //break;
    });
}
// for page numbers
function toFixed(x) {
    var result = '';
    var xStr = x.toString(10);
    var digitCount = xStr.indexOf('e') === -1 ? xStr.length : (parseInt(xStr.substr(xStr.indexOf('e') + 1)) + 1);

    for (var i = 1; i <= digitCount; i++) {
        var mod = (x % Math.pow(10, i)).toString(10);
        var exponent = (mod.indexOf('e') === -1) ? 0 : parseInt(mod.substr(mod.indexOf('e') + 1));
        if ((exponent === 0 && mod.length !== i) || (exponent > 0 && exponent !== i - 1)) {
            result = '0' + result;
        } else {
            result = mod.charAt(0) + result;
        }
    }
    return result;
}