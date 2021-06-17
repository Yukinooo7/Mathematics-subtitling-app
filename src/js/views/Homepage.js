import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useDispatch } from 'react-redux'
import 'antd/dist/antd.css';
import '../styles/Homepage.css'
import { Layout, Menu } from 'antd';


import SearchBar from './SearchBar';
import EditPage from './EditPage';
import HistoryPage from './HistoryPage';
import SettingPage from './SettingPage';
import { HashRouter, Link, Route } from 'react-router-dom';


import SideBarList from '../components/SideBarC';
import HeaderComponent from '../components/HeaderC';
// import configureStore from '../store';

const { Header, Sider, Content, Footer } = Layout;
// const store = configureStore();
// console.log(store.getState())
// const dispatch = useDispatch();

// useEffect(() => {
//     dispatch()
// }, [])

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            width: 0,
            height: 0
        };
        // console.log(this.state.collapsed)
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };


    render() {
        return (
            // <Provider store={store}>
                <HashRouter>
                    <Layout>
                        <SideBarList />
                        <Layout className="site-layout">
                            <HeaderComponent />
                            <Content
                                className="site-layout-background"
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    minHeight: 280,
                                }}
                            >
                                <div>
                                    <Route exact path="/" component={SearchBar} />
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
        );
    }
}
export default HomePage;