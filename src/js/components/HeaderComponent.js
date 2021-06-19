import React, {useState} from 'react'


import { Layout} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useSelector, connect, useDispatch } from 'react-redux';




const { Header} = Layout;


export default function HeaderComponent() {
    const[collapse, setCollapse] = useState(false)

    const dispatch = useDispatch();
    const overallCollapse = useSelector(state => state.collapse)

    // console.log(collapse)

    const change_sidebar = () => {
        dispatch({type: 'CHANGE_SIDEBAR'})
    }
    
    // console.log(overallCollapse)
    return(
        <Header className="site-layout-background" style={{ padding: 0 }}
            onClick={() => {change_sidebar()}} >
            {React.createElement(overallCollapse ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            })}
        </Header>
    )


}