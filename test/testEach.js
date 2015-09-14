"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

var name = "test-component";
var template = "<ul>{{#each @names}}<li>{{@}}</li>{{/each}}</ul>";

components.add({
	name: name,
	template: template
});

var data = {
	names: ["Alice", "Bob"]
};

var rendered = components[name].render(data);

console.log(rendered);
