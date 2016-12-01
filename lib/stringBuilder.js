"use strict";

module.exports = stringBuilder;

// Set up random names for private variables so they can't be messed with
var scope = uid("__scope_");
var content = uid("__content_");
var components = uid("__components_");
var escapeHTML = uid("__escapeHTML_");
var escapeAttr = uid("__escapeAttr_");

var setup = "function render(" + components + ", " + scope + ", " + content + "){\n" +
	"\t'use strict';" +
	"\tfunction " + escapeHTML + "(string){ return ('' + (string||'')).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}\n" +
	"\tfunction " + escapeAttr + "(string){ return ('' + (string||'')).replace(/\"/g,'%22');}\n" +
	"return '' + \n";
var ending = ";\n}";

var expressionConverter = /@(\w+)/g;
var expressionConverterFinish = /@/g;
var newLineMatch = /\r?\n/g;
var quoteMatch = /'/g;

function stringBuilder(tree) {
	return setup + buildChildren(tree.children) + ending;
}

function buildChildren(children) {
	return "\n\t" + children.map(buildChild).join(" + \n\t");
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
	var result = uid("__result_");
	return "(function(){" +
		"\n\t" + scope + ".push(" + convertExpression(node.content) + ");" +
		"\n\tvar " + result + " = " + buildChildren(node.children) + ";" +
		"\n\t" + scope + ".pop();" +
		"\n\treturn " + result +
		"})()";
}

function buildEach(node) {
	var list = uid("__list_");
	var result = uid("__result_");
	var expression = convertExpression(node.content);
	return "\n\t(" + expression + "||[]).map(function(" + list + "){" +
		"\n\t\t" + scope + ".push(" + list + ");" +
		"\n\t\tvar " + result + " = " + buildChildren(node.children) +
		"\n\t\t" + scope + ".pop();" +
		"\n\t\treturn '' + " + result + ";" +
		"\n\t}).join('')";
}

function buildIf(node) {
	return "(" + convertExpression(node.content) + "? " +
		buildChildren(node.children) +
		": ''\n\t)";
}

function buildContent() {
	return "(" + content + " ? " + content + "() : '')";
}

function buildComponent(node) {
	var name = node.name;
	var content = buildComponentContent(node.children);
	return "('" + name + "' in " + components + " ? " +
		"\n\t" + components + "['" + name + "'].render(" + buildProps(node.attributes) + ", " + content + "\n\t)" +
		" : (\n\t" + buildElement(node) + "\n\t))";
}

function buildComponentContent(children) {
	return "\n\tfunction(){ return ''+" + buildChildren(children) + "\n\t}";
}

function buildProps(attributes) {
	return "{\n\t\t" + attributes.map(buildProp).join(",\n\t\t") + "\n\t}";
}

function buildProp(prop) {
	var children = prop.children;
	var name = prop.name;
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

function buildElement(node) {
	var attributes = node.attributes;
	var name = node.name;
	var start = "";
	if (!attributes.length)
		start = "'<" + name + ">' + ";
	else start = "'<" + name + " ' + " +
		buildAttributes(attributes) +
		"+\n\t'>' + ";

	return start +
		buildChildren(node.children) +
		" +\n\t'</" + name + ">'";
}

function buildAttributes(attributes) {
	return attributes.map(buildAttribute).join(" + ");
}

function buildAttribute(attribute) {
	var children = attribute.children;
	var start = "\n\t'" + attribute.name + "'";
	if (children.length)
		return start + "+\n\t'=\"' +  " + escapeAttr + "(" + children.map(buildAttributeItem).join(" + ") + ") + '\"'";
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
	return "\n\t" + escapeHTML + "('" + convertText(node.content) + "')";
}

function buildExpression(node) {
	return "\n\t" + escapeHTML + "(" + convertExpression(node.content) + ")";
}

function convertExpression(expression) {
	return expression.replace(expressionConverter, "" + scope + ".get('$1')").replace(expressionConverterFinish, "" + scope + ".get('')");
}

function convertText(text) {
	return text.replace(newLineMatch, "\\n").replace(quoteMatch, "\\'");
}

function uid(prefix) {
	return prefix + (Math.round(Math.random() * 999999999).toString(16));
}