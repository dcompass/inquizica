var winston = require('winston');
var path = require('path');

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

var logger = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      name: 'dev',
      level: 'debug'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: path.join(__dirname, "../logs/main.log"),
      level: 'info', // Maximum log level
      timestamp: function () { return Date.now(); },
      json: false
    }),
    new (winston.transports.File)({
      name: 'debug-file',
      filename: path.join(__dirname, "../logs/debug.log"),
      level: 'debug'
    })
  ]
});

module.exports = logger;
