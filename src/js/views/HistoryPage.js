import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';

const Store = require("electron-store")

const store = new Store()
let historyData = []

export default function HistoryPage() {
    // const [hasHistory, setHasHistory] = useState(false)

    const dispatch = useDispatch();

    if (store.has("OpenedFiles")) {
        // setHistoryData(store.get("OpenedFiles"))
        historyData = store.get("OpenedFiles")

        // setHasHistory(true)
    } else {
        historyData = [{ name: "", date: "", path: "" }]
    }
    // ipcRenderer.send("getStore")

    // console.log(historyData[0].path)
    // ipcRenderer.on('fileSelected', (event, message) => {
    //     // console.log(message)
    //     // // console.log(getCurrentWindow())
    //     // // opened= message
    //     setFilePath(message)
    //     // ipcRenderer.removeListener('fileSelected', () => { });
    //     ipcRenderer.removeAllListeners();

    // })
    const removeHistory = (item) => {
        console.log("Remove History")
        ipcRenderer.send("removeHistory", item)
    }

    const removeAllHistory = () => {
        console.log("s")
        ipcRenderer.send("removeAllHistory", "Clear")
    }

    // console.log(ipcRenderer.removeListener('', () => { }));
    // dispatch({type: 'CHANGE_SIDEBAR'})
    // useEffect(() => {
    //     console.log()
    // })

    return (
        // <h1>I am History Page</h1>
        <div>
            <Card title="Edit History" extra={<Button onClick={() => { removeAllHistory() }}>Clear</Button>}>
                {historyData.map((item, idx) => (
                    <Card key={idx} type="inner" title={item.name} extra={<Button onClick={() => { removeHistory(idx) }}>Delete</Button>}>
                        <Link to={{ pathname: '/', state: { filePath: item.path, videoName: item.name, editTime: item.date } }} onClick={() => {
                            dispatch({ type: "key1" })
                            dispatch({ type: "SHOW_VIDEO" })
                            ipcRenderer.send('CurrentFile', item)
                            ipcRenderer.send("openNewVideo", item.path.url)
                        }} >
                            Last edited: {item.date}
                        </Link>
                    </Card>
                ))}

    {/* { id: "108", timestamp_1: "00:10:09,070", timestamp_2: "00:10:12,390", content: "As well as to be shown." } */}

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