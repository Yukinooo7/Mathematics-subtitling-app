import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'

import SubtitleContent from './SubtitleContent'
import Duration from '../Utils/Duration'

const { dialog } = require('@electron/remote')

import '../styles/VideoPlayer.css'
import { spawn } from 'child_process'
import path from 'path'



import {
    SearchOutlined
} from '@ant-design/icons';

let fs = require('fs')
const reader = new FileReader();
const { PythonShell } = require('python-shell')
let test = []


function processSubtitle(data) {
    // console.log(data)
    var all_subtitles = []
    var subtitles = data.split("\n\n")
    // console.log(subtitles)
    for (var i = 0; i < subtitles.length; i++) {

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
    // console.log(timestamp_1)
    // console.log(timestamp_2)
    // processed_subtitles.push(subtitle[0])
    // processed_subtitles.push(timestamp_1)
    // processed_subtitles.push(timestamp_2)
    // processed_subtitles.push(subtitle[2])
    console.log(processed_subtitles)
    console.log(all_subtitles)

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
        subtitle_url: "/Users/lingyun/EdinburghPGT/OBS/sample.srt",
        hasSubtitle: false,
        hover: false,
        playedSeconds: 0,
        subtitle: [],
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
            console.log(cancel)
            console.log(result.filePaths)
            this.setState({
                subtitle_url: result.filePaths[0],
                hasSubtitle: true
            })
            // Run Python script
            // PythonShell.run("test.py", {scriptPath: path.join(__dirname, "src/js", "/python_scripts"), args:[this.state.subtitle_url]}, function (err,results) {
            //     if(err) throw err
            //     console.log(results)
            // })
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
        console.log(this.props.filePath)
        console.log(this.props.hasVideo)
        console.log(this.state.subtitle_url)
        fs.readFile(this.state.subtitle_url, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            // console.log(data)
            this.setState({
                subtitle: processSubtitle(data)
            })
            test = processSubtitle(data)
            // console.log(this.state.subtitle)
            console.log(test)
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
        if (this.state.hasSubtitle) {
            // let srtURL = URL.createObjectURL(this.state.subtitle_url)
            // reader.readAsText(this.state.subtitle_url)
            // reader.onload = function (e) {
            //     console.log(e.target.result)
            // }
            // console.log("sdas")
            console.log(this.state.subtitle_url)
            fs.readFile(this.state.subtitle_url, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                    return
                }
                console.log(data)
            })
        }
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
        test[editID] = newTime
        // console.log(this.state.subtitle)
        // console.log(test)
        // test = newTime
        // console.log(test)
        // this.setState({
        //     subtitle: newTime
        // })
    }


    render() {
        var linkStyle;
        if (this.state.hover) {
            linkStyle = { backgroundColor: 'LightGray' }
        } else {
            linkStyle = { backgroundColor: 'white' }
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
                {/* <div className='subtitle-titles-viewer'>

                </div> */}
                <Row>
                    <Button onClick={this.handleOpenSubtitles}>Open Subtitles</Button>
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
                </Row>
                <div className='function-area'>

                </div>
                <div className='save-area'>
                    <Row>
                        {/* <SearchOutlined /> */}
                        <textarea style={{
                            marginTop: '2%',
                            marginLeft: '1%',
                            width: "50%",
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

                        <Button style={{
                            marginTop: "1%",
                            marginLeft: "10%",
                        }}>
                            Save
                        </Button>
                    </Row>

                </div>
                <div className="subtitle-area"
                    style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
                    {test.map((item, idx) => (
                        <SubtitleContent key={idx} data={item} handleEditSubtitle={this.handleEditSubtitle} />
                    ))}

                    {/* {historyData.map((item, idx) => (
                        <Card key={idx} type="inner" title={item.name} extra={<Button onClick={() => { removeHistory(idx) }}>Delete</Button>}>
                            <Link to={{ pathname: '/', state: { filePath: item.path } }} onClick={() => {
                                dispatch({ type: "key1" })
                                dispatch({ type: "SHOW_VIDEO" })
                            }} >
                                Last edited: {item.date}
                            </Link>
                        </Card>
                    ))} */}
                    {/* <SubtitleContent /> */}
                    {/* </Table> */}


                </div>

            </div>
        )
    }

}

export default VideoPlayer;
