import React, { Component } from 'react';

import HomePage from "./views/Homepage"


import store from './store/index'
import { Provider } from 'react-redux'


class App extends Component {
  render() {
    return (
      // <Router />
      <Provider store ={store()}>
        <HomePage />
      </Provider>
      // <h1>I am app.js</h1>
    );
  }
}

export default App;