import React, { Component } from 'react';
import { Layout, Button } from 'antd';


// import myIcon from '../images/logo.png';
import HttpUtil from '../Utils/HttpUtil';
import ApiUtil from '../Utils/ApiUtil';


// import './all_in_one.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ApiUtil.URL_mainpage,
    }
    this.handleClickBtn = this.handleClickBtn.bind(this);

  }

  handleChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }

  handleClickBtn(event) {
    console.log(this.state.url)
    var path = {
      pathname: this.state.url,
    }
    this.props.history.push(path);
  }

  render() {
    return (
      <div>
        <title>Main</title>
        <link rel="stylesheet" />
        <header className="main_header" />
        <section className="review">
          <div id="search" style={{
            // backgroundColor: 'black',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop: "200px"
          }}>
            <input style={{
              width: "400px",
              height: "50px",
              borderRadius: "10px",
              color: "black"
            }} type="text" className="search_content" placeholder="Open local video file" onChange={this.handleChange.bind(this)} value={this.state.inputValue} />
            <Button size="large" style={{ margin: "20px", textAlign: "center", }} type="primary"
              onClick={this.handleClickBtn}>Open</Button>
          </div>
        </section>
        <footer>
        </footer>
      </div>
    );
  }
}

export default SearchBar;