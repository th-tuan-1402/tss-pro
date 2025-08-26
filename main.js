
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200, // Adjusted width for the new UI
    height: 800, // Adjusted height for the new UI
    minWidth: 1000,
    minHeight: 700,
    frame: false, // Remove default window frame
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Allow Node.js integration in renderer process
      contextIsolation: false, // For simplicity in this example, but consider 'true' for security
    }
  })

  win.loadFile('index.html')
}


  // Open the DevTools.
  // win.webContents.openDevTools()

  // IPC handlers for window controls
  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    app.quit();
  });



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
