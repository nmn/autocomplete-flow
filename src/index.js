/* @flow */
/* global atom */
import path from 'path'
import {spawn} from 'child_process'
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

            // const [cwd] = atom.project.relativizePath(file)
            options.cwd = path.dirname(file) //cwd

            try {
              const stringWithACToken = insertAutocompleteToken(currentContents, line, col)
              const result = await promisedExec(cmdString, args, options, stringWithACToken)
              if (!result || !result.length) {
                return []
              }
              // If it is just whitespace and punctuation, ignore it (this keeps us
              // from eating leading dots).
              const replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix
              const candidates = result.map(item => processAutocompleteItem(replacementPrefix, item))
              // return candidates
              return filter(candidates, replacementPrefix, { key: 'displayText' })
            } catch (e) {
              console.log('[autocomplete-flow] ERROR:', e)
              return []
            }
          }
        }

      return provider
    }
  }
