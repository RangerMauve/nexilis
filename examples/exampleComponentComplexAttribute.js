"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

components.add({
	name: "test-component-child",
	template: "{{#each @items}}<span>{{ @name }}</span>{{/each}}"
});

components.add({
	name: "test-component-parent",
	template: "<test-component-child items=\"{{ [{name: 'cat'}, {name: 'dog'}] }}\"/>"
});

console.log(components["test-component-parent"]._render.toString());
console.log(components["test-component-child"]._render.toString());

console.log(components["test-component-parent"].render({}));
