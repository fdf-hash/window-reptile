const { app, BrowserWindow, ipcMain,ipcRenderer  } = require('electron');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './js/renderer.js')
    }
  });

  mainWindow.loadFile('./index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
  
ipcMain.on('download-image', (event, url, savePath) => {
  
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);
      $('img').each((index, element) => {
        const imgUrl = $(element).attr('src');
        if (imgUrl && imgUrl.indexOf('http') != -1) {
          const imgFilename = path.basename(imgUrl);
          const imgPath = path.join(savePath, imgFilename);
          request(imgUrl).pipe(fs.createWriteStream(imgPath));
        }
      });
      event.reply('downloaded-image', true);
    } else {
      event.reply('downloaded-image', false);
    }
  });
});
