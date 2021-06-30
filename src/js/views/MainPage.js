import React, { Component, useEffect, useState } from 'react';
import { Layout, Button, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const { BrowserWindow, getCurrentWindow, dialog } = require('@electron/remote')

const { ipcRenderer } = require('electron')

import VideoPlayer from '../components/VideoPlayer';


// var app = document.getElementById('test')
// console.log(app)

// app.ondrag = function(e) {
//   console.log(e)
//   console.log("aaa")
// }
let isMounted;
export default function MainPage(props) {
    // const [hasVideo, setNewVideo] = useState(false)
    const [filePaths, setFilePath] = useState("")
    const dispatch = useDispatch();
    // const history = useHistory()
    // console.log(props.location.state)

    // console.log(ipcRenderer.removeListener('fileSelected', () => { }))

    const hasVideo = useSelector(state => state.hasVideo.hasVideo)

    const processData = (event, message) => {
        // console.log("Process Data")
        // if (props.location.state) {
        //     if (props.location.state.filePath.url[0] != message) {
        if (isMounted) {
            setFilePath(message)
            // setNewVideo(true)
            // console.log(message)
        }

        //     }
        // }
    }
    ipcRenderer.once("getStore", processData)
    useEffect(() => {
        // console.log(Date())
        isMounted = true;
        ipcRenderer.removeListener('fileSelected', processData)
        // when use siderbar to open main page
        if (props.location.state) {
            // console.log("fsfssfs")

            // if (isMounted) {
            //     // setFilePath(props.location.state.filePath.url)
            //     let file = [props.location.state.filePath.url]
            //     ipcRenderer.send("openNewVideo", file)
            // }
            // setNewVideo(true)
            // ipcRenderer.removeListener('fileSelected', () => { });
            if (props.location.state.filePath.url[0] == undefined || props.location.state.filePath.url[0] == "/") {
                // console.log("No file opened")
                // console.log(props.location.state.filePath.url)
            } else {
                // console.log(props.location.state.filePath.url)
                ipcRenderer.send("openNewVideo", props.location.state.filePath.url)
            }
            // console.log("aafdsfs")
        }
        // console.log(Date())
        // else {
        // console.log(props.location.state)
        ipcRenderer.once('fileSelected', processData)

        // }



        // console.log(filePaths)
        // ipcRenderer.removeListener('fileSelected', () => { });



        return () => {
            isMounted = false;
            ipcRenderer.removeListener('fileSelected', processData);
            // setNewVideo(false)
        }
        // if (filePath != "") {
        //     // console.log(filePath)
        //     console.log("aaaaaaaa")
        // }
    })


    // ipcRenderer.removeListener('fileSelected', processData)

    const goTo = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Videos', extensions: ['mp4'] }
            ]
        }).then((result) => {
            let cancel = result.canceled
            // setNewVideo(true)
            // let filePaths = result.filePaths
            // console.log(result.filePaths)
            // setFilePath(result.filePaths)
            // console.log(result.filePaths)
            ipcRenderer.send("openNewVideo", result.filePaths)
            dispatch({type: "SHOW_VIDEO"})
            console.log(cancel)
        });

        // history.push('/EditPage')
    }

    if (!hasVideo) {
        return (
            <Button
                onClick={goTo}
            >
                Open Video File
            </Button>
        )
    } else {
        return (
            // <div onClick={goTo}>
            <div id='test'
                onDrop={(e) => {
                    e.preventDefault();
                    // console.log(e.dataTransfer.files)
                    // setFilePath(e.dataTransfer.files[0].path)
                    const file = [e.dataTransfer.files[0].path]
                    // console.log(file)
                    ipcRenderer.send("openNewVideo", file)
                }}>
                <VideoPlayer filePath={filePaths} hasVideo={hasVideo} />
            </div>
        )

    }




}