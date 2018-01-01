const { ipcMain, shell } = require('electron');
const { remote, ipcRenderer } = require('electron');

document.querySelectorAll('a[href^="http"]')
        .forEach(a => a.addEventListener('click', () => {
            event.preventDefault();
            shell.openExternal(a.href);
        }));

let hashInput = document.querySelector('#hashKey');

hashInput.value = remote.getGlobal('hashKey');

document.querySelector('#cancel').addEventListener('click', () => {
    remote.getCurrentWindow().hide();
});

document.querySelector('#save').addEventListener('click', async () => {
    await ipcRenderer.send('set-hash', hashInput.value);

    remote.getCurrentWindow().hide();
});
