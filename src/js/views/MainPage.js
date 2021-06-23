import React, { Component, useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';

const { BrowserWindow, getCurrentWindow, dialog } = require('@electron/remote')

const { ipcRenderer } = require('electron')

import VideoPlayer from '../components/VideoPlayer';


// var app = document.getElementById('test')
// console.log(app)

// app.ondrag = function(e) {
//   console.log(e)
//   console.log("aaa")
// }


export default function MainPage(props) {
    const [filePath, setFilePath] = useState("")
    const [hasVideo, setNewVideo] = useState(false)
    // const history = useHistory()


    ipcRenderer.on('fileSelected', (event, message) => {
        // console.log(message)
        // // console.log(getCurrentWindow())
        // // opened= message
        setFilePath(message)
    })


    // console.log(props.location.state)

    useEffect(() => {
        // if (props.location.state) {

        //     console.log(props.location.state)
        // }
        // window.removeEventListener("goTo", goTo)
        // console.log("a")
        let isMounted = true;
        if (isMounted) {
            if (!hasVideo && props.location.state) {
                setFilePath(props.location.state.filePath.url)
                setNewVideo(true)
                ipcRenderer.removeListener('fileSelected', () => { });
                console.log(props.location.state.filePath)
            }

        }

        return () => { isMounted = false }
        // if (filePath != "") {
        //     // console.log(filePath)
        //     console.log("aaaaaaaa")
        // }
    })

    const goTo = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Videos', extensions: ['mp4'] }
            ]
        }).then((result) => {
            let cancel = result.canceled
            // let filePaths = result.filePaths
            // console.log(result.filePaths)
            setFilePath(result.filePaths)
            console.log(result.filePaths)
            // console.log(cancel)
        });

        // history.push('/EditPage')
    }

    return (
        // <div onClick={goTo}>
        <div id='test'

            onDrop={(e) => {
                e.preventDefault();
                // console.log(e.dataTransfer.files[0].path)
                setFilePath(e.dataTransfer.files[0].path)
            }}>
            <Button
                onClick={goTo}
            >
                {/* <Link to={{ pathname: '/EditPage', state: { filePath: filePath } }}> */}
                {/* <Link to="/EditPage"> */}
                Open Video File
                {/* </Link> */}
                {/* </Link> */}
            </Button>
            <VideoPlayer filePath={filePath} />
        </div>
    )

}