import React,{useState, useEffect} from 'react'
import { Layout, Menu } from 'antd';
import { HashRouter, Link, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


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


export default function SideBarC() {
    

    const dispatch = useDispatch();
    const overallCollapse = useSelector(state => state.collapse)

  const { height, width } = useWindowDimensions();


    // const[collapse, setCollapse] = useState(overallCollapse)

    // console.log("AAAA")
    // console.log(overallCollapse)
    // console.log(collapse)
    

    return (
        <Sider trigger={null} collapsible collapsed={overallCollapse} style={{height: height}}>
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