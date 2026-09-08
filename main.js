const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Avoid black video frames from GPU decode/compositing on some Windows setups.
app.disableHardwareAcceleration();

const VIDEO_WIDTH = 832;
const VIDEO_HEIGHT = 1108;

function createWindow() {
  Menu.setApplicationMenu(null);

  const win = new BrowserWindow({
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    useContentSize: true,
    resizable: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
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
