
/* global atom */
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// import atom from 'atom'

var _child_process = require('child_process');

require('regenerator/runtime');

var _helpers = require('./helpers');

var _fuzzaldrin = require('fuzzaldrin');

var cmdString = 'flow';

module.exports = { config: { pathToFlowExecutable: { type: 'string',
      'default': 'flow'
    }
  },
  activate: function activate() {
    console.log('activating autocomplete-flow');

    // getting custom value
    cmdString = atom.config.get('autocomplete-flow.pathToFlowExecutable') || 'flow';
  },
  deactivate: function deactivate() {
    console.log('deactivating autocomplete-flow');
  },
  getCompletionProvider: function getCompletionProvider() {
    var provider = { selector: '.source.js, .source.js.jsx, .source.jsx',
      disableForSelector: '.source.js .comment, source.js .keyword',
      inclusionPriority: 1,
      excludeLowerPriority: true,
      getSuggestions: function getSuggestions(_ref) {
        var editor = _ref.editor;
        var bufferPosition = _ref.bufferPosition;
        var prefix = _ref.prefix;

        var file, currentContents, cursor, line, col, options, args, _atom$project$relativizePath, _atom$project$relativizePath2, cwd, result, replacementPrefix, candidates;

        return regeneratorRuntime.async(function getSuggestions$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              file = editor.getPath();
              currentContents = editor.getText();
              cursor = editor.getLastCursor();
              line = cursor.getBufferRow();
              col = cursor.getBufferColumn();
              options = {};
              args = ['autocomplete', '--json', file];

              console.log(file, line, col);

              _atom$project$relativizePath = atom.project.relativizePath(file);
              _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);
              cwd = _atom$project$relativizePath2[0];

              options.cwd = cwd;

              context$2$0.prev = 12;
              context$2$0.next = 15;
              return regeneratorRuntime.awrap((0, _helpers.promisedExec)(cmdString, args, options, (0, _helpers.insertAutocompleteToken)(currentContents, line, col)));

            case 15:
              result = context$2$0.sent;

              if (!(!result || !result.length)) {
                context$2$0.next = 18;
                break;
              }

              return context$2$0.abrupt('return', []);

            case 18:
              replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix;
              candidates = result.map(function (item) {
                return (0, _helpers.processAutocompleteItem)(replacementPrefix, item);
              });
              return context$2$0.abrupt('return', candidates);

            case 23:
              context$2$0.prev = 23;
              context$2$0.t0 = context$2$0['catch'](12);
              return context$2$0.abrupt('return', []);

            case 26:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this, [[12, 23]]);
      }
    };

    return provider;
  }
};

// return [{text: 'yo'}]
// file: filePath
// currentContents: fileContents
// line: number, column: number

// If it is just whitespace and punctuation, ignore it (this keeps us
// from eating leading dots).

// return filter(candidates, replacementPrefix, { key: 'displayText' })