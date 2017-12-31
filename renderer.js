const { ipcMain } = require('electron');
const { remote, ipcRenderer } = require('electron');

let hashInput = document.querySelector('#hashKey');

hashInput.value = remote.getGlobal('hashKey');

document.querySelector('#cancel').addEventListener('click', () => {
    remote.getCurrentWindow().hide();
});

document.querySelector('#save').addEventListener('click', async () => {
    await ipcRenderer.send('set-hash', hashInput.value);

    remote.getCurrentWindow().hide();
});
