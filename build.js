function render(__components_38728d24, __scope_2e5be56e, __content_15fc2b58) {
	'use strict';
	var __h_1933a1c = __components_38728d24._builder.h;
	return __h_1933a1c('div', {}, [
		'\n	',
		__h_1933a1c('h1', {}, [
			(function () {
				return __scope_2e5be56e.get('name');
			})()
		]),
		'\n	This is an example component.\n\n	',
		__h_1933a1c('ul', {
			className: 'coolthings'
		}, [
			'\n		',
			'',
			'\n	'
		]),
		'\n\n	',
		'',
		'\n\n	', (function () {
			__scope_2e5be56e.push(__scope_2e5be56e.get('person'));
			var __result_36212b28 = ['\n		Change the scope to make `name` be ', (function () {
					return __scope_2e5be56e.get('name');
				})(),
				'!\n	'
			]
			__scope_2e5be56e.pop()
			return __result_36212b28;
		})(),
		'\n\n	', ('custom-component' in __components_38728d24) ?
		(__components_38728d24['custom-component'].render({
				greeting: 'Hello',
				who: 'my friend, ' + __scope_2e5be56e.get('name')
			},
			function () {
				return [
					'\n		Use components that encapsulate some code\n	'
				];
			}
		)) : (
			__h_1933a1c('custom-component', {
				greeting: 'Hello',
				who: 'my friend, ' + __scope_2e5be56e.get('name')
			}, [
				'\n		Use components that encapsulate some code\n	'
			])
		),
		'\n\n	Also, you can inject contents into components here:\n	', (__content_15fc2b58) ? (__content_15fc2b58()) : undefined,
		'\n'
	]);
}
