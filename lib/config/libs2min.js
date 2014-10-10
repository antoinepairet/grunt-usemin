'use strict';
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

exports.name = 'concat';

//
// Output a config for the furnished block
// The context variable is used both to take the files to be treated
// (inFiles) and to output the one(s) created (outFiles).
// It aslo conveys whether or not the current process is the last of the pipe
//
exports.createConfig = function(context, block) {
  var cfg = {files: []};
  // FIXME: check context has all the needed info
  var outfile = path.join(context.outDir, block.dest);

  // Depending whether or not we're the last of the step we're not going to output the same thing
  var files = {};
  files.dest = outfile;
  files.src = [];
  context.inFiles.forEach(function(f) {
    var filePath = path.join(context.inDir, f),
        splittedFilePath = filePath.split('/'),
        minFileName = splittedFilePath[splittedFilePath.length -1].replace(/\.js$/, '.min.js'),
        minifiedFileName = splittedFilePath[splittedFilePath.length -1].replace(/\.js$/, '.minified.js'),

        dirPath = splittedFilePath.slice(0, -1).join('/'),

        minFilePaths = [
          path.join(dirPath, minFileName),               // inDir ./resource.min.js
          path.join(dirPath, minifiedFileName),          // inDir ./resource.minified.js
          path.join(dirPath, 'min', minFileName),        // inSubDir ./min/resource.min.js
          path.join(dirPath, 'minified', minFileName)    // inSubDir ./minified/resource.min.js 
        ],

        minFilePath;


        _.every(minFilePaths, function (minFile) {
          if (fs.existsSync(path.join(process.cwd(), minFile))) {
            minFilePath = minFile;
            return false;
          } else {
            return true
          }
        })

    files.src.push(minFilePath ? minFilePath : filePath);
  });

  cfg.files.push(files);
  context.outFiles = [block.dest];
  return cfg;
};