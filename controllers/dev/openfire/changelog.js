/*  -------------------------------------------------------------
    Nasqueron API - datasources
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Author:         Sébastien Santoro aka Dereckson
    Licence:        BSD-2-Clause
    -------------------------------------------------------------    */

"use strict";

const fetchExternalPageAndParseDOMTask = require("../../../tasks/fetchExternalPageAndParseDOMTask");

/*  -------------------------------------------------------------
    Settings
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

const URL = "http://download.igniterealtime.org/openfire/docs/latest/changelog.html";

/*  -------------------------------------------------------------
 *  Parse changelog
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

class ChangeLogParser {
    constructor() {
        this.entries = [];
    }

    parse($) {
        const that = this;

        $("h2").each(function () {
            const heading = $(this).text();
            if (heading.includes(" -- ")) {
                that.parseEntry(heading.trim());
            }
        });

        return this;
    }

    static parseDate(date) {
        return Date.parse(date) / 1000;
    }

    parseEntry(entry) {
        const fragments = entry.split(" -- ");
        this.entries.push({
            date: ChangeLogParser.parseDate(fragments[1]),
            version: fragments[0],
        });
    }

    get changelog() {
        return this.entries;
    }

    static ToJSON(dom) {
        return JSON.stringify(new ChangeLogParser()
            .parse(dom)
            .changelog
        );
    }
}

/*  -------------------------------------------------------------
    Handle request
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

exports.get = function(req, res) {
    let task = new fetchExternalPageAndParseDOMTask(URL, function(res, dom) {
        res.send(ChangeLogParser.ToJSON(dom));
    });

    task.run(res);
};
