// Some functions to process data

export function getRealTime(time) {

    var hours = parseInt(time[0])
    var minutes = parseInt(time[1])
    var seconds = parseFloat(time[2].replace(",", "."))
    var subtitle_time = hours * 3600 + minutes * 60 + seconds

    return subtitle_time
}

export function getCurrentSubtitle(data, currentTime) {
    var currentSubtitle = ""
    for (var i = 0; i < data.length; i++) {
        var time_1 = data[i].timestamp_1.split(":")
        var time_2 = data[i].timestamp_2.split(":")
        var subtitle_time_1 = getRealTime(time_1)
        var subtitle_time_2 = getRealTime(time_2)

        if (currentTime > subtitle_time_1 && currentTime <= subtitle_time_2) {
            currentSubtitle = data[i].content
            return currentSubtitle
        }
    }
}

export function alignTimestamp(data) {
    // console.log(data)
    let originData = generateSrtFile(data)
    // console.log(originData)


    var all_subtitles = []
    var subtitles = originData.split("\n\n")
    var prev_time = ""
    // console.log(subtitles)
    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i] != "") {

            var processed_subtitles = {}

            var subtitle = subtitles[i].split("\n")
            // console.log(subtitle)
            var timestamps = subtitle[1].split(" --> ")
            // console.log(timestamps)
            var timestamp_1 = timestamps[0]
            var timestamp_2 = timestamps[1]

            processed_subtitles['id'] = subtitle[0]

            if (subtitle[0] == "1") {
                processed_subtitles['timestamp_1'] = timestamp_1
            } else {
                processed_subtitles['timestamp_1'] = prev_time
            }
            processed_subtitles['timestamp_2'] = timestamp_2
            processed_subtitles['content'] = subtitle[2]
            prev_time = timestamp_2
            // console.log(timestamp_1)
            // console.log(timestamp_2)
            all_subtitles.push(processed_subtitles)
        }

    }

    // console.log(all_subtitles)
    return all_subtitles
}

export function generateSrtFile(data) {
    // console.log(data[0])
    // var content = data[0]
    var srtContent = []
    for (var i = 0; i < data.length; i++) {
        var content = data[i]
        var section = []
        var timestamp = []
        section.push(content.id)
        timestamp.push(content.timestamp_1)
        timestamp.push(content.timestamp_2)
        timestamp = timestamp.join(" --> ")
        section.push(timestamp)
        section.push(content.content)
        // console.log(data.)
        section = section.join("\n")
        // console.log(section)
        srtContent.push(section)
    }
    srtContent.push("")
    srtContent = srtContent.join("\n\n")
    // console.log(srtContent)
    return srtContent
}

export function processSubtitle(data) {
    // console.log(data)
    var all_subtitles = []
    var subtitles = data.split("\n\n")
    // console.log(subtitles)
    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i] != "") {

            var processed_subtitles = {}

            var subtitle = subtitles[i].split("\n")
            // console.log(subtitle)
            var timestamps = subtitle[1].split(" --> ")
            // console.log(timestamps)
            var timestamp_1 = timestamps[0]
            var timestamp_2 = timestamps[1]
            processed_subtitles['id'] = subtitle[0]
            processed_subtitles['timestamp_1'] = timestamps[0]
            processed_subtitles['timestamp_2'] = timestamps[1]
            processed_subtitles['content'] = subtitle[2]
            // console.log(timestamp_1)
            // console.log(timestamp_2)
            all_subtitles.push(processed_subtitles)
        }

    }
    // console.log(timestamp_1)
    // console.log(timestamp_2)
    // processed_subtitles.push(subtitle[0])
    // processed_subtitles.push(timestamp_1)
    // processed_subtitles.push(timestamp_2)
    // processed_subtitles.push(subtitle[2])
    // console.log(processed_subtitles)
    // console.log(all_subtitles)

    return all_subtitles
}