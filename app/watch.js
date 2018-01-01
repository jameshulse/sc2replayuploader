const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const randomstring = require('randomstring');
const request = require('request');
const appDataPath = require('./appData');

let manifestPath = path.join(appDataPath, 'manifest.json');

let manifest = [];

if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath));
}

let watcher;

function start(user) {
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
                'upload_method': 'jameshulse_mac_uploader',
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
        });
    });

    return watcher;
}

function stop() {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));
}

module.exports = {
    start,
    stop
};
