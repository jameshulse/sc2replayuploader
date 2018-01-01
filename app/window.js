const { BrowserWindow } = require('electron');
const path = require('path');

let window;

function create() {
    window = new BrowserWindow({
        width: 250,
        height: 220,
        show: false,
        acceptFirstMouse: true,
        frame: false,
        resizable: false
    });

    window.loadURL(`file://${path.join(__dirname, '../index.html')}`);

    return window;
}

function show() {
    window.show();
}

function hide() {
    window.hide();
}

function close() {
    window.close();
}

module.exports = {
    create,
    show,
    hide,
    close
};
