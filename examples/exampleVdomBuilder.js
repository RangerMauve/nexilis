"use strict";
var path = require("path");
var fs = require("fs");

var builder = require("../lib/vdomBuilder");
var treeify = require("../lib/treeify");
var tokenize = require("../lib/tokenize");
var templateName = path.join(__dirname, "./example.html");
var template = fs.readFileSync(templateName, "utf8");

var tokens = tokenize(template);
var tree = treeify(tokens);
var renderer = builder(tree);

console.log(renderer);
