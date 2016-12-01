"use strict";
var test = require("tape");
var minify = require("html-minifier").minify;
var victorica = require("victorica");

test("Renders expected HTML output for kitchen-sink", function(t) {
	var Nexilis = require("../../lib/nexilis");
	var builder = require("../../lib/stringBuilder");
	var kitchen = require("../templates/kitchen-sink");
	var customComponent = require("../templates/custom-component");

	// Set up the builder and the kitchen sink component
	var nexilis = new Nexilis(builder);
	nexilis.addComponent(customComponent);
	nexilis.addComponent(kitchen);

	// Render out raw output of what the builder made
	var result = nexilis.render("kitchen-sink");

	// Format the expected result
	var expected = formatHTML(kitchen.expected);

	var formattedResult = formatHTML(result);

	t.deepEqual(formattedResult, expected, "rendered output looks like what is expected");

	t.end();
});


function formatHTML(html) {
	return victorica(minify(html, {
		caseSensitive: true,
		collapseWhitespace: true,
	}), {
		space: "\t",
		removeSelfClose: false,
	});
}
