// Copyright (c) 2017 - Kyle Derby MacInnis
// Any unauthorized distribution or transfer
// of this work is strictly prohibited.
// All Rights Reserved.
//

// REFER TO THE LICENSE FILE FOR INFORMATION REGARDING LICENSING **

// THIRD-PARTY LIBRARIES
// Express + Third-Party Libraries
const bp = require('body-parser');
const cp = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const app = express();
const server = require('http').Server(app);

// VARIABLES
let port = 4000;

// INTERNAL LIBRARIES
//
//
//

// PARSE DATA COMING IN
app.set('view engine', 'ejs');
app.use(cp());
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({
    extended: false
}));

// ROOT URL
app.use("/", (req, res, next) => {
    res.send("/ --> coming soon");
});

// LISTEN ON PORT
server.listen(port, () => {
    console.log('Now Live @ localhost:', port);
});

// FALLBACK FOR PORT
process.on("uncaughtException", function (e) {
    if (e.errno === "EADDRINUSE") {
        console.log("Error ---> Port in Use: Please select another port: ");
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('PORT IN USE: Please select a different port (3000+)? ', (answer) => {
            // TODO: Log the answer in a database
            rl.close();
            port = answer;
            server.listen(port);
        });
    }
});

module.exports = server;