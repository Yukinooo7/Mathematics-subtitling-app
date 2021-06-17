const { ipcRenderer, contextBridge } = require('electron');

// window.sendNotification = (message) => {
    // ipcRenderer.send('notify', message);
// }

contextBridge.exposeInMainWorld('electron', {
    notificationApi: {
      sendNotification(message) {
        ipcRenderer.send('notify', message);
      }
    },
    batteryApi: {
  
    },
    fileApi: {
  
    }
})