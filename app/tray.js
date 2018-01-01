const path = require('path');
const { Menu, Tray } = require('electron');
const window = require('./window');

let tray;

function create () {
    tray = new Tray(path.join(__dirname, '../assets/sc2small.png'));

    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Settings', click: () => window.show() },
        {
            label: 'Quit', click: () => {
                window.close();
            }
        }
    ]));

    return tray;
}

module.exports = { create };
