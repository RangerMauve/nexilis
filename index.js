"use strict";
var Lignum = require("./lib/lignum");
var stringBuilder = require("./lib/stringBuilder");

var defaultInstance = new Lignum(stringBuilder);

defaultInstance.Lignum = Lignum;

module.exports = defaultInstance;
