
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const url = require('url');

let authServerProcess;
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
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
  });

  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // IPC handlers for window controls
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    app.quit();
  });

  // Intercept authentication redirects
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = url.parse(navigationUrl, true);
    if (parsedUrl.query.token) {
      event.preventDefault();
      mainWindow.webContents.send('auth-token', parsedUrl.query.token);
      mainWindow.loadFile('index.html'); // Load your main application page
    }
  });

  // Handle new windows opened by target="_blank" (e.g., OAuth popup)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost:57896/auth/google')) { // Assuming this is your auth server URL
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
};

app.whenReady().then(() => {
  // Start the authentication server
  authServerProcess = fork(path.join(__dirname, 'authServer.js'));
  authServerProcess.on('message', (message) => {
    console.log('Auth Server Message:', message);
  });
  authServerProcess.on('error', (err) => {
    console.error('Auth Server Error:', err);
  });
  authServerProcess.on('exit', (code) => {
    console.log(`Auth Server Exited with code ${code}`);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (authServerProcess) {
    authServerProcess.kill('SIGTERM'); // Terminate the auth server process
  }
});
