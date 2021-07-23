import React, { useEffect, useState } from 'react'
// import mathjax
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { ipcRenderer } from 'electron'
import { Button, Row } from 'antd'

const { dialog, autoUpdater, } = require('@electron/remote')

export default function SettingPage() {
    const [path, setPath] = useState("")

    const setPythonPath = () => {

        dialog.showOpenDialog(
            {
                properties: ['openFile'],
                filters: [
                    { name: "All files", extensions: ['*'] }
                ]
            }).then((result) => {
                let cancel = result.canceled
                if (!cancel) {
                    // srtFile = ProcessFunctions.generateSrtFile(this.state.subtitle)
                    // fs.writeFileSync(result.filePath, srtFile)
                    // console.log(result.filePaths)

                    ipcRenderer.send('setPythonPath', result.filePaths[0])
                }
                // console.log(result)
            }).catch((req) => {
                console.log(req)
            })

    }

    const resetPythonPath = () => {
        ipcRenderer.send('setPythonPath', "")
    }
    const getPythonPath = (event, message) => {
        // console.log(message)
        setPath(message)
    }

    useEffect(() => {
        let isMount = true

        if (isMount) {
            ipcRenderer.send('sendPythonPath')
            ipcRenderer.on('pythonPath', getPythonPath)
        }

        return () => {
            isMount = false
            ipcRenderer.removeListener('pythonPath', getPythonPath)
        }

    })

    return (
        <div>
            <h2 className="setting-info"
                style={{
                    marginLeft: '4px'
                }}>Python Path:
            </h2>
            <Row>
                <span style={{
                    backgroundColor: '#E5E5E5',
                    height: '32px',
                    minWidth: '200px',
                    width: '50%',
                    // textAlign: 'left',
                    padding: '4px',
                    marginLeft: '4px'
                }}>
                    {path}
                </span>
                <Button onClick={setPythonPath}
                    style={{
                        marginLeft: '4px'
                    }}>Set Python Path</Button>
                <Button onClick={resetPythonPath}
                    style={{
                        marginLeft: '4px'
                    }}>
                    Reset Python Path
                </Button>
            </Row>
            <h1 className="setting-info">
                Please choose the Python version which has jinja2 library which is used to generate Html file.
            </h1>
            <h1 className="setting-info">
                The example Python Path: /Users/lingyun/miniconda3/envs/OBS/bin/python.
            </h1>
            {/* <h1>{path}</h1> */}
        </div>
    )
}
