'use strict';
const through = require('through2');
const Vinyl = require('vinyl');
const path = require('path');
const debug = require('debug')('gulp-git:diff');

var RE_DIFF_RESULT = /:(\w+)\s+(\w+)\s+(\w+)(?:\.{3})?\s+(\w+)(?:\.{3})?\s+(\w+)(\u0000|\t|\s+)(.+?)(?:\6|\n)(?:([^:]+?)\6)?/g;

function getReaslt(data) {
  var result = [];
  data = data && data.toString();
  if (!data) {
    return data;
  }
  debug(data);
  var match;
  RE_DIFF_RESULT.lastIndex = 0;
  while ((match = RE_DIFF_RESULT.exec(data))) {
    result.push({
      // mode for compare "src"
      srcMode: match[1],
      // mode for compare "dst"
      dstMode: match[2],
      // sha1 for compare "src"
      srcHash: match[3],
      // sha1 for compare "dst"
      dstHash: match[4],
      // status
      status: match[5],
      // path for compare "src"
      srcPath: match[7],
      // path for compare "dst"
      dstPath: match[8] || match[7],
    });
  }
  return result;
}

module.exports = function (compare, opt) {
  opt = Object.assign({
    cwd: process.cwd(),
    args: ['--diff-filter=ACMR'],
  }, opt);
  const srcStream = through.obj();
  this.spawn(
    [
      'diff',
      '--raw',
      '-z',
    ]
    .concat(opt.args)
    .concat(compare || 'origin/master...')
  )
  .then(getReaslt)
  .then(files => {
    files.forEach(function(diff) {
      srcStream.write(new Vinyl({
        path: path.resolve(opt.cwd, diff.dstPath),
        cwd: opt.cwd,
        base: opt.base,
        git: {
          hash: diff.dstHash,
          diff: diff
        }
      }));
    }, {
      cwd: opt.cwd,
    });
    srcStream.end();
  }).catch(srcStream.emit.bind(srcStream, 'error'));

  return srcStream
    .pipe(this.catFile(opt));

};
