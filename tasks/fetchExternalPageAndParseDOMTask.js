/*  -------------------------------------------------------------
    Nasqueron API - datasources
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Author:         Sébastien Santoro aka Dereckson
    Licence:        BSD-2-Clause
    -------------------------------------------------------------    */

"use strict";

const cheerio = require('cheerio');
const domhandler = require("domhandler");
const htmlparser2 = require('htmlparser2');
const http = require("http");

/*  -------------------------------------------------------------
 *  :: Handle DOM operations
 *  :: Fetch HTML page and send it to parser
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

class fetchExternalPageAndParseDOMTask {
    constructor(url, sendResponseCallBack) {
        this.url = url;
        this.sendResponse = sendResponseCallBack;
    }

    run(res) {
        const parser = this.getParser(res);
        this.fetchExternalPage(res, parser);
    }

    getParser (res) {
        let that = this;

        return new htmlparser2.Parser(new domhandler.DomHandler(function(error, dom) {
            if (error) {
                console.error("DOM error: " + error);
                res.status(500).end("Can't parse changelog.");
                return;
            }

            that.sendResponse(res, cheerio.load(dom));
        }));
    }

    fetchExternalPage (res, parser) {
        http.get(this.url, function(externalResponse) {
            if (externalResponse.statusCode !== 200) {
                console.error("Error: " + externalResponse.statusMessage);
                res.status(500).end("Can't fetch changelog.");
                return;
            }

            externalResponse.setEncoding('utf8');
            externalResponse.on('data', (chunk) => { parser.write(chunk); });
            externalResponse.on('end', () => { parser.end(); });
        });
    }
}

module.exports = fetchExternalPageAndParseDOMTask;
