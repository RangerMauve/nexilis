"use strict";
var test = require("tape");

test("Parses kitchen-sink into expected tokens", function(t) {
	var kitchen = require("../templates/kitchen-sink");

	var tokenize = require("../../lib/tokenize");
	var tokens = tokenize(kitchen.template);

	t.deepEqual(tokens, kitchen.tokens, "generated tokens are what's expected");

	t.end();
});
