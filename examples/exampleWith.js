"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

var name = "test-component";
var template = "{{@name}} {{#with @thing}}{{@name}}{{/with}} {{@name}}";

components.add({
	name: name,
	template: template
});

var data = {
	name: "Outer",
	thing: {
		name: "Inner"
	}
};

var rendered = components[name].render(data);

console.log(rendered);
