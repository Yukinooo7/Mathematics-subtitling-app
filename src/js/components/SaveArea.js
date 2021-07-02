import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress, Card, Table } from 'antd'

import Duration from '../Utils/Duration'

export default function SaveArea(props) {

    // console.log(props.duration)
    // console.log(props.played)
    return (
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
                <Duration seconds={props.duration * props.played}></Duration>
                /
                <Duration seconds={props.duration}></Duration>
            </div>

            <Button style={{
                marginTop: "1%",
                marginLeft: "10%",
            }}>
                Save
            </Button>
        </Row>
    )

}