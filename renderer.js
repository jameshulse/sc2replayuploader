import { ipcMain } from 'electron';

const { remote, ipcRenderer } = require('electron');

let hashInput = document.querySelector('#hashKey');

hashInput.textContent = remote.getGlobal('hashKey');

document.querySelector('#cancel').addEventListener('click', () => {
    remote.getCurrentWindow().hide();
});

document.querySelector('#save').addEventListener('click', async () => {
    await ipcRenderer.send('set-hash', hashInput.textContent);

    remote.getCurrentWindow().hide();
});
