import React, { Component, useEffect, useState } from 'react';
import { Layout, Button, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const { BrowserWindow, getCurrentWindow, dialog } = require('@electron/remote')

const { ipcRenderer } = require('electron')

import VideoPlayer from './SubtitleEditPage';
import '../styles/Mainpage.css'


let isMounted;
export default function MainPage(props) {
    const [filePaths, setFilePath] = useState("")
    const dispatch = useDispatch();

    const hasVideo = useSelector(state => state.hasVideo.hasVideo)
    // console.log(ipcRenderer.removeListener('', () => { }));
    const processData = (event, message) => {
        if (isMounted) {
            setFilePath(message)
            dispatch({ type: "SHOW_VIDEO" })
        }
    }
    useEffect(() => {
        isMounted = true;
        if (isMounted) {
            ipcRenderer.on("getStore", processData)
            ipcRenderer.on('fileSelected', processData)

        }


        return () => {
            isMounted = false;
            ipcRenderer.removeListener('getStore', processData)
            ipcRenderer.removeListener('fileSelected', processData);
        }
    })


    const goTo = () => {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Videos', extensions: ['mp4'] }
            ]
        }).then((result) => {
            let cancel = result.canceled
            if (!cancel) {
                console.log(result.filePaths)
                ipcRenderer.send("openNewVideo", result.filePaths)

                ipcRenderer.send("getStore", result.filePaths)
                dispatch({ type: "SHOW_VIDEO" })

            }
            // console.log(cancel)
        });
    }

    // if (!hasVideo) {
    //     return (
    //         <div className='openPage'>
    //             <Button
    //                 onClick={goTo}
    //             >
    //                 Open Video File
    //             </Button>
    //         </div>
    //     )
    // } else {
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
                <VideoPlayer filePath={filePaths} hasVideo={hasVideo} openVideo={goTo} />
            </div>
        )

    // }




}