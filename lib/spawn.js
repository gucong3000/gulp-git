'use strict';
const toReadStream = require('spawn-to-readstream');
const spawn = require('child_process').spawn;
const getStream = require('get-stream');
const debug = require('debug')('gulp-git:spawn');

module.exports = function(args, options) {
  options = Object.assign(this._options, options);
  const ps = spawn(
    this._binary,
    this._args.concat(args).filter(Boolean),
    options,
  );
  debug(ps.spawnargs.join(' '));
  let input = options.input;
  if (input) {
    if (input.pipe) {
      input.pipe(ps.stdin);
      ps.stdin.on('error', () => {
  			// console.error
      });
    } else {
      (Array.isArray(input) ? input : [input]).forEach(input=>{
        ps.stdin.write(input);
        ps.stdin.end();
      });
    }
  }
  const stream = toReadStream(ps);
  let promise;
  function getPromise() {
    if (!promise) {
      promise = getStream.buffer(stream);
    }
    return promise;
  }
  return Object.assign(stream, {
    then: (...args) => getPromise().then(...args),
    catch: (...args) => getPromise().catch(...args),
  });
};
