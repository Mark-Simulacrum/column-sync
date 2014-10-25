/*jshint browser:true*/
/*globals _ */

window.onload = function () {
	'use strict';

	var syncDividers = document.querySelectorAll('[sync]');
	var syncGroups = _.groupBy(syncDividers, function (element) {
		return element.getAttribute('sync');
	});

	_.forEach(syncGroups, function (syncGroup) {
		var maxOffsetTop = _.max(syncGroup, 'offsetTop').offsetTop;

		_.forEach(syncGroup, function (syncDivider) {
			syncDivider.innerHTML = syncDivider.getAttribute('sync') + ' ' + maxOffsetTop;
			var padding = maxOffsetTop - syncDivider.offsetTop;
			syncDivider.style.height = padding + 'px';

			var siblings = _.toArray(syncDivider.parentElement.children);

			_.forEach(siblings, function (sibling) {
				//sibling.style.paddingTop = padding / siblings.length + 'px';
			});
		});
	});
};
