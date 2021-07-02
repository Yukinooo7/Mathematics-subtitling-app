import React, { useEffect, useState } from 'react'
import { Button, Row, Progress, Card } from 'antd'

import '../styles/VideoPlayer.css'

// var result = {}

export default function SubtitleContent(props) {
    const [content, setContent] = useState(props.data.content)
    const [timestamp_1, setTime1] = useState(props.data.timestamp_1)
    const [timestamp_2, setTime2] = useState(props.data.timestamp_2)
    // result = props.data
    // console.log(props)

    const divStyle = {
        border: '1px solid rgba(0,0,0,0.05)'
    }
    // console.log(subtitle)
    // console.log(subtitle.data.id)
    // console.log(data)
    // console.log(this.props)
    // console.log(props)

    useEffect(() => {
        let isMount = true

        if (isMount) {
            setContent(props.data.content)
            setTime1(props.data.timestamp_1)
            setTime2(props.data.timestamp_2)
            // console.log(content)
        }

        return () => { isMount = false }
    },[props])
    // console.log(result)

    const handleChange = (event) => {
        // props.handleTimeStart(event.target.className)
        let result = props.data
        // console.log(result)
        // console.log(props.data)
        if (event.target.className == 'timestamp 1'){
            result['timestamp_1'] = event.target.value
            setTime1(props.data.timestamp_1)

        }
        else if(event.target.className == 'timestamp 2'){
            result['timestamp_2'] = event.target.value
            setTime2(props.data.timestamp_2)

        }else if (event.target.className == 'subtitle-content'){

            result['content'] = event.target.value
            setContent(event.target.value)
        }
        // console.log(result)
        props.handleEditSubtitle(result)
    }
    // {(event) => {props.handleTimeStart(event.target.value)}}

    return (
            <div style={divStyle}>
            <Row>
                <textarea className='timestamp 1'
                    value={timestamp_1} onChange={handleChange}>
                </textarea>
                <textarea className='timestamp 2'
                    value={timestamp_2} onChange={handleChange}>
                </textarea>
                <textarea className='subtitle-content'
                    value={content} onChange={handleChange}>
                </textarea>
            </Row>
            </div>
    )

}