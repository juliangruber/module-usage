
# module-usage

See how a module is used in npm.

## Example

```js
var usage = require('module-usage');
var name = process.argv[2] || 'intersect';

usage(name).on('data', function(u) {
  console.log('%s (%s)', u.dependant, u.file);
  console.log();
  console.log(indent(u.code));
  console.log();
});

function indent(txt) {
  return txt.replace(/^/gm, '    ');
}
```

Some usages of [intersect](http://npmjs.org/intersect):

```bash
$ node example.js intersect
bower-json (package/lib/util/isComponent.js)

    var intersect = require('intersect');

bower-json (package/lib/util/isComponent.js)

    common = intersect(keys, [
        'repo',
        'development',
        'local',
        'remotes',
        'paths',
        'demo'
    ]);

roole-prefixer (package/lib/LinearGradientPrefixer.js)

    var intersect = require('intersect');

roole-prefixer (package/lib/LinearGradientPrefixer.js)

    var prefixes = intersect(this.prefixes, [
        'webkit',
        'moz',
        'o'
    ]);

...
```

Some usages of [mkdirp](http://npmjs.org/mkdirp):

```bash
$ node example.js mkdirp
ae86 (package/lib/engine.js)

    var mkdirp = require('mkdirp');

ae86 (package/lib/engine.js)

    mkdirp(p.join(dir, page).replace(/(\/[^\/]+$|\\[^\\]+$)/, ''), '0755', function (err) {
        'callback...';
    });
    
amerigo (package/vespucci.js)

    var mkdirpSync = require('mkdirp').sync;

amerigo (package/vespucci.js)

    mkdirpSync(folderpath);

amerigo (package/vespucci.js)

    mkdirpSync(padpath);

```

## API

### usage(name[, opts])

Create a readable stream that emits usage objects with keys `dependant`, `file` and `code`. Pass `opts.registry` to overwrite the default npm registry location.

## Installation

```bash
$ npm install module-usage
```

## License

  MIT
