"use strict";
module.exports = {
	type: 'root',
	children: [{
		type: 'element',
		name: 'div',
		attributes: [],
		children: [{
			type: 'textContent',
			content: '\r\n\t'
		}, {
			type: 'element',
			name: 'h1',
			attributes: [],
			children: [{
				type: 'expression',
				content: '@name'
			}]
		}, {
			type: 'textContent',
			content: '\r\n\tThis is an example component.\r\n\r\n\t'
		}, {
			type: 'element',
			name: 'ul',
			attributes: [{
				type: 'attribute',
				name: 'class',
				children: [{
					type: 'textContent',
					content: 'coolthings'
				}]
			}],
			children: [{
				type: 'textContent',
				content: '\r\n\t\t'
			}, {
				type: 'block',
				name: 'each',
				content: ' @items',
				children: [{
					type: 'textContent',
					content: '\r\n\t\t\t'
				}, {
					type: 'element',
					name: 'li',
					attributes: [],
					children: [{
						type: 'textContent',
						content: '\r\n\t\t\t\t'
					}, {
						type: 'expression',
						content: ' @name'
					}, {
						type: 'textContent',
						content: ' is '
					}, {
						type: 'expression',
						content: ' @type'
					}, {
						type: 'textContent',
						content: '\r\n\t\t\t'
					}]
				}, {
					type: 'textContent',
					content: '\r\n\t\t'
				}]
			}, {
				type: 'textContent',
				content: '\r\n\t'
			}]
		}, {
			type: 'textContent',
			content: '\r\n\r\n\t'
		}, {
			type: 'block',
			name: 'if',
			content: ' @isCool(@name)',
			children: [{
				type: 'textContent',
				content: '\r\n\t\tCall arbitrary JS, but be careful!\r\n\t'
			}]
		}, {
			type: 'textContent',
			content: '\r\n\r\n\t'
		}, {
			type: 'block',
			name: 'with',
			content: ' @person',
			children: [{
				type: 'textContent',
				content: '\r\n\t\tChange the scope to make `name` be '
			}, {
				type: 'expression',
				content: '@name'
			}, {
				type: 'textContent',
				content: '!\r\n\t'
			}]
		}, {
			type: 'textContent',
			content: '\r\n\r\n\t'
		}, {
			type: 'element',
			name: 'custom-component',
			attributes: [{
				type: 'attribute',
				name: 'greeting',
				children: [{
					type: 'textContent',
					content: 'Hello'
				}]
			}, {
				type: 'attribute',
				name: 'who',
				children: [{
					type: 'textContent',
					content: 'my friend, '
				}, {
					type: 'expression',
					content: '@name'
				}]
			}],
			children: [{
				type: 'textContent',
				content: '\r\n\t\tUse components that encapsulate some code\r\n\t'
			}]
		}, {
			type: 'textContent',
			content: '\r\n\r\n\tAlso, you can inject contents into components here:\r\n\t'
		}, {
			type: 'element',
			name: 'content',
			attributes: [],
			children: []
		}, {
			type: 'textContent',
			content: '\r\n'
		}]
	}, {
		type: 'textContent',
		content: '\r\n'
	}]
};
