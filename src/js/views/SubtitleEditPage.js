import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'
import Tooltip from '@material-ui/core/Tooltip';
import SubtitlesIcon from '@material-ui/icons/Subtitles';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

import SubtitleContent from '../components/SubtitleContent'
import SaveArea from '../components/SaveArea'
import BasicInfoComponent from '../components/BasicInfoComponent'
import PreviewLatex from '../components/PreviewLatex';
import Duration from '../Utils/Duration'
import { ipcRenderer, clipboard } from 'electron'
import _ from 'lodash'

// import html_icon from '../icons/html.svg'
import * as consts from '../Utils/consts'

import { MathJax, MathJaxContext } from "better-react-mathjax";

const { dialog, } = require('@electron/remote')

import '../styles/VideoPlayer.css'
import { spawn } from 'child_process'
import path, { resolve } from 'path'

import * as ProcessFunctions from '../Utils/Process'


let fs = require('fs')
const reader = new FileReader();
const { PythonShell } = require('python-shell')
var test = []
// let latexTransferData = [1, "none", "none"]


class SubtitleEditPage extends React.Component {

    _isMounted = false;

    state = {
        url: null,
        playing: false,
        controls: true,
        duration: 0,
        playbackRate: 1.0,
        currentTime: 0,
        played: 0,
        playedSeconds: 0,
        seekTo: false,
        subtitle_url: "",
        hasSubtitle: false,
        // hover: false,
        muted: true,
        playedSeconds: 0,
        subtitle: [],
        videoName: 'None',
        editTime: "New File",
        subtitle_name: "None",
        display: 'none',
        display_button: 'block',
        displaySubtitle: 'none',
        displayLatexSubtitle: 'none',
        latexEditMode: false,
        latex_display_content: "",
        currentSubtitle: "",
        ifShowVideo: false,
        allowScroll: true,
        hasTransferred: false,
        latexTransferData: [1, "none", "none"],
        original_subtitle: [],
        searchInput: "none",
        searchResultList: ['none'],
        currentResult: "none",
        pythonPath: ""
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
    // // }
    // toggleHover = () => {
    //     this.setState({ hover: !this.state.hover })
    // }
    handleProgress = state => {
        // console.log('onProgress:', state)
        // console.log(state)
        this.setState(state)
        const currentList = ProcessFunctions.getCurrentSubtitle(this.state.subtitle, this.state.duration * this.state.played)
        if (currentList != undefined) {
            this.setState({
                currentSubtitle: currentList.content
            })

            // console.log(currentList.id)
            if (this.state.allowScroll) {
                var scrollToSubtitle = document.getElementById(`subtitle${currentList.id}`)
                scrollToSubtitle.scrollIntoView(false);
            }
        }
        // this.setState({
        //     currentSubtitle:
        //         ProcessFunctions.getCurrentSubtitle(this.state.subtitle, this.state.duration * this.state.played)
        // })

        // console.log(this.state.playedSeconds)
        // const subtitle_id = this.state
        // var elemnt = document.getElementById('subtitle20')
        // elemnt.scrollIntoView(false);
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
            if (!cancel) {
                // console.log(result)
                var video_name = this.props.filePath[0].split("/").pop()
                // console.log(video_name)
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
                    // const newState = {...this.state, original_subtitle: ProcessFunctions.processSubtitle(data)}
                    // this.setState(newState)
                    test = _.cloneDeep(ProcessFunctions.processSubtitle(data))
                    // console.log(data)
                })
                // console.log(test)
                this.setState({
                    subtitle_url: result.filePaths[0],
                    hasSubtitle: true,
                    playing: true,
                    subtitle_name: subtitle_name,
                    display: 'block',
                    display_button: 'none',
                    displaySubtitle: 'block',
                    videoName: video_name
                })
            }
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

            ipcRenderer.on("LatexTransfer", this.handleLatexTransfer)
            

            ipcRenderer.send('sendPythonPath')
            ipcRenderer.on('pythonPath', this.getPythonPath)


        }
    }

    getPythonPath = (event, message) => {
        // console.log(message)
        this.setState({
            pythonPath: message
        })
    }

    handleLatexTransfer = () => {

        if (this.state.latexEditMode) {
            const selection = window.getSelection()
            // console.log(selection)
            const str = selection.toString()
            selection.removeAllRanges()
            const latex = `\\( ${str} \\)`
            // console.log(str)
            // clipboard.writeText(latex)
            // clipboard.readText(latex)
            // latexTransferData[1] = clipboard.readText()
            var timestamp = (new Date()).valueOf();
            // console.log(timestamp)
            var temp = [0, "none", "none"]
            temp[0] = document.activeElement.id
            temp[1] = document.activeElement.value.replace(str, latex)
            temp[2] = timestamp
            this.setState({
                latexTransferData: temp
            })
            // console.log(document.activeElement.id)
            // console.log(latexTransferData)

        }
        // document.activeElement.value = clipboard.readText()
        // document.getElementById('1').innerHTML = clipboard.readText()
        // console.log(document.getElementById('1').innerHTML)
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
            // console.log(this.player)
        }
        if (this.props.filePath != "" && !this.state.ifShowVideo) {
            // console.log(this.props.filePath)
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

        ipcRenderer.removeListener("LatexTransfer", this.handleLatexTransfer)


        ipcRenderer.removeListener('pythonPath', this.getPythonPath)

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
        this.setState({
            currentSubtitle: newTime.content
        })
        // test = newTime
        // console.log(test[editID])
        // console.log(this.state.subtitle[editID])
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

                let cancel = result.canceled
                if (!cancel) {
                    srtFile = ProcessFunctions.generateSrtFile(this.state.subtitle)
                    fs.writeFileSync(result.filePath, srtFile)
                }
                // console.log(result)
            }).catch((req) => {
                console.log(req)
            })
    }

    handleResetSubtitle = () => {
        // console.log(test)
        // const original = test
        var new_data = _.cloneDeep(test)
        this.setState({
            subtitle: new_data,
            hasTransferred: false,
        })
    }

    // generateHtmlFile = () => {
    //     let htmlPath = this.state.subtitle_url.replace(".srt", ".html")
    //     // console.log(this.state.subtitle_url)
    //     // console.log(htmlPath)
    //     dialog.showSaveDialog(
    //         {
    //             title: "Save as",
    //             defaultPath: htmlPath,
    //             filters: [{ name: "All files", extensions: ["*"] }]
    //         }).then((result) => {
    //             // console.log(result)
    //             // srtFile = generateSrtFile(this.state.subtitle)
    //             // fs.writeFileSync(result.filePath, srtFile)
    //             // pythonPath:'/Users/lingyun/opt/anaconda3/bin/python',
    //             // console.log(PythonShell.run("srt2html.py", { scriptPath: path.join(__dirname, "utils", ""), option:"/Users/lingyun/opt/anaconda3/bin/python3", args: [this.state.subtitle_url, result.filePath] }, function (err, results) {
    //             //     if (err) throw err
    //             //     console.log(results)
    //             //     console.log()
    //             // }))
    //             PythonShell.run("srt2html.py", { scriptPath: path.join(__dirname, "utils", ""), pythonPath: '', args: [this.state.subtitle_url, result.filePath] }, function (err, results) {
    //                 if (err) throw err
    //                 console.log(results)
    //                 console.log()
    //             })
    //         }).catch((req) => {
    //             console.log(req)
    //         })
    //     // Run Python script

    //     // console.log(this.state.subtitle_url)

    // }

    saveHtmlFile = () => {
        let htmlPath = this.state.subtitle_url.replace(".srt", ".html")
        // console.log(this.state.subtitle_url)
        // console.log(htmlPath)

        var latexSubtitle = ProcessFunctions.generateSrtFile(this.state.subtitle)
        dialog.showSaveDialog(
            {
                title: "Save as",
                defaultPath: htmlPath,
                filters: [{ name: "All files", extensions: ["html"] }]
            }).then((result) => {
                let cancel = result.canceled
                if (!cancel) {
                    PythonShell.run("latex2html.py", { scriptPath: path.join(__dirname, "utils", ""), pythonPath:this.state.pythonPath, args: [latexSubtitle, result.filePath] }, function (err, results) {
                        if (err) throw err
                        // data[0].content = results[0]
                        // console.log(results)
                    })
                }
            }).catch((req) => {
                console.log(req)
            })

    }

    generateHtmlFile = () => {

        if (!this.state.hasTransferred) {
            this.setState({
                subtitle: ProcessFunctions.srt2html(this.state.subtitle),
                hasTransferred: true,
                // currentSubtitle: ProcessFunctions.srt2html(this.state.subtitle)[this.state.firstResult]
            })

        }
        // console.log(this.state.subtitle)
    }

    handleAlignTime = () => {
        this.setState({
            subtitle: ProcessFunctions.alignTimestamp(this.state.subtitle)
        })

    }

    handleLatexModeChange = () => {

        if (!this.state.latexEditMode) {
            const editedSubtitle = _.cloneDeep(this.state.subtitle)
            test =  editedSubtitle
        }else{
            this.handleResetSubtitle()
        }
        this.setState({
            latexEditMode: !this.state.latexEditMode,
            displaySubtitle: 'block',
            displayLatexSubtitle: 'block',
        })

    }

    handleDisplaySubtitle = () => {
        if (this.state.displaySubtitle == 'none') {
            // console.log(this.state.displaySubtitle)
            this.setState({
                displaySubtitle: 'block',
                // displayLatexSubtitle: 'none',
            })
        } else {
            // console.log(this.state.displaySubtitle)
            this.setState({
                displaySubtitle: 'none',
                // displayLatexSubtitle: 'block',
            })
        }
    }

    handleDisplayLatexSubtitle = () => {
        if (this.state.displayLatexSubtitle == 'none') {
            // console.log(this.state.displaySubtitle)
            this.setState({
                displayLatexSubtitle: 'block',
            })
        } else {
            // console.log(this.state.displaySubtitle)
            this.setState({
                displayLatexSubtitle: 'none',
            })
        }
    }

    handleSearch = (e) => {
        // console.log(e.target.value)
        if(e.target.value == ''){
            console.log("empty")
            this.setState({
                searchInput: "none",
                searchResultList: ['none']
            })
        }
    }

    handleEnterKey = (e) => {
        // console.log(e.nativeEvent.keyCode)
        if(e.nativeEvent.keyCode == 13){
            e.preventDefault();
            var temp
            if(this.state.searchInput == e.target.value){
                temp = this.state.searchResultList
            }else{
                temp = ProcessFunctions.searchWord(this.state.subtitle, e.target.value)
            }
            var firstResult = temp.shift()
            const currentSubtitle =this.state.subtitle[parseInt(firstResult)-1]
            this.handleEditStart(currentSubtitle)
            if(firstResult != undefined){
                var scrollToSubtitle = document.getElementById(`subtitle${firstResult}`)
                scrollToSubtitle.scrollIntoView(true);
            }
            this.setState({
                searchInput: e.target.value,
                searchResultList: temp,
                allowScroll: false,
                currentResult: firstResult,
                currentSubtitle: currentSubtitle.content,
            })
            // console.log(ProcessFunctions.searchWord(this.state.subtitle, e.target.value))

        }
    }

    handleAllowScroll = (boolean) => {

        this.setState({
            allowScroll: boolean
        })
    }

    handleEditing = (data) => {

        this.handleAllowScroll(false)
        // console.log(data.content)
        this.setState({
            // playing: false,
            currentSubtitle: data.content
        })
        // var scrollToSubtitle = document.getElementById(`subtitle${currentId}`)
        // scrollToSubtitle.scrollIntoView(false);
        // console.log(data)
        // console.log(this.state.playedSeconds)
        // console.log(data.timestamp_1)
        var realTime = ProcessFunctions.getRealTime(data.timestamp_1.split(":"))
        // console.log(realTime)
        if (realTime < 1) {
            realTime = 0
        }
        this.player.seekTo(realTime+1)
        // console.log(this.player.getCurrentTime())
        // console.log(this.state.playing)


    }

    handleEditStart = (data) => {
        this.setState({
            playing: false
        })

        var realTime = ProcessFunctions.getRealTime(data.timestamp_1.split(":"))

        if (realTime < 1) {
            realTime = 0
        }
        // console.log(realTime)
        this.player.seekTo(realTime)
    }

    handleEditEnd = () => {
        this.setState({
            // playing: true,
            allowScroll: true,
        })
        // console.log(this.state.playing)

    }


    render() {
        // var linkStyle;
        // if (this.state.hover) {
        //     linkStyle = { backgroundColor: 'LightGray', display: this.state.display }
        // } else {
        //     linkStyle = { backgroundColor: 'white', display: this.state.display }
        // }
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

                {this.state.latexEditMode ?

                    <div className='currentSubtitle' style={{ display: this.state.displayLatexSubtitle }}>

                        <MathJaxContext version={3}>

                            <MathJax inline dynamic>
                                <div className="text">
                                    <p>
                                        {this.state.currentSubtitle}
                                    </p>
                                </div>
                            </MathJax>{" "}

                        </MathJaxContext>
                    </div>
                    :
                    <div className='currentSubtitle' style={{ display: this.state.displaySubtitle, marginTop: '5%' }}>
                        {this.state.currentSubtitle}
                    </div>

                }
                <BasicInfoComponent videoName={this.state.videoName} subtitle_name={this.state.subtitle_name} editTime={this.state.editTime} latexEditMode={this.state.latexEditMode} />
                {this.state.latexEditMode ?
                    <PreviewLatex display={this.state.display} />
                    :
                    ""
                }



                <div className='function-area' >
                    <Row>
                        <Tooltip title="Open New Video" placement="top" arrow>
                            <AddCircleOutlineOutlinedIcon id="open_subtitle" onClick={this.props.openVideo} fontSize='large' />
                        </Tooltip>

                        <Tooltip title="Open Subtitle" placement="top" arrow>

                            {this.state.hasSubtitle ?
                                <DescriptionOutlinedIcon id="open_subtitle" onClick={this.handleOpenSubtitles} fontSize='large' />
                                :
                                <DescriptionOutlinedIcon style={{
                                    backgroundColor: 'dodgerblue'
                                }} id="open_subtitle" onClick={this.handleOpenSubtitles} fontSize='large' />
                            }
                        </Tooltip>

                        {this.state.latexEditMode ?
                            <Tooltip title="Show/Hide LaTeX Subtitles" placement="top" arrow>
                                <img src="assets/images/latexDisplay.svg" id="open_subtitle" onClick={this.handleDisplayLatexSubtitle} style={{ width: '30px' }}></img>
                            </Tooltip>
                            :
                            <Tooltip title="Show/Hide Subtitles" placement="top" arrow>
                                <SubtitlesIcon id="open_subtitle" fontSize='large' onClick={this.handleDisplaySubtitle} />
                            </Tooltip>
                        }

                        {/* <Button id="open_subtitle"
                        onClick={this.generateHtmlFile}>Generate HTML file</Button> */}

                        <Tooltip title="Align Timestamps" placement="top" arrow>
                            <img src="assets/images/alignTime.svg" id="open_subtitle" onClick={this.handleAlignTime} style={{ width: '30px' }}></img>

                        </Tooltip>
                        {this.state.latexEditMode ?
                            <Tooltip title="Generate math subtitles" placement="top" arrow>
                                <img src="assets/images/html.svg" id="open_subtitle" onClick={this.generateHtmlFile} style={{ width: '30px' }}></img>
                            </Tooltip>
                            :
                            ""
                        }
                        {/* <Button onClick={this.saveHtmlFile}>
                            Generate Math Subtitle
                        </Button> */}
                        <Tooltip title="Go to LaTeX Edit Page" placement="top" arrow>
                            <Button size='small' style={{ position: 'absolute', marginLeft: '75%', marginTop: "1%" }} onClick={this.handleLatexModeChange}>{this.state.latexEditMode ? 'Subtitle Editing Mode' : 'LaTeX Editing Mode'}</Button>
                        </Tooltip>

                        {/* <Tooltip title="Align Timestamps" placement="top" arrow>
                            {this.state.hasSubtitle ? <DescriptionOutlinedIcon /> : <DescriptionTwoToneIcon />}

                        </Tooltip> */}


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
                {this.state.hasSubtitle ?
                    ""
                    :
                    <span className="no-subtitle">Please Open a subtitle file</span>}

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
                            overflow: 'hidden',
                            // borderRadius: "10px",
                            // color: "black",
                        }} type="text" placeholder="Search Captions" onKeyPress={this.handleEnterKey} onChange={this.handleSearch}/>
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
                        <Tooltip title={this.state.latexEditMode ? "Save Edited Html" : "Save Edited Subtitle"} placement="top" arrow>
                            <Button
                                style={{
                                    marginTop: "1%",
                                    marginLeft: "2%",
                                }}
                                onClick={this.state.latexEditMode
                                    ?
                                    this.saveHtmlFile
                                    :
                                    this.saveEditSubtitle}>
                                Save
                            </Button>
                        </Tooltip>
                    </Row>
                </div>
                <div className="subtitle-area" style={{ display: this.state.display }}>
                    {this.state.subtitle.map((item, idx) => (
                        <SubtitleContent key={idx} data={item} handleEditSubtitle={this.handleEditSubtitle} latexTransferData={this.state.latexTransferData} currentSubtitle={this.state.currentSubtitle} handleEditStart={this.handleEditStart} handleEditing={this.handleEditing} handleEditEnd={this.handleEditEnd} searchResultList={this.state.currentResult}/>
                    ))}

                </div>



            </div >
        )
    }

}

export default SubtitleEditPage;
