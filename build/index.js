
/* global atom */
// import fs from 'fs'

// import {CompositeDisposable} from 'atom'
// import {allowUnsafeNewFunction} from 'loophole'
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

// import {sync} from 'resolve'

var _child_process = require('child_process');

var _helpers = require('./helpers');

var linterPackage = atom.packages.getLoadedPackage('linter');
if (!linterPackage) {
  atom.notifications.addError('Linter should be installed first, `apm install linter`', { dismissable: true }); // eslint-disable-line
}

// const linterPath = linterPackage.path
// const findFile = require(`${linterPath}/lib/util`)

var cmdString = 'flow';

module.exports = { config: { pathToFlowExecutable: { type: 'string',
      'default': 'flow'
    }
  },
  activate: function activate() {
    console.log('activating linter-flow');

    // getting custom value
    cmdString = atom.config.get('linter-flow.pathToFlowExecutable') || 'flow';
  },
  deactivate: function deactivate() {
    console.log('deactivating linter-flow');
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
        var file, currentContents, cursor, line, col, options, args;
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

              options.stdin = (0, _helpers.insertAutocompleteToken)(currentContents, line, col);
              return context$2$0.abrupt('return', []);

            case 10:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    };

    // try {
    //   var result = await promisedExec(cmdString, args, options, file)
    //   if (!result) {
    //     return []
    //   }
    //   if (result.exitCode === 0) {
    //     var json = JSON.parse(result.stdout)
    //     // If it is just whitespace and punctuation, ignore it (this keeps us
    //     // from eating leading dots).
    //     var replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix
    //     var candidates = json.map(item => processAutocompleteItem(replacementPrefix, item))
    //     return filter(candidates, replacementPrefix, { key: 'displayText' })
    //   } else {
    //     return []
    //   }
    // } catch (_) {
    //   return []
    // }
    return provider;
  }
};

// return [{text: 'yo'}]
// file: filePath
// currentContents: fileContents
// line: number, column: number