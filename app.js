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

const api_entry_point = process.env.API_ENTRY_POINT || '/datasources';
app.use(api_entry_point, require('./routes'));
