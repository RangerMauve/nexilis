"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

components.add({
	name: "test-component-child",
	template: "<span>The Mighty <content/></span>"
});

components.add({
	name: "test-component-parent",
	template: "<div>Wow, it's <test-component-child>World</test-component-child></div>"
});

console.log(components["test-component-parent"]._render.toString());
console.log(components["test-component-child"]._render.toString());

console.log(components["test-component-parent"].render({}));
