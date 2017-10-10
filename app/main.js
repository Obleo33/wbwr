const { app, BrowserWindow, Tray } = require('electron');
const electron = require('electron')
const Menubar = require('menubar');
const windows = new Set()
const menubar = Menubar({ width: 400, height: 500, icon: './images/black-owl.png' })


let displaySize

menubar.on('ready', () => {
  console.log('wbwr ready');
  displaySize = electron.screen.getAllDisplays()
});

const createWindow = exports.createWindow = (text) => {
  let newWindow = new BrowserWindow({
    x:((displaySize[0].bounds.width/2) - 225),
    y:0,
    minWidth: 450,
    minHeight: 200,
    width: 450,
    height: 200,
    titleBarStyle: 'hidden',
    icon: './images/black-owl.png'
  });

  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/reader.html`);

  newWindow.setAlwaysOnTop(true, 'normal', 1);
  newWindow.readerText = text;

  newWindow.on('closed', () => {
    windows.delete(newWindow);
    newWindow = null;
  });
};

menubar.on('after-create-window', () => {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
  menubar.window.on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      menubar.window.webContents.send('resized', { bounds: menubar.window.getBounds() });
    }, 150);
  });
});
