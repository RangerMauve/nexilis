"use strict";
module.exports = {
	"name": "World",
	"items": [
		{"name": "Alice", "type": "Cool"},
		{"name": "Bob", "type": "Neat"}
	],
	isCool: function(name){
		return name.length > 3;
	},
	person: {
		name: "Eve"
	}
};
