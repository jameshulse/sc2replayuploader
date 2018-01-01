const path = require('path');
const fs = require('fs');
const appDataPath = require('./appData');

let hashKeyPath = path.join(appDataPath, 'hashkey.txt');

function save(key) {
    fs.writeFileSync(hashKeyPath, key, 'utf-8');
}

function load() {
    if (fs.existsSync(hashKeyPath)) {
        return fs.readFileSync(hashKeyPath, 'utf-8')
    } else {
        return '';
    }
}

module.exports = {
    save,
    load
};
