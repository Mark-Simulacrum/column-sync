/*jshint browser:true*/
/*globals _ */

window.onload = init;

function init() {
	'use strict';

	var syncDividers = document.querySelectorAll('[sync]');
	var syncGroups = _.groupBy(syncDividers, function (element) {
		return element.getAttribute('sync');
	});

	function findPreviousDivider(element) {
		while (element.previousElementSibling) {
			var previousElement = element.previousElementSibling;
			if (previousElement.hasAttribute('sync')) {
				return previousElement;
			} else {
				return findPreviousDivider(previousElement);
			}
		}

		return null;
	}

	_.forEach(syncGroups, function (syncGroup, groupID) {
		var maxOffsetTop = _.max(syncGroup, 'offsetTop').offsetTop;

		_.forEach(syncGroup, function (syncDivider) {
			var siblings = _.toArray(syncDivider.parentElement.children);
			var currentDividerIndex = _.indexOf(siblings, syncDivider);
			var previousDividerIndex = _.indexOf(siblings, findPreviousDivider(syncDivider));
			previousDividerIndex = previousDividerIndex < 0 ? 0 : previousDividerIndex + 1;
			var elementsAfterPreviousDivider = siblings.slice(previousDividerIndex, currentDividerIndex);
			var paddingPerElement = (maxOffsetTop - syncDivider.offsetTop) / elementsAfterPreviousDivider.length;

			syncDivider.innerHTML = 'Group: ' + groupID;

			_.forEach(elementsAfterPreviousDivider, function (element) {
				element.style.padding = (paddingPerElement / 2) + 'px 0';
			});
		});
	});
}
