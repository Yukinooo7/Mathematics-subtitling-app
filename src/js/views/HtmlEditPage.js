import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'
import Tooltip from '@material-ui/core/Tooltip';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import FolderIcon from '@material-ui/icons/Folder';

import SubtitleContent from '../components/SubtitleContent'
import SaveArea from '../components/SaveArea'
import BasicInfoComponent from '../components/BasicInfoComponent'
import Duration from '../Utils/Duration'
import { ipcRenderer } from 'electron'

// import html_icon from '../icons/html.svg'
import * as consts from '../Utils/consts'

import { MathJax, MathJaxContext } from "better-react-mathjax";

const { dialog } = require('@electron/remote')

import '../styles/VideoPlayer.css'
import { spawn } from 'child_process'
import path, { resolve } from 'path'

import * as ProcessFunctions from '../Utils/Process'


let fs = require('fs')
const reader = new FileReader();
const { PythonShell } = require('python-shell')
let test = []

function processData(data) {

    if (data != undefined) {

        return data.split("/").pop()

    } else {
        return "None"
    }
}

class HtmlEditPage extends React.Component {

    _isMounted = false;

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
        muted: true,
        playedSeconds: 0,
        subtitle: [],
        videoName: 'None',
        editTime: "New File",
        subtitle_name: "None",
        display: 'none',
        display_button: 'block',
        displaySubtitle: 'none',
        latex_display_content: "",
        currentSubtitle: "",
        ifShowVideo: false,
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
        // console.log(this.ref)
    }

    handleMute = () => {
        this.setState({
            muted: !this.state.muted
        })
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


        this.setState({
            currentSubtitle:
                ProcessFunctions.getCurrentSubtitle(this.state.subtitle, this.state.duration * this.state.played)
        })

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
        // console.log(test)
        // console.log(this.state.display)
        // console.log(this.state.subtitle)

        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: "Subtitles", extensions: ['srt', 'vtt'] }
            ]
        }).then(result => {
            let cancel = result.canceled
            console.log(result)
            // setNewVideo(true)
            // let filePaths = result.filePaths
            // console.log(result.filePaths)
            // setFilePath(result.filePaths)
            // console.log(result.filePaths)
            // ipcRenderer.send("openNewVideo", result.filePaths)
            // dispatch({type: "SHOW_VIDEO"})
            // console.log(cancel)
            // console.log(result)
            console.log(this.props.filePath)
            var video_name = this.props.filePath[0].split("/").pop()
            console.log(video_name)
            var subtitle_name = result.filePaths[0].split("/").pop()
            // console.log(subtitle_name)
            // console.log(result.filePaths)
            fs.readFile(result.filePaths[0], 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }

                this.setState({
                    subtitle: ProcessFunctions.processSubtitle(data)
                })
                test = ProcessFunctions.processSubtitle(data)
                // console.log(data)
            })
            // console.log(test)
            this.setState({
                subtitle_url: result.filePaths[0],
                hasSubtitle: true,
                subtitle_name: subtitle_name,
                display: 'block',
                display_button: 'none',
                displaySubtitle: 'block',
                videoName: video_name
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
        this._isMounted = true
        // console.log("Component Did Mount!")
        // console.log(this.props)
        // console.log(this.props.filePath)
        // console.log(this.props.hasVideo)
        // console.log(this.state.url)



        fs.readFile(this.state.subtitle_url, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            // console.log(data)
            this.setState({
                subtitle: ProcessFunctions.processSubtitle(data)
            })
            // test = processSubtitle(data)
            // console.log(this.state.subtitle)
            // console.log(test)
        })

        if (this._isMounted) {
            ipcRenderer.on("CurrentFile", this.handleCurrentFile)

            ipcRenderer.on("SaveEditSubtitle", this.saveEditSubtitle)

            ipcRenderer.on("ResetEditSubtitle", this.handleResetSubtitle)

            ipcRenderer.on("PlayPauseVideo", this.handlePlayPause)

            ipcRenderer.on("MuteVideo", this.handleMute)


        }
    }

    handleCurrentFile = (event, message) => {
        // console.log(message)
        this.setState({
            videoName: message.name,
            editTime: message.date
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
        if (this.props.filePath != "" && !this.state.ifShowVideo) {
            console.log(this.props.filePath)
            this.setState({
                ifShowVideo: true,
                videoName: this.props.filePath[0].split("/").pop()
            })
        }
        // console.log(this.props.filePath)
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
        this._isMounted = false
        // ipcRenderer.removeAllListeners()

        ipcRenderer.removeListener("SaveEditSubtitle", this.saveEditSubtitle)

        ipcRenderer.removeListener("ResetEditSubtitle", this.handleResetSubtitle)
        ipcRenderer.removeListener("CurrentFile", this.handleCurrentFile)

        ipcRenderer.removeListener("PlayPauseVideo", this.handlePlayPause)

        ipcRenderer.removeListener("MuteVideo", this.handleMute)

        this.setState({
            ifShowVideo: false
        })
        // console.log(ipcRenderer.removeListener('', () => { }));
        // ipcRenderer.removeListener("CurrentFile", (event, message) => {
        //     // console.log(message)
        //     this.setState({
        //         videoName: message.name,
        //         editTime: message.date
        //     })
        // })
        // ipcRenderer.removeListener("SaveEditSubtitle", (event, message) => {
        //     this.saveEditSubtitle();
        // })

        // ipcRenderer.removeListener("ResetEditSubtitle", (event, message) => {
        //     this.handleResetSubtitle();
        // })
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
                // console.log(result)
                srtFile = ProcessFunctions.generateSrtFile(this.state.subtitle)
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
            subtitle: ProcessFunctions.alignTimestamp(this.state.subtitle)
        })

    }

    handleDisplaySubtitle = () => {
        if(this.state.displaySubtitle == 'none'){
            console.log(this.state.displaySubtitle)
            this.setState({
                displaySubtitle: 'block'
            })
        }else {
            console.log(this.state.displaySubtitle)
            this.setState({
                displaySubtitle: 'none'
            })
        }
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
                    muted={this.state.muted}

                    // onReady = {this.handleReady}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                />
                <div className='currentSubtitle' style={{display: this.state.displaySubtitle}}>
                    {this.state.currentSubtitle}
                </div>

                <BasicInfoComponent videoName={this.state.videoName} subtitle_name={this.state.subtitle_name} editTime={this.state.editTime} html_description={consts.html_description} />


                <div className="preview-latex-area"
                    style={{ display: this.state.display }}>
                    <h4 id='video_info_title'
                    >Preview of LaTeX notations</h4>
                    {/* <span>In order to show mathematics equation correctly, please make sure to use the following phrase in the subtitles.</span> */}
                    <h4 id='latex_input_title'>Math equation input area: </h4>
                    <textarea className="input-math-area"
                        value={this.state.latex_display_content}
                        onChange={(event) => {
                            // console.log(event.target.value)
                            this.setState({
                                latex_display_content: event.target.value
                            })
                        }}>
                    </textarea>

                    <h4 id='latex_input_title'>LaTeX Result: </h4>

                    <div className="latex-show-area">
                        <MathJaxContext version={3}>

                            <MathJax inline dynamic>
                                <div style={{ width: '80%', height: '20%', backgroundColor: 'white', overflow: 'scroll' }}>{`\\( ${this.state.latex_display_content} \\)`}</div>
                            </MathJax>{" "}

                        </MathJaxContext>

                    </div>

                </div>

                <div className='function-area' >
                    <Row>
                        <Tooltip title="Open Subtitle" placement="top" arrow>
                            <FolderIcon id="open_subtitle" onClick={this.handleOpenSubtitles}  fontSize='large' />
                        </Tooltip>
                        <Tooltip title="Show/Close Subtitles" placement="top" arrow>
                            <SubtitlesIcon id="open_subtitle" fontSize='large' onClick={this.handleDisplaySubtitle}/>
                        </Tooltip>

                        {/* <Button id="open_subtitle"
                        onClick={this.generateHtmlFile}>Generate HTML file</Button> */}
                        <Tooltip title="Generate Html file" placement="top" arrow>
                            <img src="assets/images/html.svg" id="open_subtitle" onClick={this.generateHtmlFile}  style={{ width: '30px' }}></img>

                        </Tooltip>

                        <Tooltip title="Align Timestamps" placement="top" arrow>
                            <img src="assets/images/alignTime.svg" id="open_subtitle" onClick={this.handleAlignTime} style={{ width: '30px' }}></img>

                        </Tooltip>
                    </Row>

                    {/* <Button id="open_subtitle"
                        onClick={this.handleAlignTime}>Align timestamps</Button> */}



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

export default HtmlEditPage;
