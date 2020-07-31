// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = require('electron')

const resURI = './resources/app.asar'
// const resURI = '.'
const logoURI = resURI + '/logo.ico'


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let dlg;

let tray;

function createWindow() {
    dlg = new BrowserWindow({
        width: 400,
        height: 500,
        frame: false
    })
    dlg.loadFile('public/about.html')
    dlg.setIcon(logoURI)
    dlg.hide()

    
    // dlg.webContents.openDevTools()

    // Create the browser window.
    mainWindow = new BrowserWindow({ 
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: false
    })

    mainWindow.setIcon(logoURI)

    // and load the index.html of the app.
    mainWindow.loadFile('dist/index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        if (tray) {
            tray.destroy()
        }
    })

    mainWindow.on('show', () => {
        tray.setHighlightMode('always')
        mainWindow.focus();
        mainWindow.focusOnWebView();
    })
    mainWindow.on('hide', () => {
        tray.setHighlightMode('never')
    })

    function about() {
        dlg.show()
    }

    function quit() {
        app.quit()
    }

    function set() {
        mainWindow.show();
        mainWindow.webContents.send('SYS_SHOW_SETTING')
    }

    tray = new Tray(logoURI)
    tray.setToolTip('我的身边店商户端')

    const contextMenu = Menu.buildFromTemplate([
        { label: '关于我的身边店', click: function () { about() } },
        { label: '退出我的身边店', click: function () { quit() } }
    ])
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })

    ipcMain.on('WINDOW_CLOSE', (event, arg) => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })

    ipcMain.on('WINDOW_MIN', (event, arg) => {       
        mainWindow.minimize()
    })

    ipcMain.on('ABOUT_CLOSE', (event, arg) => {
        dlg.hide()
    })

    ipcMain.on('WINDOW_FULLSCREEN', (event, arg) => {       
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    })

    ipcMain.on('USER_LOGIN', (event, arg) => {
        tray.setContextMenu(Menu.buildFromTemplate([
            { label: '设置', click: function () { set() } },
            { label: '关于我的身边店', click: function () { about() } },
            { label: '退出我的身边店', click: function () { quit() } }
        ]))
    })

    ipcMain.on('USER_LOGOUT', (event, arg) => {
        tray.setContextMenu(Menu.buildFromTemplate([
            { label: '关于我的身边店', click: function () { about() } },
            { label: '退出我的身边店', click: function () { quit() } }
        ]))
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

process.on('uncaughtException', function (err) {
    app.quit();
});