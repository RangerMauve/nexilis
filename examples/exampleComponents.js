"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

var name = "test-component";
var template = "<div>{{@greeting}}, {{@thing}}!</div>";
var state = function () {
	return {
		greeting: "Hello"
	};
};

components.add({
	name: name,
	template: template,
	state: state
});

var data = {
	thing: "World"
};

var rendered = components[name].render(data);

console.log(rendered);
