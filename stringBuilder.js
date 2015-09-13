"use strict";

module.exports = stringBuilder;

// Set up random names for private variables so they can't be messed with
var echo = uid("__echo_");
var result = uid("__result_");
var scope = uid("__scope_");
var content = uid("__content_");
var components = uid("__components_");

var setup = "function render(" + components + ", " + content + ", " + scope + "){\n" +
	"\t'use strict';\n" +
	"\tvar " + result + "= '';\n" +
	"\tfunction " + echo + "(string){" + result + "+= string;}\n";
var ending = "\n\n\treturn " + result + ";\n}";

var expressionConverter = /@(\w+)/g;
var textConverter = /\n/g;

function stringBuilder(tree) {
	return setup + buildChildren(tree.children) + ending;
}

function buildChildren(children) {
	return "\n\t" + children.map(buildChild).join("\n\t");
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

function buildWith(node) {
	return scope + ".push(" + convertExpression(node.content) + ");" +
		buildChildren(node.children) +
		"\n\t" + scope + ".pop();";
}

function buildEach(node) {
	var index = uid("__index_");
	var list = uid("__list_");
	var length = uid("__length_");
	var expression = convertExpression(node.content);
	return "var " + list + " = " + expression + ";" +
		"\n\tfor(var " + index + "=0, " + length + "=" + list + ".length; " + index + " < " + length + "; " + index + "++){" +
		"\n\t\t" + scope + ".push(" + list + "[" + index + "]);" +
		buildChildren(node.children) +
		"\n\t\t" + scope + ".pop();" +
		"\n\t}";
}

function buildIf(node) {
	return "if(" + convertExpression(node.content) + "){" +
		buildChildren(node.children) +
		"\n\t}";
}

function buildContent() {
	return "if(" + content + ")\n\t\t" + echo + "(" + content + "());";
}

function buildComponent(node) {
	var name = node.name;
	var content = buildComponentContent(node.children);
	return "if('" + name + "' in " + components + "){\n" +
		"\n\t" + echo + "(" + components + "['" + name + "'].render(" + buildProps(node.attributes) + ", " + content + "\n\t));" +
		"\n\t} else {\n\t" + buildElement(node) + "\n\t}";
}

function buildComponentContent(children) {
	return "\n\tfunction(){" + buildChildren(children) + "\n\t}";
}

function buildProps(attributes) {
	return "{\n\t\t" + attributes.map(buildProp).join(",\n\t\t") + "}";
}

function buildProp(prop) {
	var children = prop.children;
	var name = prop.name;
	if (!children.length) return "";
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

function buildElement(node) {
	var attributes = node.attributes;
	var name = node.name;
	var start = "";
	if (!attributes.length)
		start = echo + "('<" + name + ">');";
	else start = echo + "('<" + name + " ');" +
		buildAttributes(attributes) +
		"\n\t" + echo + "('>');";

	return start +
		buildChildren(node.children) +
		"\n\t" + echo + "('</" + name + ">');";
}

function buildAttributes(attributes) {
	return attributes.map(buildAttribute).join(" ");
}

function buildAttribute(attribute) {
	var children = attribute.children;
	var start = "\n\t" + echo + "('" + attribute.name + "');";
	if (children.length)
		return start + "\n\t" + echo + "('=\"' + " + children.map(buildAttributeItem).join(" + ") + " + '\"');";
	return start;
}

function buildAttributeItem(item) {
	var type = item.type;
	var content = item.content;
	if (type === "textContent")
		return "'" + convertText(content) + "'";
	else if (type === "expression")
		return convertExpression(content);
	else throw new Error("Compile Error: Unexpected node in attribute content " + type + " " + content);
}

function buildText(node) {
	return "\n\t" + echo + "('" + convertText(node.content) + "');";
}

function buildExpression(node) {
	return "\n\t" + echo + "(" + convertExpression(node.content) + ");";
}

function convertExpression(expression) {
	return expression.replace(expressionConverter, "" + scope + ".get('$1')").replace(/@/g, "" + scope + ".get('')");
}

function convertText(text) {
	return text.replace(textConverter, "\\n");
}

function uid(prefix) {
	return prefix + (Math.round(Math.random() * 999999999).toString(16));
}
