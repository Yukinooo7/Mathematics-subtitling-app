import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Button, Row, Progress } from 'antd'


import '../styles/VideoPlayer.css'

// export default function VideoPlayer() {
//     // state = {
//     //     url: null,
//     //     playing: true,
//     //     controls: true,
//     //     duration: 0,
//     //     playbackRate: 1.0,
//     //     currentTime: 0,
//     //     played: 0,
//     //     playedSeconds: 0,
//     //     seekTo: false,
//     // }
//     const [playing, setPlaying] = useState(true)
//     const [controls, setControls] = useState(true)
//     const [playedSeconds, setPlayedSeconds] = useState(0)
//     const [seekTo, setSeekTo] = useState(false)


//     // handlePlayPause = () => {
//     //     // this.setState({playing: !this.state.playing})
//     //     setPlaying(!playing)
//     //     // console.log(this.ref)
//     // }

//     const handlePlayPause = () => {
//         setPlaying(!playing)
//     }



//     const handleProgress = state => {
//         // console.log('onProgress:', state)
//         // this.setState(state)
//         // console.log('onProgress', state)
//         setPlayedSeconds(state.playedSeconds)
//         // set

//         // console.log(this.state.playedSeconds)
//     }

//     // handleDuration = duration => {
//     //     // console.log('onDuration:', duration)
//     //     this.setState({duration})
//     // }


//     // getVideoCurrentTime = () => {
//     //     // console.log(this.player.getCurrentTime())
//     // }
//     const goBackSeconds = () => {
//         const currentTime = playedSeconds - 15
//         setPlayedSeconds(parseFloat(currentTime))
//         setSeekTo(true)
//     }
//     // goBackSeconds = () => {
//     //     // const currentTime = this.state.currentTime
//     //     // this.setState({currentTime: currentTime-15})
//     //     // const currentTime = this.state.playedSeconds
//     //     this.setState({
//     //         playedSeconds: parseFloat(this.state.playedSeconds - 15.0),
//     //         seekTo: true
//     //     })
//     // }

//     useEffect(() => {
//         // console.log({playing})
//         if (seekTo) {
//             // setPlaying(!playing)
//             console.log({ playedSeconds })
//             setSeekTo(false)
//             setPlaying(false)
//         }
//     })

//     return (
//         <div className='player-wrapper'>
//             <ReactPlayer
//                 className='react-player'
//                 url='/Users/lingyun/EdinburghPGT/OBS/sample.mp4'
//                 width='640px'
//                 height='480px'
//                 playing={playing}
//                 controls={controls}
//                 // duration = {duration}

//                 onProgress={handleProgress}
//             // onDuration={this.handleDuration}
//             />
//             <Row>
//                 <Button onClick={handlePlayPause}>
//                     {playing ? "play" : "pause"}
//                 </Button>
//                 <Button >Show preview</Button>
//                 <Button onClick={goBackSeconds}>Back 15 seconds</Button>
//                 <Button >Next 15 seconds</Button>
//                 <Progress>

//                 </Progress>
//             </Row>
//         </div>
//     )



// }

class VideoPlayer extends React.Component{

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
    }

    handlePlayPause = () => {
        this.setState({playing: !this.state.playing})
        // console.log(this.ref)
    }

    handleProgress = state => {
        // console.log('onProgress:', state)
        this.setState(state)

        // console.log(this.state.playedSeconds)
    }

    handleDuration = duration => {
        // console.log('onDuration:', duration)
        this.setState({duration})
    }


    ref = player => {
        this.player = player
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
        console.log("Component Did Mount!")
    }

    componentDidUpdate() {
        if (this.state.seekTo){
            console.log('Component Did Update!')
            this.setState({
                seekTo: false,
            })
            this.player.seekTo(this.state.playedSeconds)
            console.log(this.player)
        }
    }

    componentWillUnmount() {
        console.log('Component Will Unmount!')
    }



    render(){
        return (
            <div className ='player-wrapper'>
                <ReactPlayer
                    ref = {this.ref}
                    className='react-player'
                    // url='/Users/lingyun/EdinburghPGT/OBS/sample.mp4'
                    url={this.props.filePath}
                    width='640px'
                    height='480px'
                    playing= {this.state.playing}
                    controls={this.state.controls}
                    duration = {this.state.duration}

                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                />
                <Row>
                    <Button 
                        onClick={this.handlePlayPause}
                        disabled={this.state.display_button}
                        >
                        {this.state.playing?"play":"pause"}
                    </Button>
                    <Button onClick={() => this.player.getCurrentTime()}>Show preview</Button>
                    <Button onClick={this.goBackSeconds}>Back 15 seconds</Button>
                    <Button onClick={this.goNextSeconds}>Next 15 seconds</Button>
                    {/* <Progress>

                    </Progress> */}
                </Row>
            </div>
        )
    }

}

export default VideoPlayer;
