"use strict";
var fs = require("fs");
var path = require("path");

module.exports = {
	name: "kitchen-sink",
	template: fs.readFileSync(path.join(__dirname, "template.html"), "utf8"),
	state: function() {
		return require("./data");
	},

	tokens: require("./tokens"),
	tree: require("./tree"),
	expected: fs.readFileSync(path.join(__dirname, "expected.html"), "utf8"),
};
