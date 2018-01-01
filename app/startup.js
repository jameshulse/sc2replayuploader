const AutoLaunch = require('auto-launch');

let launcher = new AutoLaunch({
    name: 'SC2 Mac Stats',
    path: '/Applications/sc2macstats.app'
});

module.exports = {
    enable: () => launcher.enable(),
    disable: () => launcher.disable()
}
