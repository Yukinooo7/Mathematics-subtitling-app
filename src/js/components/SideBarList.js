import React from 'react'
import { Component } from 'react';
import { Layout, Menu } from 'antd';
import { HashRouter, Link, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import configureStore from '../store';


import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    LeftCircleOutlined,
    EditOutlined,
    HomeOutlined,
    HistoryOutlined,
    SettingOutlined,
    SmileOutlined,
  } from '@ant-design/icons';


const { Header, Sider, Content, Footer } = Layout;

// const store = configureStore();
// console.log(store.getState())


class SideBarList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            width: 0,
            height: 0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // state = {
    //     collapsed: false,
    // };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
    }
    
    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }


    toggle = () => {
        this.setState({
        collapsed: !this.state.collapsed,
        });
    };

    render (){

        return (
            <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{height: this.state.height }}>
            <div className="logo" >
                <SmileOutlined />
            </div>
            {/* <Data /> */}
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {/* <Menu.Item key="1" icon={<LeftCircleOutlined />}>
                    <Link to='/MainPage'>
                        Previous Page
                    </Link>
                </Menu.Item> */}
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <Link to="/">
                        Home Page
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<EditOutlined />}>
                    <Link to="/EditPage">
                        Edit Page
                    </Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<HistoryOutlined />}>
                    <Link to="/HistoryPage">
                        History
                    </Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<SettingOutlined />}>
                    <Link to="/SettingPage">
                        Setting
                    </Link>
                </Menu.Item>
            </Menu>
            </Sider>
        )
    }
}

export default SideBarList;