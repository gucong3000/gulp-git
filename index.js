'use strict';
const Git = require('./lib/git');
let git;
module.exports = new Proxy(
  (...options) => new Git(...options),
  {
    get: (target, prop) => (
      Git.prototype[prop] || (git || (git = Git()))[prop] || target[prop]
    )
  }
);
