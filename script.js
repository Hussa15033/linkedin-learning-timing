// ==UserScript==
// @name         LinkedIn Timing Script
// @version      2025-04-15
// @description  Updates the video duration on section titles for LinkedIn courses
// @author       Hussa15033
// @match        https://www.linkedin.com/learning/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==

let shortTime = (seconds) => {
    return Math.round(seconds / 60) + "m"
}
const app = {}

app.updateHeaders = () => {
    let classroomHeaders = document.querySelectorAll("section.classroom-toc-section")

    if (classroomHeaders.length == 0) return false

    for (let i = 0; i < classroomHeaders.length; i++) {
        let sectionSecondsTotal = 0
        let sectionSecondsCompleted = 0

        let header = classroomHeaders[i]

        let items = header.querySelectorAll(".classroom-toc-item")

        for (let j = 0; j < items.length; j++) {
            let itemDurationEl = items[j].querySelector(".classroom-toc-item__content div:nth-child(2)")
            let isVideo = itemDurationEl.innerText.match(/video/i)

            if (!isVideo) continue;

            let durationHrs = itemDurationEl.innerText.match(/(\d+)h/i)
            let durationMins = itemDurationEl.innerText.match(/(\d+)m/i)
            let durationSecs = itemDurationEl.innerText.match(/(\d+)s/i)

            let durationSeconds = parseInt(durationSecs ? durationSecs[1] : 0) + parseInt(durationMins ? durationMins[1] : 0) * 60 + parseInt(durationHrs ? durationHrs[1] : 0) * 3600

            if (items[j].querySelector(".classroom-toc-item__completed-icon")) {
                sectionSecondsCompleted += durationSeconds
            }

            sectionSecondsTotal += durationSeconds
        }

        let curDuration = classroomHeaders[i].querySelector(".ah-modified-duration")
        if (curDuration) {
            curDuration.innerText = "(" + shortTime(sectionSecondsCompleted) + "/" + shortTime(sectionSecondsTotal) + ")"
        } else {
            classroomHeaders[i].querySelectorAll("h2 button span:nth-child(1)")[0].innerHTML += " <span style='color:grey;' class='ah-modified-duration'>(" + shortTime(sectionSecondsCompleted) + "/" + shortTime(sectionSecondsTotal) + ")</span>"
        }
    }

    return true
}

app.init = () => {
    let headerInterval = setInterval(function() {
        let updated = app.updateHeaders()
    }, 1000)
}

window.onload = app.init
