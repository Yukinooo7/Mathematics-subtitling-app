import { Card } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Store = require("electron-store")

const store = new Store()
let historyData = []


export default function HistoryPage() {


    if (store.has("OpenedFiles")) {
        // setHistoryData(store.get("OpenedFiles"))
        historyData = store.get("OpenedFiles")
    } else {
        historyData = [{ name: "", date: "", path: "" }]
    }

    console.log(historyData[0].path)

    return (
        // <h1>I am History Page</h1>
        <div>
            <Card title="Edit History">
                {historyData.map((item, idx) => (
                    <Link  key={idx} to={{ pathname: '/', state: { filePath: item.path} }}>
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