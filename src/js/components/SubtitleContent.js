import React, { useEffect, useState } from 'react'
import { Button, Row, Progress, Card } from 'antd'

import '../styles/VideoPlayer.css'

// var result = {}


export default function SubtitleContent(props) {
    const [content, setContent] = useState(props.data.content)
    const [timestamp_1, setTime1] = useState(props.data.timestamp_1)
    const [timestamp_2, setTime2] = useState(props.data.timestamp_2)
    const [editColor, setEditColor] = useState('white')
    const [contentColor, setContentColor] = useState('white')
    // result = props.data
    // console.log(props)

    // const divStyle = {
    //     border: '1px solid rgba(0,0,0,0.05)',
    //     // backgroundColor: 'black',
    // }
    // console.log(subtitle)
    // console.log(subtitle.data.id)
    // console.log(data)
    // console.log(this.props)
    // console.log(props)
    useEffect(() => {
        // console.log(props.searchResultList)
        if(props.searchResultList == props.data.id){
            // console.log(props.data.id)
            setContentColor('#FFF790')
        }else{
            setContentColor('white')
        }
    }, [props.searchResultList])
    useEffect(() => {
        if(props.currentSubtitle == props.data.content){
            // console.log("Yes!")
            // console.log(props.data.id)
            // console.log(editColor)
            setEditColor('dodgerblue')
        }else {
            setEditColor('white')
        }
    }, [props.currentSubtitle])

    useEffect(() => {
        if (props.data.id == props.latexTransferData[0]) {
            // console.log(props.latexTransferData[1])
            if (props.latexTransferData[1] != 'none') {
                props.data.content = props.latexTransferData[1]
                setContent(props.data.content)
            }
        }
    }, [props.latexTransferData[2]])

    useEffect(() => {
        setContent(props.data.content)
        console.log("b")
    }, [props.data.content])

    useEffect(() => {
        let isMount = true
        // console.log('a')

        if (isMount) {
            setContent(props.data.content)
            setTime1(props.data.timestamp_1)
            setTime2(props.data.timestamp_2)
        }

        return () => { isMount = false }
    }, [props.data])
    // console.log(result)

    const handleChange = (event) => {
        // props.handleTimeStart(event.target.className)
        // console.log('Change!')
        let result = props.data
        props.handleEditStart(props.data)
        // console.log(result)
        // console.log(props.data)
        if (event.target.className == 'timestamp 1') {
            result['timestamp_1'] = event.target.value
            setTime1(props.data.timestamp_1)

        }
        else if (event.target.className == 'timestamp 2') {
            result['timestamp_2'] = event.target.value
            setTime2(props.data.timestamp_2)

        } else if (event.target.className == 'subtitle-content') {

            result['content'] = event.target.value
            setContent(props.data.content)
        }
        // console.log(result)
        props.handleEditSubtitle(result)
    }

    const handleBlue = (event) => {
        // let scroll = props.allowScroll
        // console.log("Blur!")
        // console.log(props.latexTransferData)
        // props.handleAllowScroll(true)
        props.handleEditEnd()
        // scroll = true
    }

    const handleFocus =(event) => {
        // console.log("Focus!")
        // props.allowScroll = false 
        // props.handleAllowScroll(false)
        // console.log(props.latexTransferData)
        props.handleEditing(props.data)
        // console.log(props.data.content)
        // console.log(props.data)
    }
    
    // {(event) => {props.handleTimeStart(event.target.value)}}

    return (
        <div className='subtitle-fragment' id={`subtitle${props.data.id}`} style={{backgroundColor:editColor}}>
            <Row id='subtitle-fragment-1'>
                <textarea className='timestamp 1'
                    value={timestamp_1} onChange={handleChange}>
                </textarea>
                <textarea className='timestamp 2'
                    value={timestamp_2} onChange={handleChange}>
                </textarea>
                <textarea className='subtitle-content' id={props.data.id}
                    value={content} onChange={handleChange} onBlur={handleBlue} onFocus={handleFocus} style={{backgroundColor:contentColor}}>
                </textarea>
            </Row>
        </div>
    )

}