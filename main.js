// Main Process
// ipcMain用于在渲染进程和主进程之间发送和处理消息
const { app, BrowserWindow, ipcMain, Notification, Menu, Tray } = require('electron');
require('@electron/remote/main').initialize()
const path = require('path');
const isDev = !app.isPackaged;


const dockIcon = path.join(__dirname, 'assets', 'images', 'react_app_logo.png');
const trayIcon = path.join(__dirname, 'assets', 'images', 'react_icon.png');


let tray = null;
let newWin;
let mainWindow;
// let win

let isRendererReady = false;

function onVideoFileSelected(filePath) {

    if (isRendererReady) {
        console.log("fileSelected=", playParams)

        mainWindow.webContents.send('fileSelected', playParams);
    } else {
        ipcMain.once("ipcRendererReady", (event, args) => {
            console.log("fileSelected", playParams)
            mainWindow.webContents.send('fileSelected', playParams);
            isRendererReady = true;
        })
    }
}

function createSplashWindow(filepath) {
    win = new BrowserWindow({
        width: 400,
        height: 150,
        frame: false,
        transparent: true,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            // enableRemoteModule: true,
        }
    })
    // console.log(filepath)
    win.loadFile(filepath)
    return win;
}

function createVideoWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#6e707e',
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index_video.html')
    isDev && win.webContents.openDevTools();
    return win;

}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#6e707e',
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile('index.html')
    isDev && mainWindow.webContents.openDevTools();
    return mainWindow;
}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}

if (process.platform === 'darwin') {
    app.dock.setIcon(dockIcon);
}

app.whenReady()
    .then(() => {
        // const template = require('./utils/Menu').createTemplate(app);
        const menu = Menu.buildFromTemplate(app_menu);
        Menu.setApplicationMenu(menu);

        tray = new Tray(trayIcon);
        tray.setContextMenu(menu);

        const splash = createSplashWindow("./pages/splash.html");
        mainWindow = createWindow();

        mainWindow.once('ready-to-show', () => {
            // splash.destroy();
            // mainApp.show();
            setTimeout(() => {
                splash.destroy();
                mainWindow.show();
            }, 1000)
        })
    });

// ipcMain.on('notify', (_, message) => {
//     new Notification({ title: 'Notification', body: message }).show();
// })

// ipcMain.on('app-quit', () => {
//     app.quit();
// })
// console.log("I AM MAIN!")

// ipcMain.on('message1', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong1')
// })

// ipcMain.on('message2', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong2'
// })




app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})


// Chromium -> web eingine for rendering the UI, full Chrome-like web browser
// V8 -> engine that provides capabilities to execute, run, JS code in the browser
// Node JS(V8) -> we are able to run JS code + provides more features

// Webpack -> is a module builder, main purpose is to bundle JS files for usage in the browsert
// Babel -> js a JS compiler


let app_menu = [
    {
        label: process.platform === 'darwin' ? app.getName() : 'Menu',
        submenu: [{
            label: 'Exit',
            click: () => {
                app.quit();
            }
        }]
    }, {
        label: 'File',
        submenu: [{
            label: 'Open',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
                var electron_dialog = require('electron').dialog
                electron_dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters: [
                        { name: 'Videos', extensions: ['mp4'] }
                    ]
                }).then((result) => {
                    let cancel = result.canceled
                    let filePaths = result.filePaths
                    console.log(mainWindow)
                    if (!cancel && mainWindow && filePaths.length > 0) {
                        // console.log(result)
                        // const videoWindow = createVideoWindow();
                        // const loadingWindow = createSplashWindow("./pages/loading.html");
                
                        // videoWindow.once('ready-to-show', () => {
                        //     // splash.destroy();
                        //     // mainApp.show();
                        //     setTimeout(() => {
                        //         loadingWindow.destroy();
                        //         videoWindow.show();
                        //     }, 1000)
                        // })

                        // newWin = new BrowserWindow(
                        //     {
                        //         width: 100,
                        //         height: 100,
                        //         show: false,
                        //     }
                        // )
                        // newWin.loadFile('./pages/splash.html')
                        // newWin.webContents.on('did-finish-load', () => {
                            // newWin.webContents.send('message1',filePaths[0])
                            mainWindow.webContents.send('fileSelected', filePaths[0]);
                            console.log("I AM MAIN PROCESS")
                            console.log(filePaths[0])
                        // })

                        // videoWindow.show()
                        // newWin.on('close', () => {
                            // newWin = null
                        // })
                    }
                })
            }
        }]


    }, {
        label: 'Edit',
        submenu: [
            {
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                selector: "undo:"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                selector: "cut:"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                selector: "copy:"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                selector: "paste:"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }
        ]
    }, {
        label: 'View',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                    if (focusedWindow.id === 1) {
                        const { BrowserWindow } = require('electron');
                        BrowserWindow.getAllWindows().forEach(win => {
                            if (win.id > 1) {
                                win.close();
                            }
                        })
                    }
                    focusedWindow.reload()
                }
            }
        }, {
            label: 'Toggle Full Screen',
            accelerator: (() => {
                if (process.platform === 'darwin') {
                    return 'Ctrl+Command+F'
                } else {
                    return 'F11'
                }
            })(),
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                }
            }
        }, {
            label: 'Toggle Developer Tools',
            accelerator: (() => {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I'
                } else {
                    return 'Ctrl+Shift+I'
                }
            })(),
            click: (_, focusedWindow) => {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        }, {
            type: 'separator'
        }, {
            label: 'Mathematics subtitling App Demo',
            click: function (_, focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: 'Application Menu Demo',
                        buttons: ['Ok', 'Cancel'],
                        message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
                    }
                    const { dialog } = require('electron');
                    dialog.showMessageBox(focusedWindow, options)
                }
            }
        }]
    }, {
        label: 'Window',
        role: 'window',
        submenu: [{
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            type: 'separator'
        }, {
            label: 'Reopen Window',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: false,
            click: () => {
                app.emit('activate')
            }
        }]
    }, {
        label: 'Help',
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click: () => {
                // The shell module provides functions related to desktop integration.
                // An example of opening a URL in the user's default browser:
                const { shell } = require('electron');
                shell.openExternal('http://electron.atom.io')
            }
        }]
    }
]