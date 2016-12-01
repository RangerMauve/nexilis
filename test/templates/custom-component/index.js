"use strict";
var fs = require("fs");
var path = require("path");

module.exports = {
	name: "custom-component",
	template: fs.readFileSync(path.join(__dirname, "template.html"), "utf8")
};