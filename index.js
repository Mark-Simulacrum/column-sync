/*jshint browser:true*/
/*globals _ */

//window.onload = init;

//function init() {
	'use strict';

	var syncDividers = document.querySelectorAll('[sync]');
	var syncGroups = [];
	_.forEach(syncDividers, function (element) {
		var syncId = element.getAttribute('sync');
		var keyForId = _.findKey(syncGroups, {id: syncId});
		if (keyForId) {
			syncGroups[keyForId].elements.push(element);
		} else {
			syncGroups.push({
				elements: [element],
				id: syncId
			});
		}
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

	/*
	 * Must iterate over syncGroups in order of top-to-bottom.
	 */
	_.forEach(syncGroups, function (syncGroup) {
		var groupID = syncGroup.id;
		var maxOffsetTop = _.max(syncGroup.elements, 'offsetTop').offsetTop;

		_.forEach(syncGroup.elements, function (syncDivider) {
			syncDivider.innerHTML = groupID;

			var siblings = _.toArray(syncDivider.parentElement.children);
			var currentDividerIndex = _.indexOf(siblings, syncDivider);
			var previousDividerIndex = _.indexOf(siblings, findPreviousDivider(syncDivider));
			previousDividerIndex = previousDividerIndex < 0 ? 0 : previousDividerIndex + 1;
			var elementsAfterPreviousDivider = siblings.slice(previousDividerIndex, currentDividerIndex);
			var paddingPerElement = (maxOffsetTop - syncDivider.offsetTop) / elementsAfterPreviousDivider.length;

			_.forEach(elementsAfterPreviousDivider, function (element) {
				element.style.padding = (paddingPerElement / 2) + 'px 0';
			});
		});
	});
//}
