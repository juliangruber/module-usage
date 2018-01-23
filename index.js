var getRawBody = require('raw-body')
var Transform = require('stream').Transform
var dependants = require('dependants-stream')
var files = require('npm-files')
var moduleCalls = require('module-calls')
var debug = require('debug')('module-usage')

module.exports = usage

/**
 * Get usage of module `name`.
 *
 * @param {String} name
 * @param {Object=} opts
 * @param {Function} fn
 */

function usage (name, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }

  opts = opts || {}
  var registry = opts.registry || 'http://registry.npmjs.org'

  var out = Transform({ objectMode: true })
  var filesStream

  out._transform = function (dependant, enc, done) {
    filesStream = files(dependant, { registry: registry })
    filesStream.on('file', function (file) {
      if (!/\.js$/.test(file.props.path)) return
      getRawBody(file, function (err, buf) {
        if (err) return done(err)

        debug('analyzing %s (%s)', dependant, file.props.path)

        try {
          var calls = moduleCalls(name, buf.toString())
        } catch (err) {
          debug('syntax error in %s (%s)', dependant, file.props.path)
          return
        }

        calls.forEach(function (call) {
          call.dependant = dependant
          call.file = file.props.path
          out.push(call)
        })
      })
    })
    filesStream.on('error', done)
    filesStream.on('end', done)
  }

  out.destroy = function () {
    depStream.destroy()
    if (filesStream) filesStream.destroy()
    process.nextTick(function () {
      out.emit('close')
    })
  }

  var depStream = dependants(name, { registry: registry })
  depStream.on('error', out.emit.bind(out, 'error'))
  depStream.pipe(out)

  return out
}
