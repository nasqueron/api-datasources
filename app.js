/*  -------------------------------------------------------------
    Nasqueron API - datasources
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Author:         Sébastien Santoro aka Dereckson
    Licence:        BSD-2-Clause
    -------------------------------------------------------------    */

"use strict";

const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev', {
    skip: function (req, res) {
        return res.statusCode < 400;
    },
}));

module.exports = app;

app.use('/', require('./routes'));
