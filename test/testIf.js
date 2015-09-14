"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

var name = "test-component";
var template = "{{#if 2 > 1}}<b>Yup!</b>{{/if}}{{#if 2 === 3}}Nope!{{/if}}";

components.add({
	name: name,
	template: template
});

var rendered = components[name].render();

console.log(rendered);
