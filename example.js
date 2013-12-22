var usage = require('./');

usage('intersect').on('data', console.log).on('end', console.log.bind(console, 'end'));