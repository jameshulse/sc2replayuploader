const { app, Menu, MenuItem, Tray, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const chokidar = require('chokidar');
const username = require('username');
const request = require('request');
const randomstring = require('randomstring');
const fs = require('fs');
const mkdirp = require('mkdirp');

let appDataPath = path.join(app.getAppPath('appData'), 'sc2replaystats');

mkdirp.sync(appDataPath);

let hashKeyPath = path.join(appDataPath, 'hashkey.txt');

if (fs.existsSync(hashKeyPath)) {

    global.hashKey = fs.readFileSync(hashKeyPath, 'utf-8');
} else {
    global.hashKey = '';
}

app.dock.hide();

let tray;
let window;
let watcher;
let manifest = [];

if (fs.existsSync('manifest.json')) {
    manifest = JSON.parse(fs.readFileSync('manifest.json'));
}

ipcMain.on('set-hash', (event, arg) => {
    global.hashKey = arg;

    fs.writeFileSync(hashKeyPath, arg, 'utf-8');
});

function createWindow() {
    window = new BrowserWindow({
        width: 250,
        height: 220,
        show: false,
        acceptFirstMouse: true,
        frame: false,
        resizable: false
    });

    window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

    if (global.hashKey) {
        ipcMain.emit('show-hash', global.hashKey);
    } else {
        window.show();
    }
}

function watchForReplays(user) {
    let replayPath = `/Users/${user}/Library/Application Support/Blizzard/Starcraft II/Accounts/**/Replays/Multiplayer/*.SC2Replay`;

    watcher = chokidar.watch(replayPath, {
        persistent: true
    });

    watcher.on('add', file => {
        if (manifest.indexOf(file) !== -1) {
            return;
        }

        request.post('https://sc2replaystats.com/upload_replay.php', {
            formData: {
                'token': randomstring.generate(32),
                'hashkey': global.hashKey,
                'timestamp': Math.round(+new Date() / 1000),
                'Filedata': {
                    value: fs.readFileSync(file),
                    options: {
                        filename: path.basename(file)
                    }
                }
            }
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(err);
            }

            manifest.push(file);

            tray.displayBalloon({
                title: 'Replay uploaded',
                content: `Uploaded ${file}`
            });
        });
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'sc2small.png'));

    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Settings', click: () => window.show() },
        {
            label: 'Quit', click: () => {
                window.close();
            }
        }
    ]));
}

app.on('ready', async () => {
    let user = await username();

    createTray();
    createWindow();
    watchForReplays(user);
});

app.on('window-all-closed', app.quit);

app.on('before-quit', () => {
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 4));
});
