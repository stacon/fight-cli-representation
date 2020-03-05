const clc = require('cli-color');

const colorize = () => {
    const c = clc;
    return {
        healthBar: {
            good: (text) => c.xterm(46)(text),
            moderate: (text) => c.xterm(208)(text),
            low: (text) => c.xterm(196)(text),
            critical: (text) => c.xterm(124)(text),
        },
        events: {
            current: (text) => c.whiteBright(text),
            previous: (text) => c.xterm(249)(text),
            oldest: (text) => c.xterm(244)(text),
        }
    }
}

module.exports = colorize;