import { Card } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Store = require("electron-store")

const store = new Store()
let historyData = []


export default function HistoryPage() {

    const dispatch = useDispatch();

    if (store.has("OpenedFiles")) {
        // setHistoryData(store.get("OpenedFiles"))
        historyData = store.get("OpenedFiles")
    } else {
        historyData = [{ name: "", date: "", path: "" }]
    }

    console.log(historyData[0].path)

    // dispatch({type: 'CHANGE_SIDEBAR'})

    return (
        // <h1>I am History Page</h1>
        <div>
            <Card title="Edit History">
                {historyData.map((item, idx) => (
                    <Link  key={idx} to={{ pathname: '/', state: { filePath: item.path} }} onClick={() => {dispatch({type:"key1"})}}>
                        <Card type="inner" title={item.name}>
                            Last edited: {item.date}
                        </Card>
                    </Link>
                ))}
                {/* <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Inner Card title"
                    extra={<a href="#">More</a>}
                >
                    Inner Card content
                </Card> */}
            </Card>
        </div>
    )
}


// class HistoryPage extends React.Component {


//     render() {
//         return (
//             <h1>I am History Page</h1>
//         )
//     }

// }

// export default HistoryPage;