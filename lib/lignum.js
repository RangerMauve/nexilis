"use strict";
var Components = require("./components");

module.exports = Nexilis;

function Nexilis(builder) {
	this.components = new Components(builder);
}

Nexilis.prototype = {
	components: null,
	addComponent: addComponent,
	render: render
};

function addComponent(component) {
	this.components.add(component);
	return this;
}

function render(name, data) {
	return this.components[name].render(data);
}
