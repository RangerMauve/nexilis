"use strict";
var Components = require("../lib/components");
var builder = require("../lib/stringBuilder");

var components = new Components(builder);

var name = "test-component";
var template = '<div class="{{@totally}}">{{@illegal}}</div>';
var data = {
	totally: '"&&  wooooo~~~"',
	illegal: "<script>alert(1)</script>"
};

components.add({
	name: name,
	template: template
});

var rendered = components[name].render(data);

console.log(rendered);
