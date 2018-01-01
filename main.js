const { app, ipcMain } = require('electron');

const username = require('username');

const tray = require('./app/tray');
const appDataPath = require('./app/appData');
const hashkey = require('./app/hashkey');
const watch = require('./app/watch');
const window = require('./app/window');
const startup = require('./app/startup');

require('./app/menu');

global.hashKey = hashkey.load();

app.dock.hide();

ipcMain.on('set-hash', (event, arg) => {
    global.hashKey = arg;

    hashkey.save(arg);
});

ipcMain.on('toggle-startup', (event, arg) => {
    if (arg) {
        startup.enable();
    } else {
        startup.disable();
    }
});

app.on('ready', async () => {
    let user = await username();

    tray.create();
    window.create();

    watch.start(user);

    if (global.hashKey) {
        ipcMain.emit('show-hash', global.hashKey);
    } else {
        window.show();
    }
});

app.on('window-all-closed', app.quit);

app.on('before-quit', () => {
    watch.stop();
});
