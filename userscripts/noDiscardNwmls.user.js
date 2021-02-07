// ==UserScript==
// @name         no discards >:(
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.matrix.nwmls.com/Matrix/Public/Portal.aspx*
// @grant        none
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @updateURL    https://gist.github.com/Grantapher/4662d2d87a2ac7f95ebe72cc035f69b8/raw/noDiscardNwmls.user.js
// ==/UserScript==

/* globals waitForKeyElements, $ */

(function() {
    'use strict';

    var remove = true;

    const updateListElem = (elem) => {
            if (remove && "2" === elem.querySelector(".j-portalBucketSelector").getAttribute("data-currentbucket")) {
                elem.style.display = 'none'
            } else {
                elem.style.removeProperty('display')
            }
    }

    const updateMapElem = (elem) => {
            if (remove) {
                elem.parentElement.setAttribute("hidden", "true")
            } else {
                elem.parentElement.removeAttribute("hidden")
            }
    }

    const update = () => {
        $(".j-resultsPageAsyncDisplays > div").each((i, elem) => updateListElem(elem))
        $('img[src*="discard"]').each((i, elem) => updateMapElem(elem))
    }

    const addCheckbox = (elem) => {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = true
        checkbox.addEventListener('change', (event) => {
            remove = event.target.checked
            update()
        });

        const label = document.createElement('label')
        label.innerText = "Don't show discarded"

        elem.prepend(label)
        elem.prepend(checkbox)
    }

    waitForKeyElements(".j-resultsPageAsyncDisplays > div", (elem) => updateListElem(elem.get(0)))
    waitForKeyElements('img[src*="discard"]', (elem) => updateMapElem(elem.get(0)))
    waitForKeyElements('div[id$="SortAndViews"]', addCheckbox)
})();