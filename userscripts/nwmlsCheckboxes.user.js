// ==UserScript==
// @name         NWMLS Checkboxes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds checkboxes to filter homes based on how the user marked them.
// @author       grantapher
// @match        https://www.matrix.nwmls.com/Matrix/Public/Portal.aspx*
// @grant        none
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// @updateURL    https://raw.githubusercontent.com/Grantapher/grantapher-userscripts/main/userscripts\nwmlsCheckboxes.user.js
// ==/UserScript==

/* globals waitForKeyElements, $ */

(function() {
    'use strict';

    const listElemSelector = '.j-resultsPageAsyncDisplays > div'
    const mapElemSelector = 'img[src*="MapImages/colors"]:not(img[is-checkbox-label*="true"])'

    const bucketIndexToId = {
        '6': 'favorite',
        '4': 'possibility',
        '0': 'green', // aka single family
        '2': 'discard',
    }

    var checkMap = {}

    const updateListElem = (elem) => {
        const bucketIndex = elem.querySelector(".j-portalBucketSelector").getAttribute("data-currentbucket")
        const id = bucketIndexToId[bucketIndex]
        const keep = checkMap[id]

        if (keep) {
            elem.style.removeProperty('display')
        } else {
            elem.style.display = 'none'
        }
    }

    const imgSrcRegex = /marker_(.*?)_sm/
    const updateMapElem = (elem) => {
        const id = imgSrcRegex.exec(elem.src)[1]
        const keep = checkMap[id]

        if (keep) {
            elem.parentElement.removeAttribute("hidden")
        } else {
            elem.parentElement.setAttribute("hidden", "true")
        }
    }

    const update = () => {
        $(listElemSelector).each((i, elem) => updateListElem(elem))
        $(mapElemSelector).each((i, elem) => updateMapElem(elem))
    }

    const addCheckboxes = (elem) => {
        const div = document.createElement('div')
        div.style.display = 'inline-block'
        div.style.position = 'relative'
        div.style['text-align'] = 'right'
        div.style['white-space'] = 'nowrap'
        div.style['vertical-align'] = 'middle'
        div.style.marginRight = '5px'

        const label = document.createElement('label')
        label.innerText = "Filter To:"
        label.style.marginRight = '5px'
        label.style['vertical-align'] = 'middle'
        div.appendChild(label)

        addCheckbox(div, 'favorite', true, 'colors/marker_favorite_sm')
        addCheckbox(div, 'possibility', true, 'colors/marker_possibility_sm')
        addCheckbox(div, 'green', true, 'types/marker_singlefamily_sm', 'colors/marker_green_sm')
        addCheckbox(div, 'discard', false, 'colors/marker_discard_sm')

        elem.prepend(div)
    }

    const addCheckbox = (elem, id, checked, foreImgName, backImgName) => {
        checkMap[id] = checked

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = checked
        checkbox.id = id
        checkbox.name = id
        checkbox.addEventListener('change', (event) => {
            const target = event.target
            checkMap[target.id] = target.checked
            update()
        });
        checkbox.style['vertical-align'] = 'middle'
        elem.appendChild(checkbox)

        const div = document.createElement('div')
        div.style.width = '16px'
        div.style.height = '18px'
        div.style.display = 'inline-block'
        div.style.position = 'relative'
        div.style['text-align'] = 'right'
        div.style['white-space'] = 'nowrap'
        div.style['vertical-align'] = 'middle'

        if (backImgName) {
            div.appendChild(createImg(backImgName))
        }
        div.appendChild(createImg(foreImgName))

        elem.appendChild(div)
    }

    const createImg = (imgName) => {
        const img = document.createElement('img')
        img.src = `/Matrix/Images/MapImages/${imgName}.png`
        img.setAttribute('is-checkbox-label', 'true')
        img.style.left = '0px'
        img.style.position = 'absolute'
        return img
    }

    waitForKeyElements(listElemSelector, (elem) => updateListElem(elem.get(0)))
    waitForKeyElements(mapElemSelector, (elem) => updateMapElem(elem.get(0)))
    waitForKeyElements('div[id$="SortAndViews"]', addCheckboxes)
})();