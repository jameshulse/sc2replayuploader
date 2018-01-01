const { app } = require('electron');
const path = require('path');
const mkdirp = require('mkdirp');

let appDataPath = path.join(app.getAppPath('appData'), 'sc2replaystats');

mkdirp.sync(appDataPath);

module.exports = appDataPath;
