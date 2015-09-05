"use strict";

module.exports = treeify;

/**
 * Take a list of tokens that were parsed from the template string and convert them into a tree
 * @param  {Array} tokens The list of tokens from the template
 * @return {Tree}         The parsed out tree
 */
function treeify(tokens) {
	// Make a copy of the token list since it's going to get destroyed
	tokens = tokens.slice(0);

	// Make the root node
	return {
		type: "root",
		// Parse out the direct children
		children: parseChildren(tokens)
	};
}

/**
 * Parses out the children for a given node. Pass in the criteria for signaling the end of the children or parse remainder of tokens
 * @param  {Array} tokens  The list of tokens to use for parsing
 * @param  {String} endType Optional token type to use as marking the end of the children
 * @param  {String} endName Optional name that will be associated with the toke used to mark the end of the children
 * @return {Array}         List of child nodes in the tree
 */
function parseChildren(tokens, endType, endName) {
	var children = [];
	// Keep trying to parse children until exiting early or running out of tokens
	while (tokens.length) {
		// Get the next token from the list
		var token = tokens.shift();
		var type = token.type;
		if (type === "elementStart")
		// If the token is specifying the start of an element, parse out the element and it's children
			children.push(parseElement(token, tokens));
		else if (type === "blockStart")
		// If the token is specifying the start of a block, parse out the block and it's children
			children.push(parseBlock(token, tokens));
		else if (type === "textContent" || type === "expression")
		// If the token marks some raw text or a simple epxpression add it as a child
			children.push(token);
		else if ((type === endType) && (token.name === endName))
		// If the token matches the criteria for the end of the children, return the list that was built up
			return children;
		else
		// If the token was unexpected, throw an error
			throw new Error("Parse Error: Encountered " + type + " while parsing children" + (endType ? " for " + endName : ""));
	}

	// If and ending condition was specified but was never reached while parsing the tokens, throw an error
	if (endType) throw new Error("Parse Error: Couldn't find matching " + endType + " for " + endName);

	// If all the tokens were parsed out, return the children
	return children;
}

/**
 * Parse out a code block.
 * @param  {Token} blockToken The token to use for defining the block
 * @param  {Array} tokens     The list of tokens for defining the block's children
 * @return {Block}            The block node and it's children
 */
function parseBlock(blockToken, tokens) {
	// Fetch information about the block
	var name = blockToken.name;
	var content = blockToken.content;

	// Return the definition
	return {
		type: "block",
		name: name,
		content: content,
		// Parse out all the children of the block by looking for the matching close tag
		children: parseChildren(tokens, "blockClose", name)
	};
}

/**
 * Parse out an element
 * @param  {Token}   elementToken The token to use for defining the element
 * @param  {Array}   tokens       The list of tokens to use for defining the element's children
 * @return {Element}              The element node, it's attributes, and it's children
 */
function parseElement(elementToken, tokens) {
	// Fetch and init information about the element
	var name = elementToken.name;
	var element = {
		type: "element",
		name: name,
		attributes: [],
		children: []
	};

	// Go through the tokens until the return is reached, or they run out
	while (tokens.length) {
		// Get the next token
		var token = tokens.shift();
		var type = token.type;
		if (type === "attributeName")
		// If the token marks the start of an attribute, parse it out and add it to the element
			element.attributes.push(parseAttribute(token, tokens));
		else if (type === "elementEnd") {
			// If the token marks the end of the element's opening tag, parse out the element's children and return the element
			element.children = parseChildren(tokens, "elementClose", name);
			return element;
		} else if (type === "elementClose" && !token.name)
		// If the element was a self-closing tag, return the element
			return element;
		else
		// Throw an error if the token was unexpected
			throw new Error("Parse Error: Encountered " + type + " while parsing element " + name);
	}

	// Throw an error if the element was never closed and the tokens ran out
	throw new Error("Parse Error: Element never closed, " + name);
}

/**
 * Parses out an attribute for an element
 * @param  {Token}     token  The token for the attribute's name
 * @param  {Array}     tokens The list of tokens to use for parsing
 * @return {Attribute}        The attribute and it's contents
 */
function parseAttribute(token, tokens) {
	// Parse out the attribute's info and set it up
	var name = token.name;
	var attribute = {
		type: "attribute",
		name: name,
		children: []
	};

	// If the attribute is just the name with no value, return it as is
	var next = tokens[0];
	if (next.type !== "attributeStart") return attribute;

	// Pull the attributeStart token out
	tokens.shift();

	// Iterate through the tokens until the attribute is completed or they run out
	while (tokens.length) {
		// Get the next token
		next = tokens.shift();
		var type = next.type;
		if (type === "textContent" || type === "expression")
		// If the token represents some raw text or an expression, add them to the attribute
			attribute.children.push(next);
		else if (type === "attributeEnd")
		// If the token signifies the end of the attribute, return it
			return attribute;
		else
		// If the token type was unexpected, throw an error
			throw new Error("Parse Error: Encountered " + type + " while parsing attribute " + name);
	}

	// Throw an error if the attribute was never completed
	throw new Error("Parse Error: Attribute " + name + " never closed");
}
