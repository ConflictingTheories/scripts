"using strict";

const request = require('request');
const parser = require('htmlparser2');
const fs = require('fs');
//const p = require('../../javascript/lib/patterns.js');

const DIRECTORY_URL = "http://directory.io";
const BLOCKCHAIN_URL = "https://blockchain.info/address";

// Files
const OUT_CASH = "money.output";
const TRANS_CASH = "trans.output";
const LAST_CNT = "last.cnt";

// Max Page
const MAX_PAGE = 904625697166532776746648320380374280100293470930272690489102837043110636675;

const directoryParser = parser.Parser({
    onopentag: function(name, attrs) {
        // What to do when you get to a tag
    },
    ontext: function(text) {
        // What is the InnerHTML
        console.log("\n", text);
    },
    onclosetag: function(tagname) {
        // What to do when you get to the end of a tag
    }
});

// Run Data Miner
(function() {

    let page_cnt = 0;
    let curr_addr = "";
    let private_key = "";
    let money_addr = "";
    let money_cmpr = "";

    //Flags 
    let mny = false; // money found
    let trans = false; // trans found
    let brk = false; // break loop

    // Open files
    let money_out = fs.openSync(OUT_CASH, 'w+');
    let trans_out = fs.openSync(TRANS_CASH, 'w+');
    let last_cnt = fs.openSync(LAST_CNT, "w+");


    // Request Directory Page
    OUTER: while (curr_addr < MAX_PAGE) {
        setTimeout(() => request(DIRECTORY_URL + "/" + curr_addr, (error, response, body) => {
            console.log(body);
            let count = -1;

            let blockchainParser = new parser.Parser({
                onopentag: function(name, attrs) {
                    // What to do when you get a tag
                },
                ontext: function(text) {
                    // What to do with the text
                },
                onclosetag: function(tagname) {
                    // What to do at the end of a tag
                }
            }, { decodeEntities: true });
            // HTML PARSER - Directory
            let directoryParser = new parser.Parser({
                onopentag: function(name, attrs) {
                    // What to do when you get to a tag
                },
                ontext: function(text) {
                    // What is the InnerHTML
                    console.log("\n", text);
                    if (count == 2) {
                        request(BLOCKCHAIN_URL + "/" + curr_addr, (err, resp, bdy) => {
                            let blockParser = blockchainParser;
                            blockParser.write(body);
                            blockParser.end();
                        });
                    } else if (count == 1) {
                        curr_addr = text;
                        count = 2;
                    } else if (count == 0) {
                        private_key = text;
                        count = 1;
                    }
                    if (text == "+") {
                        count = 0;
                    }

                },
                onclosetag: function(tagname) {
                    // What to do when you get to the end of a tag
                }
            }, { decodeEntities: true });
            console.log(directoryParser)
            directoryParser.write(body);
            directoryParser.end();
            brk = true;
        }), 2);
        if (brk)
            break OUTER;
        curr_addr++;
        break;
    }

    // Parse List of keys/Addresses/Compressed Addresses

    // Request Address Page for each

    // If Transactions Store in transaction list

    // If contains money - store in the money list

    // Repeat forever
})();