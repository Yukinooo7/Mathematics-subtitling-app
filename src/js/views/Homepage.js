import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import '../styles/Homepage.css'
import { Layout, Menu, Button } from 'antd';


import MainPage from './MainPage'
import EditPage from './EditPage';
import HistoryPage from './HistoryPage';
import SettingPage from './SettingPage';
import { HashRouter, Link, Route } from 'react-router-dom';


import SideBarList from '../components/SideBarComponent';
import HeaderComponent from '../components/HeaderComponent';
import VideoPlayer from '../components/VideoPlayer';


const { BrowserWindow, getCurrentWindow, dialog } = require('@electron/remote')
const { ipcRenderer } = require('electron')
// import configureStore from '../store';

const { Content, Footer } = Layout;

var opened = "";
// function sendMessage() {
// console.log(ipcRenderer.sendSync('message2', 'ping2')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//     console.log(arg) // prints "pong"
// })
// ipcRenderer.send('message1', 'ping1')

// ipcRenderer.on('message1', (event, arg) => {
//     console.log(arg)
//     // event.reply('me')
// })
// }


// console.log(openedVideo)
// useEffect(() => {
//     dispatch()
// }, [])


export default function HomePage() {
    const [filePath, setFilePath] = useState('')
    // const openedVideo = ""

    useEffect(() => {
        const processData = (event, message) => {
            setFilePath(message)
        }

        ipcRenderer.on('fileSelected', processData)

        console.log(filePath)

        return () => {

            ipcRenderer.removeListener('fileSelected', processData)
        }

    })

    return (
        // <Provider store={store}>
        <HashRouter>
            <Layout>
                <SideBarList url={filePath} />
                <Layout className="site-layout">
                    <HeaderComponent />
                    {/* <VideoPlayer /> */}
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        <div>
                            <Route exact path="/" component={MainPage} />
                            <Route path="/EditPage" component={EditPage} />
                            <Route path='/HistoryPage' component={HistoryPage} />
                            <Route path="/SettingPage" component={SettingPage} />
                        </div>
                    </Content>
                    {/* <SearchBar history={this.props.history} /> */}

                    <Footer style={{ textAlign: 'center' }}>
                        Mathematics Subtitling App @2021 Created By Lingyun Chen
                    </Footer>
                </Layout>

            </Layout>
        </HashRouter>
        // </Provider>
    )
}


ipcRenderer.send("ipcRendererReady", "true");