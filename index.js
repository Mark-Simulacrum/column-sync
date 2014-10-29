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
	var previousElement = element.previousElementSibling;
	if (!previousElement || previousElement.hasAttribute('sync')) {
		return previousElement;
	} else {
		return findPreviousDivider(previousElement);
	}
}

function amountOfDividersAbove(element) {
	var amount = 0;
	while (true) {
		element = findPreviousDivider(element);
		if (element) {
			amount += 1;
		} else {
			return amount;
		}
	}
}

function getOffsetTopAndHeight(element) {
	var boundingRect = element.getBoundingClientRect();
	return boundingRect.top - boundingRect.height;
}

/*
 * Must iterate over syncGroups in order of top-to-bottom.
 */
_.forEach(syncGroups, function (syncGroup) {
	var groupID = syncGroup.id;
	var maxOffsetElement = _.max(syncGroup.elements, getOffsetTopAndHeight);
	var maxOffsetTop = maxOffsetElement.getBoundingClientRect().top + maxOffsetElement.getBoundingClientRect().height;

	_.forEach(syncGroup.elements, function (syncDivider) {
		syncDivider.innerHTML = groupID;

		var siblings = _.toArray(syncDivider.parentElement.children);
		var currentDividerIndex = _.indexOf(siblings, syncDivider);
		var previousDividerIndex = _.indexOf(siblings, findPreviousDivider(syncDivider));
		previousDividerIndex = previousDividerIndex < 0 ? 0 : previousDividerIndex + 1;
		var elementsAfterPreviousDivider = siblings.slice(previousDividerIndex, currentDividerIndex);
		var height = maxOffsetTop - syncDivider.getBoundingClientRect().top;

		if (elementsAfterPreviousDivider.length === 0) {
			if (syncDivider.previousElementSibling) {
				syncDivider.previousElementSibling.style.marginBottom = height + 'px';
			}
		} else {
			var paddingPerElement =  height / elementsAfterPreviousDivider.length;
			if (paddingPerElement !== 0) {
				_.forEach(elementsAfterPreviousDivider, function (element) {
					element.style.padding = (paddingPerElement / 2) + 'px 0';
				});
			}
		}
		/*Debugging*/
/*
		syncDivider.innerHTML += ' ' + syncDivider.getBoundingClientRect().top;
		syncDivider.innerHTML += ' ' + syncDivider.getBoundingClientRect().height;
*/
	});
});
