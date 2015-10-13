/* @flow */
/* global atom */
// import fs from 'fs'
import path from 'path'
// import {sync} from 'resolve'
import {spawn} from 'child_process'
import {insertAutocompleteToken} from './helpers'
import type {AutocompleteProvider} from './types'
// import {CompositeDisposable} from 'atom'
// import {allowUnsafeNewFunction} from 'loophole'
const autocompletePackage: boolean = atom.packages.getLoadedPackage('autocomplete-plus')
if(!autocompletePackage){
  atom.notifications.addError('autocomplete-plus should be installed first, `apm install autocomplete-plus`', {dismissable: true}) // eslint-disable-line
}

// const linterPath = linterPackage.path
// const findFile = require(`${linterPath}/lib/util`)

let cmdString = 'flow'


module.exports =
  { config:
      { pathToFlowExecutable:
          { type: 'string'
          , default: 'flow'
          }
      }
  , activate(){
      console.log('activating linter-flow')

      // getting custom value
      cmdString = atom.config.get('linter-flow.pathToFlowExecutable') || 'flow'
    }
  , deactivate(){
      console.log('deactivating linter-flow')
    }
  , getCompletionProvider(): AutocompleteProvider {
      const provider =
        { selector: '.source.js, .source.js.jsx, .source.jsx'
        , disableForSelector: '.source.js .comment, source.js .keyword'
        , inclusionPriority: 1
        , excludeLowerPriority: true
        , getSuggestions({editor, bufferPosition, prefix}){
            // return [{text: 'yo'}]
            // file: filePath
            // currentContents: fileContents
            // line: number, column: number

            const file = editor.getPath()
            const currentContents = editor.getText()
            const cursor = editor.getLastCursor()
            const line = cursor.getBufferRow()
            const col = cursor.getBufferColumn()

            let options = {}
            const args = ['autocomplete', '--json', file]

            console.log(file, line, col)

            options.stdin = insertAutocompleteToken(currentContents, line, col)
            return []
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
        }

      return provider
    }
  }
