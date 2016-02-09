'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _helpers = require('./helpers');

var _fuzzaldrin = require('fuzzaldrin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global atom */


var cmdString = 'flow';

module.exports = { config: { pathToFlowExecutable: { type: 'string',
      default: 'flow'
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
        var _this = this;

        var editor = _ref.editor;
        var bufferPosition = _ref.bufferPosition;
        var prefix = _ref.prefix;
        return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
          var file, currentContents, cursor, line, col, options, args, _ret;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // return [{text: 'yo'}]
                  // file: filePath
                  // currentContents: fileContents
                  // line: number, column: number

                  file = editor.getPath();
                  currentContents = editor.getText();
                  cursor = editor.getLastCursor();
                  line = cursor.getBufferRow();
                  col = cursor.getBufferColumn();
                  options = {};
                  args = ['autocomplete', '--json', file];

                  // const [cwd] = atom.project.relativizePath(file)

                  options.cwd = _path2.default.dirname(file); //cwd

                  _context2.prev = 8;
                  return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                    var stringWithACToken, result, replacementPrefix, candidates;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            stringWithACToken = (0, _helpers.insertAutocompleteToken)(currentContents, line, col);
                            _context.next = 3;
                            return (0, _helpers.promisedExec)(cmdString, args, options, stringWithACToken);

                          case 3:
                            result = _context.sent;

                            if (!(!result || !result.length)) {
                              _context.next = 6;
                              break;
                            }

                            return _context.abrupt('return', {
                              v: []
                            });

                          case 6:
                            // If it is just whitespace and punctuation, ignore it (this keeps us
                            // from eating leading dots).
                            replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix;
                            candidates = result.map(function (item) {
                              return (0, _helpers.processAutocompleteItem)(replacementPrefix, item);
                            });
                            // return candidates

                            return _context.abrupt('return', {
                              v: (0, _fuzzaldrin.filter)(candidates, replacementPrefix, { key: 'displayText' })
                            });

                          case 9:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this);
                  })(), 't0', 10);

                case 10:
                  _ret = _context2.t0;

                  if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
                    _context2.next = 13;
                    break;
                  }

                  return _context2.abrupt('return', _ret.v);

                case 13:
                  _context2.next = 19;
                  break;

                case 15:
                  _context2.prev = 15;
                  _context2.t1 = _context2['catch'](8);

                  console.log('[autocomplete-flow] ERROR:', _context2.t1);
                  return _context2.abrupt('return', []);

                case 19:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this, [[8, 15]]);
        }))();
      }
    };

    return provider;
  }
};