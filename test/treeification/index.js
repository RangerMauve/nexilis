"use strict";
var test = require("tape");


test("Parses kitchen-sink into expected tree", function(t) {
	var kitchen = require("../templates/kitchen-sink");

	var treeify = require("../../lib/treeify");
	var tree = treeify(kitchen.tokens);

	t.deepEqual(tree, kitchen.tree, "generated tee is what's expected");

	t.end();
});
