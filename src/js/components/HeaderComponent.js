import React from 'react'


import { Layout, Menu } from 'antd';
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

import configureStore from '../store';
import { connect } from 'react-redux';

const { Header, Sider, Content, Footer } = Layout;

// const store = configureStore();

// const data = useSelector(state => state.collapse)
// const counterSubscriber = () => {
//     const latestState = store.getState();
//     console.log(latestState)
// };

// store.subscribe(counterSubscriber);

class HeaderComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    // state = {
    //     collapsed: false,
    // };

    // componentDidMount() {
    //     this.updateWindowDimensions();
    //     window.addEventListener('resize', this.updateWindowDimensions);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.updateWindowDimensions)
    // }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        if (this.props.collapse){
            console.log("c")
            this.props.hide_sidebar()
        }
        else{
            console.log("d")
            this.props.show_sidebar()
        }
        // console.log(this.props.state)
        console.log(this.props.collapse)
        // console.log(store.getState())
        // console.log(this.props.store)
    };

    render(){
        return(
            <Header className="site-layout-background" style={{ padding: 0 }}>
                {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
                })}
            </Header>
        )
    }

}

const mapStateToProps = state => {
    return{
        collapse : state.collapse
    }
}

const mapDispatchToProps = state => {

    return {
        show_sidebar: () => ({type: "SHOW_SIDEBAR"}),
        hide_sidebar: () => ({type: "HIDE_SIDEBAR"})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);