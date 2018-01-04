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
const ChartjsNode = require('chartjs-node');
const Promise = require('bluebird');
const app = express();
const server = require('http').Server(app);

const xrp = require('./lib/xrp-gen');

// VARIABLES
let port = 4000;

// INTERNAL LIBRARIES
const cacheBTC = require('./lib/cache-btc');
//
//

var Rates = {};

// PARSE DATA COMING IN
app.set('view engine', 'ejs');
app.use(cp());
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({
    extended: false
}));



app.use('/pub', express.static(__dirname + '/pub'));


app.use("/gen/xrp", (req,res,next) => {
	const seed = xrp.generateSeed();
	const keypair = xrp.deriveKeypair(seed);
	const address = xrp.deriveAddress(keypair.publicKey);
	res.json({
		seed: seed,
		keypair: keypair,
		addr: address
	});
});
// ROOT URL
app.use("/live/:ticket", (req, res, next) => {
    let ticket = req.params.ticket;
    // var chartJsOptions = cacheBTC.fetch();
    cacheBTC.fetch(ticket)
        .then((ret) => {
            if (!Rates[ticket])
                Rates[ticket] = [];
            Rates[ticket].push(ret);
            res.send(ret);
        })
        .catch((err) => console.error("FAILED"));

});


app.use("/chart/all", (req, res, next) => {
    let tickers = ['btc-usd', 'eth-usd', 'xmr-usd', 'dsh-usd', 'xrp-usd'];
    cacheBTC.fetchAll(tickers)
        .then((ret) => {
            let data = [];
            let tickers = [];
            let curs = [];
            let retArr = Array.from(ret);
            for (entry of ret) {
                data.push(parseFloat(entry.ticker.ticker.price));
                tickers.push(entry.ticker.ticker.base);
                curs.push(entry.ticker.ticker.target);
            }

            let chartJsOptions = OptionsChart(tickers, data);
            console.log(chartJsOptions.data);

            let chartNode = new ChartjsNode(600, 600);
            chartNode.drawChart(chartJsOptions)
                .then(() => {
                    // chart is created

                    // get image as png buffer
                    return chartNode.getImageBuffer('image/png');
                })
                .then(buffer => {
                    Array.isArray(buffer) // => true
                        // as a stream
                    return chartNode.getImageStream('image/png');
                })
                .then(streamResult => {
                    // using the length property you can do things like
                    // directly upload the image to s3 by using the
                    // stream and length properties
                    streamResult.stream // => Stream object
                    streamResult.length // => Integer length of stream
                        // write to a file
                    return chartNode.writeImageToFile('image/png', __dirname + '/pub/chart.png');
                })
                .then(() => {
                    // chart is now written to the file path
                    // ./testimage.png
                    // res.sendFile(__dirname + '/pub/chart.png');

                    res.send('<html><body><img src="/pub/chart.png"></img><script></script></body></html>')
                });

            // res.send(ret);
        })
        .catch((err) => console.error(err));
});

app.use("/chart/:ticket", (req, res, next) => {
    let ticket = req.params.ticket;

    cacheBTC.fetch(ticket)
        .then((ret) => {
            console.log(ret)
            let ticker = ret.ticker.ticker.base;
            let data = parseFloat(ret.ticker.ticker.price);
            let cur = ret.ticker.ticker.target;
            let chartJsOptions = OptionsChart(ticker, data);
            console.log(chartJsOptions);

            let chartNode = new ChartjsNode(600, 600);
            chartNode.drawChart(chartJsOptions)
                .then(() => {
                    // chart is created
                    // get image as png buffer
                    return chartNode.getImageBuffer('image/png');
                })
                .then(buffer => {
                    Array.isArray(buffer) // => true
                        // as a stream
                    return chartNode.getImageStream('image/png');
                })
                .then(streamResult => {
                    // using the length property you can do things like
                    // directly upload the image to s3 by using the
                    // stream and length properties
                    streamResult.stream // => Stream object
                    streamResult.length // => Integer length of stream
                        // write to a file
                    return chartNode.writeImageToFile('image/png', __dirname + '/pub/chart.png');
                })
                .then(() => {
                    res.send('<html><body><img src="/pub/chart.png"></img><script></script></body></html>')
                });

            // res.send(ret);
        })
        .catch((err) => console.error(err));
    // 600x600 canvas size


});

function OptionsChart(tickers, data) {
    console.log("-----DATA::", data)
    let dataSets = []

    dataSets = [];
    for (let i = 0; i < data.length; i++) {
        dataSets.push({
            label: tickers[i],
            data: [data[i]],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 0.2)"],
            borderWidth: 1
        });
    }

    return {
        "type": "bar",
        "data": {
            "labels": [tickers],
            "datasets": dataSets
        },
        "options": {
            "scales": {
                "yAxes": [{
                    "ticks": {
                        "beginAtZero": true
                    }
                }]
            }
        }
    };
}

// LISTEN ON PORT
server.listen(port, () => {
    console.log('Now Live @ localhost:', port);
});

// FALLBACK FOR PORT
process.on("uncaughtException", function(e) {
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
