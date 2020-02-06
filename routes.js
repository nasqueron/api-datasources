/*  -------------------------------------------------------------
    Nasqueron API - datasources
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    Author:         Sébastien Santoro aka Dereckson
    Licence:        BSD-2-Clause
    -------------------------------------------------------------    */

"use strict";

const express = require('express');
const router = express.Router();
const app = require('./app');

/*  -------------------------------------------------------------
    Datasources
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

const datasources = [
  {
    url: "/dev/openfire/changelog",
    controller: "/dev/openfire/changelog.js",
    description: "Openfire changelog",
  },
];

function formatDatasources(base_url) {
  return datasources.map(function (item) {
    return {
      "description": item.description,
      "URL": base_url + item.url,
    };
  });
}

/*  -------------------------------------------------------------
    Routes
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -    */

function isPortRequired(protocol, port) {
  return (protocol === "http" && port !== 80) ||
         (protocol === "https" && port !== 443);
}

function getServerUrl(req) {
  const port = app.get("port");
  let url = req.protocol + "://" + req.hostname;

  if (isPortRequired(req.protocol, port)) {
    url += ":" + port;
  }

  return url;
}

router.get("/", function(req, res) {
  const api_entry_point = process.env.API_ENTRY_POINT || '/datasources';
  const url = getServerUrl(req) + api_entry_point;

  res.send(JSON.stringify(formatDatasources(url)));
});

datasources.forEach(function (datasource) {
  router.get(datasource.url, function (req, res) {
    require("./controllers/" + datasource.controller)
        .get(req, res);
  });
});

module.exports = router;
