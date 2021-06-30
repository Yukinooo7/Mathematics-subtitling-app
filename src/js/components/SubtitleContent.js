import React, { useEffect, useState } from 'react'
import { Button, Row, Progress, Card } from 'antd'

import '../styles/VideoPlayer.css'

// var result = {}

export default function SubtitleContent(props) {
    // const [subtitle, setSubtitle] = useState(data)
    // result = props.data

    const divStyle = {
        border: '1px solid rgba(0,0,0,0.05)'
    }
    // console.log(subtitle)
    // console.log(subtitle.data.id)
    // console.log(data)
    // console.log(this.props)
    // console.log(props)

    // useEffect(() => {
    //     let isMount = true

    //     if (isMount) {
    //         setSubtitle(data)
    //         // console.log(subtitle)
    //     }

    //     return () => { isMount = false }
    // },[data])
    // console.log(result)

    const handleChange = (event) => {
        // props.handleTimeStart(event.target.className)
        let result = props.data
        // console.log(result)
        // console.log(props.data)
        if (event.target.className == 'timestamp 1'){
            result['timestamp_1'] = event.target.value
        }
        else if(event.target.className == 'timestamp 2'){
            result['timestamp_2'] = event.target.value

        }else if (event.target.className == 'subtitle-content'){

            result['content'] = event.target.value
        }
        // console.log(result)
        props.handleEditSubtitle(result)
    }
    // {(event) => {props.handleTimeStart(event.target.value)}}

    return (
            <div style={divStyle}>
            <Row>
                <textarea className='timestamp 1'
                    defaultValue={props.data.timestamp_1} onChange={handleChange}>
                </textarea>
                <textarea className='timestamp 2'
                    defaultValue={props.data.timestamp_2} onChange={handleChange}>
                </textarea>
                <textarea className='subtitle-content'
                    defaultValue={props.data.content} onChange={handleChange}>
                </textarea>
            </Row>
            </div>
    )

}