import React from 'react'


import VideoPlayer from '../components/VideoPlayer';



class EditPage extends React.Component {


    render() {
        console.log(this.props.location.state.filePath.url)
        return (
            // <h1>I am Edit Page</h1>
            <div>
                    <VideoPlayer filePath={this.props.location.state.filePath.url}/>
            </div>
        )
    }

}

export default EditPage;