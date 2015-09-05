"use strict";
var path = require("path");
var fs = require("fs");

var tokenize = require("../tokenize");
var templateName = path.join(__dirname, "./example.html");
var template = fs.readFileSync(templateName, "utf8");
var inspect = require("util").inspect;

tokenize(template).forEach(function (token) {
	console.log(token.type);
	if (token.name)
		console.log("\tName:", inspect(token.name));
	if (token.content)
		console.log("\tContent:", inspect(token.content));
	console.log("");
});
