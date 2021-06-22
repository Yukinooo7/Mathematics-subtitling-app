import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import {
    EditOutlined,
    HomeOutlined,
    HistoryOutlined,
    SettingOutlined,
    SmileOutlined,
} from '@ant-design/icons';


const { Sider } = Layout;

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}


export default function SideBarComponent(url) {



    const dispatch = useDispatch();
    const overallCollapse = useSelector(state => state.collapse)

    const { height, width } = useWindowDimensions();
    
    const [filePath, setFilePath] = useState(url)
    // const [url] = useState('/Users/lingyun/EdinburghPGT/OBS/sample.mp4')
    // const[collapse, setCollapse] = useState(overallCollapse)
    // console.log(url)
    // console.log("AAAA")
    // console.log(overallCollapse)
    // console.log(collapse)
    useEffect(() => {
        console.log(url)
        setFilePath(url)
        console.log(filePath)
    })


    return (
        <Sider trigger={null} collapsible collapsed={overallCollapse} style={{ height: height }}>
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
                    <Link to={{pathname:'/',state:{filePath: filePath}}}>
                        Home Page
                    </Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<EditOutlined />}>
                    <Link to={{pathname:'/EditPage',state:{filePath: filePath}}}>
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