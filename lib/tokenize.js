"use strict";

module.exports = tokenize;

var rules = [{
	token: elementStart,
	match: /^<([\w-]+)/,
	mode: ["text"],
	push: "element"
}, {
	token: elementClose,
	match: /^\/>/,
	mode: ["element"],
	pop: "element"
}, {
	token: elementClose,
	match: /^<\/([\w-]+)>/,
	mode: ["text"],
}, {
	token: elementEnd,
	match: /^>/,
	mode: ["element"],
	pop: "element"
}, {
	token: attributeName,
	mode: ["element"],
	match: /^(\w+)/,
}, {
	token: attributeStart,
	match: /^="/,
	mode: ["element"],
	push: "attribute"
}, {
	token: textContent,
	match: /^([^"{]+)/,
	mode: ["attribute"]
}, {
	token: expression,
	match: /^{{([^#\/(?{{}})]+)}}/,
	mode: ["attribute", "text"]
}, {
	token: attributeEnd,
	match: /^"/,
	mode: ["attribute"],
	pop: "attribute"
}, {
	token: blockStart,
	match: /^{{#(\w+)([^(?}})]*)}}/,
	mode: ["text"]
}, {
	token: blockClose,
	match: /^{{\/(\w+)}}/,
	mode: ["text"]
}, {
	token: textContent,
	match: /^([^<(?{{)]+)/,
	mode: ["text"]
}];

function tokenize(template) {
	var tokens = [];
	var index = 0;
	var max = template.length;
	var modes = [];
	var mode = "text";
	var matched;

	while (index < max) {
		matched = false;
		// Get the template from the index we're currently looking at
		var sub = template.slice(index);
		// Iterate through all the rules
		for (var ruleIndex = 0, length = rules.length; ruleIndex < length; ruleIndex++) {
			var rule = rules[ruleIndex];
			// If the rule isn't meant for this mode, skip it
			if (rule.mode.indexOf(mode) === -1)
				continue;

			// Match the rule against the template
			var match = sub.match(rule.match);
			// If this rule doesn't match, continue
			if (!match)
				continue;

			// If the rule pushes to the modes, do so
			if (rule.push)
				push(rule.push);

			// If the rule pops the mode, do so
			if (rule.pop)
				pop(rule.pop);

			// Increment index to end of match
			index += match[0].length;

			// Mark that we've made a match
			matched = true;

			// Get any arguments for token creation
			var args = match.slice(1);

			// Create the token instance
			var token = rule.token.apply(null, args);

			// Add it to the result
			tokens.push(token);

			// Screw the other rules, maaaan
			break;
		}

		// If there was no match this loop, go forward a bit
		if (!matched)
			index++;
	}

	return tokens;

	function push(newMode) {
		modes.push(mode);
		mode = newMode;
	}

	function pop(oldMode) {
		if (mode !== oldMode)
			throw new Error("Parse Error: cannot pop from mode '" + mode + "' with '" + oldMode + "'");
		mode = modes.pop();
	}
}

function textContent(content) {
	return {
		type: "textContent",
		content: content
	};
}

function elementStart(name) {
	return {
		type: "elementStart",
		name: name
	};
}

function elementEnd() {
	return {
		type: "elementEnd"
	};
}

function elementClose(name) {
	return {
		type: "elementClose",
		name: name
	};
}

function attributeName(name) {
	return {
		type: "attributeName",
		name: name
	};
}

function attributeStart() {
	return {
		type: "attributeStart"
	};
}

function attributeEnd() {
	return {
		type: "attributeEnd"
	};
}

function expression(content) {
	return {
		type: "expression",
		content: content
	};
}

function blockStart(name, content) {
	return {
		type: "blockStart",
		name: name,
		content: content
	};
}

function blockClose(name) {
	return {
		type: "blockClose",
		name: name
	};
}
