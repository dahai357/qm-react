// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var EventBus = require('./src/app/service/EventBus');
const { ipcRenderer ,shell } = require('electron')

EventBus.on('WINDOW_CLOSE', function () { 
    ipcRenderer.send('WINDOW_CLOSE')
})

EventBus.on('WINDOW_MIN', function () { 
    ipcRenderer.send('WINDOW_MIN')
})

EventBus.on('WINDOW_FULLSCREEN', function () { 
    ipcRenderer.send('WINDOW_FULLSCREEN')
})

EventBus.on('OPEN_URL', function (URL) { 
    shell.openExternal(URL)
})

EventBus.on('USER_LOGIN_SYS', function (key) { 
    ipcRenderer.send('USER_LOGIN',key)
})

EventBus.on('USER_LOGOUT_SYS', function () { 
    ipcRenderer.send('USER_LOGOUT')
})

ipcRenderer.on('SYS_SHOW_SETTING',function(){
    EventBus.emit('SYS_SHOW_SETTING')
})