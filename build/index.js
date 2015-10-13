
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

var autocompletePackage = atom.packages.getLoadedPackage('autocomplete-plus');
if (!autocompletePackage) {
  atom.notifications.addError('autocomplete-plus should be installed first, `apm install autocomplete-plus`', { dismissable: true }); // eslint-disable-line
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

        // return [{text: 'yo'}]
        // file: filePath
        // currentContents: fileContents
        // line: number, column: number

        var file = editor.getPath();
        var currentContents = editor.getText();
        var cursor = editor.getLastCursor();
        var line = cursor.getBufferRow();
        var col = cursor.getBufferColumn();

        var options = {};
        var args = ['autocomplete', '--json', file];

        console.log(file, line, col);

        options.stdin = (0, _helpers.insertAutocompleteToken)(currentContents, line, col);
        return [];
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
      }
    };

    return provider;
  }
};