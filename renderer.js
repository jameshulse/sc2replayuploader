const { ipcMain, shell } = require('electron');
const { remote, ipcRenderer } = require('electron');

document.querySelectorAll('a[href^="http"]')
        .forEach(a => a.addEventListener('click', () => {
            event.preventDefault();
            shell.openExternal(a.href);
        }));

let hashEl = document.querySelector('#hashKey');
let autoLaunchEl = document.querySelector('#autolaunch');

hashEl.value = remote.getGlobal('hashKey');

document.querySelector('#cancel').addEventListener('click', () => {
    remote.getCurrentWindow().hide();
});

document.querySelector('#save').addEventListener('click', async () => {
    await ipcRenderer.send('set-hash', hashEl.value);
    await ipcRenderer.send('toggle-startup', autoLaunchEl.checked);

    remote.getCurrentWindow().hide();
});
