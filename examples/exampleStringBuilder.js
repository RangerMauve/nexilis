"use strict";
var path = require("path");
var fs = require("fs");

var stringBuilder = require("../lib/stringBuilder");
var treeify = require("../lib/treeify");
var tokenize = require("../lib/tokenize");
var templateName = path.join(__dirname, "./example.html");
var template = fs.readFileSync(templateName, "utf8");
var inspect = require("util").inspect;

var tokens = tokenize(template);
var tree = treeify(tokens);
var fn = stringBuilder(tree);

console.log(fn);
