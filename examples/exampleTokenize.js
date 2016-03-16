"use strict";
var path = require("path");
var fs = require("fs");

var tokenize = require("../lib/tokenize");
var templateName = path.join(__dirname, "./example.html");
var template = fs.readFileSync(templateName, "utf8");
var inspect = require("util").inspect;

var tokens = tokenize(template);

console.log(inspect(tokens, {
	depth: null
}));
