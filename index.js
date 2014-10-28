'use strict';
/*jshint browser:true, globalstrict:true */
/*globals _ */

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
}

/*
 * Must iterate over syncGroups in order of top-to-bottom.
 */
_.forEach(syncGroups, function (syncGroup) {
	var groupID = syncGroup.id;
	function maxOffsetTop() {
		var maxElement = _.max(syncGroup.elements, 'offsetTop');
		return maxElement.offsetTop + maxElement.offsetHeight; // Offset height is required when we add padding to the sync element itself.
	}

	_.forEach(syncGroup.elements, function (syncDivider) {
		syncDivider.innerHTML = groupID;

		var siblings = _.toArray(syncDivider.parentElement.children);
		var currentDividerIndex = _.indexOf(siblings, syncDivider);
		var previousDividerIndex = _.indexOf(siblings, findPreviousDivider(syncDivider));
		previousDividerIndex = previousDividerIndex < 0 ? 0 : previousDividerIndex + 1;
		var elementsAfterPreviousDivider = siblings.slice(previousDividerIndex, currentDividerIndex);
		var height = maxOffsetTop() - syncDivider.offsetTop;

		if (elementsAfterPreviousDivider.length === 0) {
			syncDivider.style.paddingTop = (height < 20 ? 20 : height) + 'px'; // Minimum padding of 20px
		} else {
			var paddingPerElement =  height / elementsAfterPreviousDivider.length;
			if (paddingPerElement !== 0) {
				_.forEach(elementsAfterPreviousDivider, function (element) {
					element.style.padding = (paddingPerElement / 2) + 'px 0';
				});
			}
		}
	});
});
