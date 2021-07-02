import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'

import SubtitleContent from './SubtitleContent'
import SaveArea from './SaveArea'
import Duration from '../Utils/Duration'
import { ipcRenderer } from 'electron';

import { MathJax, MathJaxContext } from "better-react-mathjax";

const { dialog } = require('@electron/remote')

import '../styles/VideoPlayer.css'
import { spawn } from 'child_process'
import path, { resolve } from 'path'


let fs = require('fs')
const reader = new FileReader();
const { PythonShell } = require('python-shell')
let test = []

function alignTimestamp(data) {
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

function generateSrtFile(data) {
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

function processSubtitle(data) {
    console.log(data)
    var all_subtitles = []
    var subtitles = data.split("\n\n")
    console.log(subtitles)
    for (var i = 0; i < subtitles.length; i++) {
        if (subtitles[i] != "") {

            var processed_subtitles = {}

            var subtitle = subtitles[i].split("\n")
            console.log(subtitle)
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



class VideoPlayer extends React.Component {

    state = {
        url: null,
        playing: true,
        controls: true,
        duration: 0,
        playbackRate: 1.0,
        currentTime: 0,
        played: 0,
        playedSeconds: 0,
        seekTo: false,
        display_button: false,
        subtitle_url: "",
        hasSubtitle: false,
        hover: false,
        playedSeconds: 0,
        subtitle: [],
        videoName: "None",
        editTime: "None",
        subtitle_name: "None",
        display: 'none',
        display_button: 'block',
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
        // console.log(this.ref)
    }

    // handleReady = state => {
    //     console.log(state)
    // }
    toggleHover = () => {
        this.setState({ hover: !this.state.hover })
    }
    handleProgress = state => {
        // console.log('onProgress:', state)
        // console.log(state)
        this.setState(state)

        // console.log(this.state.playedSeconds)
    }

    handleDuration = duration => {
        // console.log('onDuration:', duration)
        this.setState({ duration })
    }


    ref = player => {
        this.player = player
    }

    handleOpenSubtitles = () => {
        // console.log(state)
        console.log(test)
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: "Subtitles", extensions: ['srt', 'vtt'] }
            ]
        }).then((result) => {
            let cancel = result.canceled
            // setNewVideo(true)
            // let filePaths = result.filePaths
            // console.log(result.filePaths)
            // setFilePath(result.filePaths)
            // console.log(result.filePaths)
            // ipcRenderer.send("openNewVideo", result.filePaths)
            // dispatch({type: "SHOW_VIDEO"})
            // console.log(cancel)
            // console.log(result)
            var subtitle_name = result.filePaths[0].split("/").pop()
            // console.log(subtitle_name)
            // console.log(result.filePaths)
            fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }

                this.setState({
                    subtitle: processSubtitle(data)
                })
                test = processSubtitle(data)
                // console.log(data)
            })
            console.log(test)
            this.setState({
                subtitle_url: result.filePaths[0],
                hasSubtitle: true,
                subtitle_name: subtitle_name,
                display: 'block',
                display_button: 'none',
            })
        });
    }


    getVideoCurrentTime = () => {
        // console.log(this.player.getCurrentTime())
    }

    goBackSeconds = () => {
        // const currentTime = this.state.currentTime
        // this.setState({currentTime: currentTime-15})
        // const currentTime = this.state.playedSeconds
        this.setState({
            playedSeconds: parseFloat(this.state.playedSeconds - 15.0),
            seekTo: true
        })
    }

    goNextSeconds = () => {
        this.setState({
            playedSeconds: parseFloat(this.state.playedSeconds + 15.0),
            seekTo: true
        })
    }

    componentDidMount() {
        // console.log("Component Did Mount!")
        // console.log(this.props)
        // console.log(this.props.filePath)
        // console.log(this.props.hasVideo)
        // console.log(this.state.subtitle_url)
        fs.readFile(this.state.subtitle_url, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            // console.log(data)
            this.setState({
                subtitle: processSubtitle(data)
            })
            // test = processSubtitle(data)
            // console.log(this.state.subtitle)
            // console.log(test)
        })

        ipcRenderer.once("CurrentFile", (event, message) => {
            // console.log(message)
            this.setState({
                videoName: message.name,
                editTime: message.date
            })
        })

        ipcRenderer.on("SaveEditSubtitle", (event, message) => {
            this.saveEditSubtitle();
        })

        ipcRenderer.on("ResetEditSubtitle", (event, message) => {
            this.handleResetSubtitle();
        })

        ipcRenderer.removeListener("SaveEditSubtitle", (event, message) => {
            this.saveEditSubtitle();
        })

        ipcRenderer.removeListener("ResetEditSubtitle", (event, message) => {
            this.handleResetSubtitle();
        })
    }

    componentDidUpdate() {
        if (this.state.seekTo) {
            // console.log('Component Did Update!')
            this.setState({
                seekTo: false,
            })
            this.player.seekTo(this.state.playedSeconds)
            console.log(this.player)


        }
        // if (this.state.hasSubtitle) {
        // let srtURL = URL.createObjectURL(this.state.subtitle_url)
        // reader.readAsText(this.state.subtitle_url)
        // reader.onload = function (e) {
        //     console.log(e.target.result)
        // }
        // console.log("sdas")
        // console.log(this.state.subtitle_url)

        // }
        // console.log(this.state.subtitle)
    }
    componentWillUnmount() {
        // console.log('Component Will Unmount!')
    }

    handleEditSubtitle = (newTime) => {
        // console.log(test)
        // console.log("TIME START!")
        // console.log(newTime)
        let editID = newTime.id - 1
        // console.log(editID)
        // console.log(test[editID])
        // test[editID] = newTime
        // console.log(this.state.subtitle)
        // console.log(test)
        // test = newTime
        console.log(test[editID])
        console.log(this.state.subtitle[editID])
        // console.log(test)
        // this.setState({
        //     subtitle: newTime
        // })
    }

    saveEditSubtitle = (filePaths) => {
        let srtFile
        dialog.showSaveDialog(
            {
                title: "Save as",
                defaultPath: this.state.subtitle_url,
                filters: [{ name: "All files", extensions: ["*"] }]
            }).then((result) => {
                console.log(result)
                srtFile = generateSrtFile(this.state.subtitle)
                fs.writeFileSync(result.filePath, srtFile)
            }).catch((req) => {
                console.log(req)
            })

    }

    handleResetSubtitle = () => {
        this.setState({
            subtitle: test
        })
    }

    generateHtmlFile = () => {
        let htmlPath = this.state.subtitle_url.replace(".srt", ".html")
        console.log(this.state.subtitle_url)
        console.log(htmlPath)
        dialog.showSaveDialog(
            {
                title: "Save as",
                defaultPath: htmlPath,
                filters: [{ name: "All files", extensions: ["*"] }]
            }).then((result) => {
                // console.log(result)
                // srtFile = generateSrtFile(this.state.subtitle)
                // fs.writeFileSync(result.filePath, srtFile)
                PythonShell.run("srt2html.py", { scriptPath: path.join(__dirname, "src/js", "/python_scripts"), args: [this.state.subtitle_url, result.filePath] }, function (err, results) {
                    if (err) throw err
                    console.log(results)
                })
            }).catch((req) => {
                console.log(req)
            })
        // Run Python script

        console.log(this.state.subtitle_url)

    }

    handleAlignTime = () => {
        this.setState({
            subtitle: alignTimestamp(this.state.subtitle)
        })
    }

    render() {
        var linkStyle;
        if (this.state.hover) {
            linkStyle = { backgroundColor: 'LightGray', display: this.state.display }
        } else {
            linkStyle = { backgroundColor: 'white', display: this.state.display }
        }
        return (
            <div className='player-wrapper'>
                <ReactPlayer
                    ref={this.ref}
                    className='react-player'
                    // url='/Users/lingyun/EdinburghPGT/OBS/sample.mp4'
                    url={this.props.filePath}
                    width='50%'
                    height='50%'
                    playing={this.state.playing}
                    controls={this.state.controls}
                    duration={this.state.duration}
                    muted={true}

                    // onReady = {this.handleReady}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                />
                <div className="basic-info-area"
                    style={{ display: this.state.display }}>
                    <h4 id='video_info_title'>Video Information</h4>
                    {/* <p>Video title: </p>
                    <p>Subtitle File name: </p>
                    <p>Last edited time:  </p> */}
                    <table>
                        <tbody>
                            <tr>
                                <th>Video file: </th>
                                <td>{this.state.videoName}</td>
                            </tr>
                            <tr>
                                <th>Subtitle file: </th>
                                <td>{this.state.subtitle_name}</td>
                            </tr>
                            <tr>
                                <th>Last edit time: </th>
                                <td>{this.state.editTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 id='video_info_title'
                        style={{
                            marginTop: "5px",
                        }}
                    >Current Shortcuts</h4>

                    <table>
                        <tbody>
                            <tr>
                                <th>Command + O: </th>
                                <td>Open new video</td>
                            </tr>
                            <tr>
                                <th>Command + S: </th>
                                <td>Save the edited subtitle</td>
                            </tr>
                            <tr>
                                <th>Command + G: </th>
                                <td>Reset the subtitle</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="preview-latex-area"
                    style={{ display: this.state.display }}>
                    <h4 id='video_info_title'
                    >Preview of LaTeX notations</h4>
                    <span>In order to show mathematics equation correctly, please make sure to use the following phrase in the subtitles.</span>

                    <MathJaxContext>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Alpha: </th>
                                    <td>
                                        <MathJax>{"\\( \\alpha \\)"}</MathJax></td>
                                </tr>
                                <tr>
                                    <th>Beta: </th>
                                    <td>
                                        <MathJax>{"\\( \\beta \\)"}</MathJax></td>
                                </tr>
                                <tr>
                                    <th>Rho: </th>
                                    <td>
                                        <MathJax>{"\\( \\rho \\)"}</MathJax></td>
                                </tr>
                                <tr>
                                    <th>sigma: </th>
                                    <td>
                                        <MathJax>{"\\( \\sigma \\)"}</MathJax></td>
                                </tr>
                                <tr>
                                    <th>alpha subscript 2: </th>
                                    <td>
                                        <MathJax>{"\\( \\alpha_{2} \\)"}</MathJax></td>
                                </tr>
                            </tbody>
                        </table>

                    </MathJaxContext>
                </div>

                <div className='function-area'>

                    <Button id="open_subtitle"
                        onClick={this.handleOpenSubtitles}>Open Subtitles</Button>

                    <Button id="open_subtitle"
                        onClick={this.generateHtmlFile}>Generate HTML file</Button>

                    <Button id="open_subtitle"
                        onClick={this.handleAlignTime}>Align timestamps</Button>

                    {/* <Button 
                        onClick={this.handlePlayPause}
                        disabled={this.state.display_button}
                        >
                        {this.state.playing?"play":"pause"}
                    </Button>
                    <Button onClick={() => this.player.getCurrentTime()}>Show preview</Button>
                    <Button onClick={this.goBackSeconds}>Back 15 seconds</Button>
                    <Button onClick={this.goNextSeconds}>Next 15 seconds</Button> */}
                    {/* <Progress>

                    </Progress> */}

                </div>
                <div className='save-area'
                    style={{ display: this.state.display }}>
                    {/* <SaveArea duration={this.state.duration} played={this.state.played} /> */}
                    <Row>
                        <textarea style={{
                            marginTop: '2%',
                            marginLeft: '1%',
                            width: "40%",
                            height: '25px',
                            border: '2px solid rgba(0,0,0,0.05)',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            resize: 'none',
                            // borderRadius: "10px",
                            // color: "black",
                        }} type="text" placeholder="Search Captions" />
                        <div style={{
                            marginTop: '2%',
                            marginLeft: '10%',
                            // borderRadius: "10px",
                            // color: "black",
                        }}>
                            <Duration seconds={this.state.duration * this.state.played}></Duration>
                            /
                            <Duration seconds={this.state.duration}></Duration>
                        </div>

                        <Button
                            style={{
                                marginTop: '1%',
                                marginLeft: '5%',
                            }}
                            onClick={this.handleResetSubtitle}>
                            Reset changes
                        </Button>
                        <Button
                            style={{
                                marginTop: "1%",
                                marginLeft: "2%",
                            }}
                            onClick={this.saveEditSubtitle}>
                            Save
                        </Button>
                    </Row>
                </div>
                <div className="subtitle-area"
                    style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    {this.state.subtitle.map((item, idx) => (
                        <SubtitleContent key={idx} data={item} handleEditSubtitle={this.handleEditSubtitle} />
                    ))}

                </div>



            </div >
        )
    }

}

export default VideoPlayer;
