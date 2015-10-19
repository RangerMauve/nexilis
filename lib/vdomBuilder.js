"use strict";

vdomBuilder.h = require("virtual-dom/h");
module.exports = vdomBuilder;

var scope = uid("__scope_");
var content = uid("__content_");
var components = uid("__components_");
var h = uid("__h_");
var result = uid("__result_");

var setup = "function render(" + components + ", " + scope + ", " + content + "){\n" +
	"\t'use strict';\n" +
	"\tvar " + h + " = " + components + "._builder.h;\n" +
	"\treturn ";
var ending = ";\n}";

var notWhitespace = /^S/g;
var expressionConverter = /@(\w+)/g;
var expressionConverterFinish = /@/g;
var textConverter = /\n/g;
var quoteConverter = /"/g;

function vdomBuilder(tree) {
	var children = tree.children.slice();
	var foundElement = null;
	var foundElements = 0;
	while (children.length > 1) {
		var child = children.shift();
		var type = child.type;
		if (type === "element") {
			foundElement = child;
			foundElements++;
		} else if (type === "textContent") {
			if (child.content.match(notWhitespace))
				return "[" + buildChildren(children) + "\n\t]";
		} else return "[" + buildChildren(children) + "\n\t]";
	}
	if (foundElements === 1)
		return setup + buildElement(foundElement) + ending;
	return setup + "[" + buildChildren(children) + "\n\t]" + ending;
}

function buildChildren(children) {
	return children.map(buildChild).join(",\n\t\t");
}

function buildChild(node) {
	var type = node.type;
	var name = node.name;
	if (type === "textContent")
		return buildText(node);
	else if (type === "expression")
		return buildExpression(node);
	else if (type === "block") {
		if (name === "with")
			return buildWith(node);
		else if (name === "each")
			return buildEach(node);
		else if (name === "if")
			return buildIf(node);
		else throw new Error("Compile Error: Unknown block type: " + name);
	} else if (type === "element") {
		if (name === "content")
			return buildContent(node);
		else if (name.indexOf("-") !== -1)
			return buildComponent(node);
		else return buildElement(node);
	} else throw new Error("Compile Error: Unexpected node type: " + type);
}

function buildElement(node) {
	var name = node.name;
	var children = node.children;
	var attributes = node.attributes;
	return h +
		"('" +
		name +
		"',\n\t" +
		buildProps(attributes) +
		",\n\t[\n\t\t" +
		buildChildren(children) +
		"\n\t]\n\t)";
}

function buildComponent(node) {
	var name = node.name;
	var content = buildComponentContent(node.children);
	return "('" + name + "' in " + components + ") ?" +
		"\n\t(" + components + "['" + name + "'].render(" + buildProps(node.attributes) + ", " + content + "\n\t))" +
		" : (\n\t" + buildElement(node) + "\n\t)";
}

function buildComponentContent(children) {
	return "\n\tfunction(){\n\t\treturn [\n\t\t" + buildChildren(children) + "\n\t\t];\n\t}";
}

function buildProps(attributes) {
	if (!attributes.length) return "{}";
	return "{\n\t\t" + attributes.map(buildProp).join(",\n\t\t") + "\n\t}";
}

function buildProp(prop) {
	var children = prop.children;
	var name = prop.name;
	if (name === "class")
		name = "className";
	if (!children.length) return name + ": true";
	if (children.length > 1) {
		return name + ":" + children.map(buildPropItem).join(" + ");
	} else {
		var child = children[0];
		var type = child.type;
		var content = child.content;
		if (type === "textContent") {
			return name + ": '" + convertText(content) + "'";
		} else if (type === "expression") {
			return name + ":" + convertExpression(content);
		} else {
			throw new Error("Compile Error: Unexpected node in component prop " + type + " " + content);
		}
	}
}

function buildPropItem(item) {
	var type = item.type;
	var content = item.content;
	if (type === "textContent")
		return "'" + convertText(content) + "'";
	else if (type === "expression")
		return convertExpression(content);
	else throw new Error("Compile Error: Unexpected node in component prop " + type + " " + content);
}

function buildWith(node) {
	return "(function(){" +
		"\n\t\t" + scope + ".push(" + convertExpression(node.content) + ");" +
		"\n\t\tvar " + result + " = [" + buildChildren(node.children) + "]" +
		"\n\t\t" + scope + ".pop()" +
		"\n\t\t return " + result + ";" +
		"\n\t})()";
}

function buildEach(node) {
	return "''";
}

function buildIf(node) {
	return "''";
}

function buildExpression(node) {
	return "(function(){return " + convertExpression(node.content) + ";})()";
}

function buildText(node) {
	return "'" + convertText(node.content) + "'";
}

function buildContent() {
	return "(" + content + ")? (" + content + "()) : undefined";
}

function convertExpression(expression) {
	return expression.replace(expressionConverter, "" + scope + ".get('$1')").replace(expressionConverterFinish, "" + scope + ".get('')");
}

function convertText(text) {
	return text.replace(textConverter, "\\n").replace(quoteConverter, "\\\"");
}

function uid(prefix) {
	return prefix + (Math.round(Math.random() * 999999999).toString(16));
}
