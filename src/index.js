/* @flow */
/* global atom */
import path from 'path'
// import atom from 'atom'
import {spawn} from 'child_process'
import 'regenerator/runtime'
import {insertAutocompleteToken, promisedExec, processAutocompleteItem} from './helpers'
import {filter} from 'fuzzaldrin'
import type {AutocompleteProvider} from './types'

let cmdString = 'flow'

module.exports =
  { config:
      { pathToFlowExecutable:
          { type: 'string'
          , default: 'flow'
          }
      }
  , activate(){
      console.log('activating autocomplete-flow')

      // getting custom value
      cmdString = atom.config.get('autocomplete-flow.pathToFlowExecutable') || 'flow'
    }
  , deactivate(){
      console.log('deactivating autocomplete-flow')
    }
  , getCompletionProvider(): AutocompleteProvider {
      const provider =
        { selector: '.source.js, .source.js.jsx, .source.jsx'
        , disableForSelector: '.source.js .comment, source.js .keyword'
        , inclusionPriority: 1
        , excludeLowerPriority: true
        , async getSuggestions({editor, bufferPosition, prefix}){
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

            const [cwd] = atom.project.relativizePath(file)
            options.cwd = cwd

            try {
              var result = await promisedExec(cmdString, args, options, insertAutocompleteToken(currentContents, line, col))
              if (!result) {
                return []
              }
              var json = JSON.parse(result.stdout)
              // If it is just whitespace and punctuation, ignore it (this keeps us
              // from eating leading dots).
              var replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix
              var candidates = json.map(item => processAutocompleteItem(replacementPrefix, item))
              return candidates
              // return filter(candidates, replacementPrefix, { key: 'displayText' })
            } catch (_) {
              return []
            }
          }
        }

      return provider
    }
  }
