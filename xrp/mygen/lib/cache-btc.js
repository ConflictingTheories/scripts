const request = require('request-promise');
const P = require('./patterns');

module.exports = {

    fetchAll: (tickets) => {
        return new Promise((resolve, reject) => {
            // Tools
            var stack = {};
            var register = P.registrator(stack);
            var accumulate = P.accumulator(stack);
            var via = P.via;
            // Loop
            var loop = [];
            var obj = [];
            // Rates
            var getCurrEx = request('https://api.fixer.io/latest?base=USD&symbols=CAD');
            register('CURR', via(getCurrEx))
                .then(() => {
                    let start = Promise.resolve();
                    // Loop through Tickets
                    tickets.forEach(ticket => {
                        var getTicketEx = request('https://api.cryptonator.com/api/ticker/' + ticket);
                        start = start
                            .then(() => register(ticket, via(getTicketEx)))
                            .then(() => {
                                console.log(stack, ticket);
                                let cc = JSON.parse(stack['CURR']);
                                let st = JSON.parse(stack[ticket]);
                                let ret = [st.ticker.base, " :: ", st.ticker.price * cc.rates.CAD, " :: (+/-) ", st.ticker.change * cc.rates.CAD];
                                obj.push({
                                    ret: ret.join(''),
                                    ticker: st
                                });
                            })
                            .catch((err) => console.error(err));
                    });
                    start.then(() => {
                            resolve(obj);
                        })
                        .catch((err) => console.error(err));
                }).catch((err) => console.error(err));
        });
    },
    fetch: (ticket) => {
        return new Promise((resolve, reject) => {
            var getCurrEx = request('https://api.fixer.io/latest?base=USD&symbols=CAD');
            var getTicketEx = request('https://api.cryptonator.com/api/ticker/' + ticket);
            // Tools
            var stack = {};
            var register = P.registrator(stack);
            var accumulate = P.accumulator(stack);
            var via = P.via;
            // Run
            Promise.resolve()
                .then(() => register('CURR', via(getCurrEx)))
                .then(() => register(ticket, via(getTicketEx)))
                .then((arr) => {
                    let cc = JSON.parse(stack['CURR']);
                    let st = JSON.parse(stack[ticket]);
                    let ret = [st.ticker.base, " :: ", st.ticker.price * cc.rates.CAD, " :: (+/-) ", st.ticker.change * cc.rates.CAD];
                    resolve({ ret: ret.join(""), ticker: st });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    cache: () => {

    }
};
