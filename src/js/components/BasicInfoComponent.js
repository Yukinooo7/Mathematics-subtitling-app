import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'
import * as consts from "../Utils/consts"


export default function BasicInfoComponent(props) {
    const [displayVideoName, setDisplayVideoName] = useState('table')
    const [displayShortcut, setDisplayShortcut] = useState('table')
    const [displayDescription, setDisplayDescription] = useState('table')
    const changeVideoNameDisplay = (event) => {
        console.log(event.target.className)
        if (event.target.className == 'video_info_title info') {
            if (displayVideoName == 'table') {
                setDisplayVideoName('none')
            } else {
                setDisplayVideoName('table')
            }

        }
        else if (event.target.className == 'video_info_title shortcut') {
            if (displayShortcut == 'table') {
                setDisplayShortcut('none')
            } else {
                setDisplayShortcut('table')
            }
        }
        else if (event.target.className == 'video_info_title description') {
            if (displayDescription == 'table') {
                setDisplayDescription('none')
            } else {
                setDisplayDescription('table')
            }
        }
    }

    return (
        <div className="basic-info-area"
        >
            <h4 className='video_info_title info'
                onClick={changeVideoNameDisplay}>
                Video Information
            </h4>
            {/* <p>Video title: </p>
                    <p>Subtitle File name: </p>
                    <p>Last edited time:  </p> */}
            <table style={{ display: displayVideoName }}>
                <tbody>
                    <tr>
                        <th >Video file: </th>
                        <td>{props.videoName}</td>
                    </tr>
                    <tr>
                        <th>Subtitle file: </th>
                        <td>{props.subtitle_name}</td>
                    </tr>
                    <tr>
                        <th>Last edit time: </th>
                        <td>{props.editTime}</td>
                    </tr>
                    {/* <tr>
                                <th>Last edit time: </th>
                                <td>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
                            </tr> */}
                </tbody>
            </table>


            <h4 className='video_info_title description'
                style={{
                    marginTop: "5px",
                }}
                onClick={changeVideoNameDisplay}
            >Current page description</h4>
            <span style={{ display: displayDescription }}>
                {props.html_description}
            </span>


            <h4 className='video_info_title shortcut'
                style={{
                    marginTop: "5px",
                }}
                onClick={changeVideoNameDisplay}
            >Current Shortcuts</h4>

            <table style={{ display: displayShortcut }}>
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
                    <tr>
                        <th>Command + P: </th>
                        <td>Play/Pause the video</td>
                    </tr>
                    <tr>
                        <th>Command + M: </th>
                        <td>Mute/Unmute the video</td>
                    </tr>
                    {props.latexEditMode
                        ?
                        <tr>
                            <th>Command + L: </th>
                            <td>Generate LaTeX Delimiter</td>
                        </tr>
                        :
                        null
                    }
                </tbody>
            </table>
        </div>
    )
}