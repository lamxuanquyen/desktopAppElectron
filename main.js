const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('copy-file', async (event, sourcePath, destPath, fileName, fileType) => {
  try {
    const files = await fs.readdir(sourcePath);
    
    //-----------------------------------------------
    // const filesToCopy = files.filter(file => file.includes(fileName));
    const filesToCopy = files.filter(file => path.parse(file).name === fileName && (fileType === '' || path.extname(file) === fileType));
    // const filesToCopy = files.filter(file => file.includes(fileName) && (fileType === '' || path.extname(file) === fileType));

    if (filesToCopy.length === 0) {
      return `No ${fileType || ''} files found with the given name`;
    }

    // await Promise.all(filesToCopy.map(file => fs.copy(path.join(sourcePath, file), path.join(destPath, file))));
    await Promise.all(filesToCopy.map(async file => {
      // Kiểm tra xem tệp đã tồn tại trong thư mục đích hay chưa
      if (!fs.existsSync(path.join(destPath, file))) {
        await fs.copy(path.join(sourcePath, file), path.join(destPath, file));
      }
    }));
    
    //--------------------------------

    // const filesToCopy = files.filter(file => file.includes(fileName));

    // if (filesToCopy.length === 0) {
    //   return 'No files found with the given name';
    // }

    // // Lấy thông tin về thời gian chỉnh sửa của mỗi file
    // const fileStats = await Promise.all(filesToCopy.map(file => fs.stat(path.join(sourcePath, file))));

    // // Tìm file được chỉnh sửa gần nhất
    // const latestFile = filesToCopy[fileStats.reduce((latest, stat, index) => stat.mtimeMs > fileStats[latest].mtimeMs ? index : latest, 0)];

    // await fs.copy(path.join(sourcePath, latestFile), path.join(destPath, latestFile));

    //-------------------------------------
    return `${fileType || ''} File copied successfully`;
  } catch (err) {
    console.error(err);
    return `Error copying ${fileType || ''} file`;
  }
});

ipcMain.handle('open-dialog', async (event, dialogType) => {
  const result = await dialog.showOpenDialog({ properties: [dialogType] });
  return result.filePaths[0];
});

app.on("window-all-closed", () => {
    app.quit();
});