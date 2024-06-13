const { ipcRenderer } = require('electron');

let sourcePath = '';
let destPath = '';

document.getElementById('sourceBtn').addEventListener('click', () => {
    ipcRenderer.invoke('open-dialog', 'openDirectory')
    .then(data => {
        // if (!data.canceled) {
        //     document.querySelector("#sourceInput").value = data.filePaths[0];
        // } 
        sourcePath = data
        document.getElementById('sourceInput').value = data;
    });
});

document.getElementById('destBtn').addEventListener('click', () => {
    ipcRenderer.invoke('open-dialog', 'openDirectory')
    .then(data => {
        // if (!data.canceled) {
        //     document.querySelector("#destInput").value = data.filePaths[0];
        // };
        destPath = data;
        document.getElementById('destInput').value = data;
    });
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const fileName = document.getElementById('fileName').value;
    const fileType = document.getElementById('fileType').value;

    ipcRenderer.invoke('copy-file', sourcePath, destPath, fileName, fileType)
    .then(message => {
        // alert(message);
        document.getElementById('result').textContent = message;
        if (message === 'File copied successfully') {
            // Nếu việc sao chép thành công, xóa nội dung của các trường nhập liệu
            document.getElementById('fileName').value = '';
            // document.getElementById('sourceInput').value = '';
            // document.getElementById('destInput').value = '';
        }
    });
});