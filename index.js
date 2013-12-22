var streamTo = require('stream-to');
var Transform = require('stream').Transform;
var dependants = require('dependants-stream');
var files = require('npm-files');
var moduleCalls = require('module-calls');
var debug = require('debug')('module-usage');

module.exports = usage;

/**
 * Get usage of module `name`.
 *
 * @param {String} name
 * @param {Object=} opts
 * @param {Function} fn
 */

function usage(name, opts, fn) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }
  
  opts = opts || {};
  var registry = opts.registry || 'http://registry.npmjs.org';
  
  var out = Transform({ objectMode: true });
  
  out._transform = function(dependant, enc, done) {
    files(dependant, { registry: registry })
      .on('file', function(file) {
        if (!/\.js$/.test(file.props.path)) return;
        streamTo.buffer(file, function(err, buf) {
          if (err) return done(err);
          
          debug('analyzing %s (%s)', dependant, file.props.path);
          
          try {
            var calls = moduleCalls(name, buf.toString());
          } catch (err) {
            debug('syntax error in %s (%s)', dependant, file.props.path);
            return;
          }
            
          calls.forEach(function(call) {
            call.dependant = dependant;
            call.file = file.props.path;
            out.push(call);
          });
        });
      })
      .on('error', done)
      .on('end', done);
  };

  return dependants(name, { registry: registry })
    .on('error', out.emit.bind(out, 'error'))
    .pipe(out);
}
