'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.insertAutocompleteToken = insertAutocompleteToken;
exports.promisedExec = promisedExec;
exports.processAutocompleteItem = processAutocompleteItem;

var _child_process = require('child_process');

function insertAutocompleteToken(contents, line, col) {
  var lines = contents.split('\n');
  var theLine = lines[line];
  theLine = theLine.substring(0, col) + 'AUTO332' + theLine.substring(col);
  lines[line] = theLine;
  return lines.join('\n');
}

function promisedExec(cmdString, args, options, file) {
  return new Promise(function (resolve, reject) {
    var command = (0, _child_process.spawn)(cmdString, args, options);

    var data = '',
        errors = '';
    command.stdout.on('data', function (d) {
      data += d;
    });
    command.stderr.on('data', function (d) {
      errors += d;
    });
    command.on('close', function (err) {
      if (err) {
        reject(errors);
      } else if (!data || errors) {
        reject(errors);
      } else {
        data = JSON.parse(data.substr(data));
        resolve(data);
      }
    });

    command.stdin.write(file);
    command.stdin.end();
  });
}

function processAutocompleteItem(replacementPrefix, flowItem) {
  var result = { description: flowItem['type'],
    displayText: flowItem['name'],
    replacementPrefix: replacementPrefix
  };
  var funcDetails = flowItem['func_details'];
  if (funcDetails) {
    // The parameters turned into snippet strings.
    var snippetParamStrings = funcDetails['params'].map(function (param, i) {
      return '${' + (i + 1) + ':' + param['name'] + '}';
    });
    // The parameters in human-readable form for use on the right label.
    var rightParamStrings = funcDetails['params'].map(function (param) {
      return param['name'] + ': ' + param['type'];
    });
    result = _extends({}, result, { leftLabel: funcDetails['return_type'],
      rightLabel: '(' + rightParamStrings.join(', ') + ')',
      snippet: flowItem['name'] + '(' + snippetParamStrings.join(', ') + ')',
      type: 'function'
    });
  } else {
    result = _extends({}, result, { rightLabel: flowItem['type'],
      text: flowItem['name']
    });
  }
  return result;
}