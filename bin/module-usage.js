#!/usr/bin/env node

var usage = require('..');
var name = process.argv[2];

if (!name) return console.error('Usage: module-usage module')

console.log();

usage(name).on('data', function(u) {
  console.log('%s (%s)', u.dependant, u.file);
  console.log();
  console.log(indent(u.code));
  console.log();
});

function indent(txt) {
  return txt.replace(/^/gm, '    ');
}
