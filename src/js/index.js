import React from 'react';
import ReactDom from 'react-dom';

import App from './App'

// import './index.scss'
// import 'bootstrap/dist/css/bootstrap.min.css';


var holder = document.getElementById('subtitleApp')

holder.ondrop = function(e) {
    // console.log(e)

    e.preventDefault();
    // var file = e.dataTransfer.files[0];
    // console.log('File you dragged here is', file.path);
}

holder.ondragover = function(e) {
    return false
}

holder.ondragleave = holder.ondragend = function(e) {
    return false
}




ReactDom.render(
    // <h1>11</h1>,
    <App />,
    document.getElementById('subtitleApp')
)