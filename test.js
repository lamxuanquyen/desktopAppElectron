const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const ExcelJS = require('exceljs');


ipcMain.handle('copy-file', async (event, sourcePath, destPath, fileLists, fileType) => {
    const results = [];
  
    //console.log("cac tham so la : " + sourcePath, destPath, fileLists, fileType)
  
    const files = await fs.readdir(sourcePath);

    for (const file of fileLists) {
      const filesToCopy = files.filter(file => path.parse(file).name === file && (fileType === '' || path.extname(file) === fileType));
  
      if (filesToCopy.length === 0) {
        results.push({file: file, status: 'File not found'});
        continue;
      } 

      await Promise.all(filesToCopy.map(async file => {
        // Kiểm tra xem tệp không tồn tại trong thư mục đích hay chưa   
        if (!fs.existsSync(path.join(destPath, file))) {
          await fs.copy(path.join(sourcePath, file), path.join(destPath, file));
          results.push({file: file, status: 'File copied successfully'});
        }else {
          results.push({file: file, status: 'File already exists in target folder'});
        }
      }));
      
    }

    // Tạo một workbook mới
    const workbook = new ExcelJS.Workbook();
  
    // Thêm một worksheet mới vào workbook
    const worksheet = workbook.addWorksheet('Results');
  
    // Định nghĩa các cột cho worksheet
    worksheet.columns = [
      {header: 'File Name', key: 'file', width: 50},
      {header: 'Result', key: 'status', width: 50}
    ];
  
    // Thêm các hàng vào worksheet
    results.forEach(result => {
      worksheet.addRow(result);
    });
  
    // Ghi workbook vào file
    await workbook.xlsx.writeFile('output.xlsx');
  
    // console.log('Results written to output.xlsx');
  
    return results;
});
