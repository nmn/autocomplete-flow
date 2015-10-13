'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.insertAutocompleteToken = insertAutocompleteToken;
exports.promisedExec = promisedExec;

function insertAutocompleteToken(contents, line, col) {
  var lines = contents.split('\n');
  var theLine = lines[line];
  theLine = theLine.substring(0, col) + 'AUTO332' + theLine.substring(col);
  lines[line] = theLine;
  return lines.join('\n');
}

function promisedExec(cmdString, args, options, file) {
  return new Promise(function (resolve, reject) {});
}