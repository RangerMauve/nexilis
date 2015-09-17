"use strict";
var Scope = require("template-scope");
var tokenize = require("./tokenize");
var treeify = require("./treeify");
var fnRegex = require("function-regex")();

module.exports = Components;

/**
 * This is a container for all the components used by Nexilis
 * @param {Function} builder Use to build the renderer for components. Should take the parsed tree from the template and return a function String for doing the rendering
 */
function Components(builder) {
	if (!builder)
		throw new TypeError("Must specify builder function for components");
	this.__builder = builder;
}

Components.prototype = {
	__builder: null,
	add: add
};

/**
 * Adds a new component to the list
 * @param {Object} component Options for creating the component. Must contain a `name`, must contain either a string `template` or a `render` function, can optionally contain the initial `state` function
 */
function add(component) {
	var name = component.name;
	var template = component.template;
	var render = component.render;
	var state = component.state;

	if (!name) throw new TypeError("Must specify a name for the new component");
	if (name.indexOf("-") === -1) throw new TypeError("Component name," + name + " must contain a dash (-)");

	// If a render function wasn't provided, and a template string was, compile the template
	if (!render && template) {
		// Get the builder function that should be used
		var builder = this.__builder;
		// Parse the template into the tree required for the builder.
		// If there are any syntax errors in the template, it should throw here.
		var tokens = tokenize(template);
		var tree = treeify(tokens);

		// Get the built function string and parse its parts
		var built = builder(tree);
		var parts = built.match(fnRegex);

		// Create the function from the args and body of the rendered string
		render = new Function(parts[2], parts[3]);
	} else if (!render)
		throw new TypeError("Must specify a render function or a template for " + name);

	// Build the component object
	var compiled = new Component(name, state, render, this);

	// Add the component
	this[name] = compiled;

	// Return self for chaining
	return this;
}

function defaultState() {
	return {};
}

function Component(name, state, render, parent) {
	this.name = name;
	this._render = render;
	this._components = parent;
	if (state) this.state = state;
}

Component.prototype = {
	name: null,
	_render: null,
	_components: null,
	state: defaultState,
	render: renderComponent
};

function renderComponent(state, content) {
	var scope = new Scope();

	var initialState = this.state();

	scope.push(initialState);
	if (state)
		scope.push(state);

	return this._render(this._components, scope, content);
}
