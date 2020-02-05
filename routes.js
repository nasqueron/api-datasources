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
    url: "dev/openfire/changelog",
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

function getUrl(req) {
  const port = app.get("port");
  let url = req.protocol + "://" + req.hostname;

  if (isPortRequired(req.protocol, port)) {
    url += ":" + port;
  }

  url += req.url;

  return url;
}

router.get('/', function(req, res) {
  let url = getUrl(req);

  res.send(JSON.stringify(formatDatasources(url)));
});

datasources.forEach(function (datasource) {
  router.get('/' + datasource.url, function (req, res) {
    require("./controllers/" + datasource.controller)
        .get(req, res);
  });
});

module.exports = router;
