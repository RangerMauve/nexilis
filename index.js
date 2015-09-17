"use strict";
var Nexilis = require("./lib/nexilis");
var stringBuilder = require("./lib/stringBuilder");

var defaultInstance = new Nexilis(stringBuilder);

defaultInstance.Nexilis = Nexilis;

module.exports = defaultInstance;
