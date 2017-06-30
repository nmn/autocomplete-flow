/* @flow */

'use babel';

import path from 'path'
import {spawn} from 'child_process'
import {insertAutocompleteToken, promisedExec, processAutocompleteItem} from './helpers'
import {filter} from 'fuzzaldrin'
import { CompositeDisposable } from 'atom'
import {exec, find} from 'atom-linter'
import { sync as which } from 'which'
import type {AutocompleteProvider} from './types'

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
      this.subscriptions = new CompositeDisposable()
      this.cmdString = 'flow'
      this.subscriptions.add(atom.config.observe('autocomplete-flow.pathToFlowExecutable', (pathToFlow) => {
        this.cmdString = pathToFlow || 'flow'
      }))
      if (atom.inDevMode()) {
        console.log('activating... autocomplete-flow')
      }
    }
  , deactivate(){
      if (atom.inDevMode()) {
        console.log('deactivating... autocomplete-flow')
      }
      exec(this.cmdString, ['stop'], {}).catch(() => null)
      this.subscriptions.dispose()
    }
  , getCompletionProvider(): AutocompleteProvider {
      const that = this
      const provider =
        { selector: '.source.js, .source.js.jsx, .source.jsx'
        , disableForSelector: '.source.js .comment, source.js .keyword'
        , inclusionPriority: 1
        , excludeLowerPriority: false
        , async getSuggestions({editor, bufferPosition, prefix}){
            if (!prefix) {
              return []
            }
            const file = editor.getPath()
            const currentContents = editor.getText()
            const cursor = editor.getLastCursor()
            const line = cursor.getBufferRow()
            const col = cursor.getBufferColumn()

            const flowConfig = find(file, '.flowconfig')
            if (!flowConfig) {
              return []
            }
            const cwd = path.dirname(flowConfig)

            const options = { cwd }
            const args = ['autocomplete', '--json', file]

            let flowBin = that.cmdString
            if (flowBin == null || flowBin === 'flow') {
              try {
                const localFlowBin = path.join(cwd, 'node_modules/.bin/flow')
                fs.accessSync(localFlowBin, fs.R_OK)
                flowBin = localFlowBin
              } catch (e) {
                try {
                  which('flow')
                  flowBin = 'flow'
                } catch (e) {
                  return []
                }
              }
            }

            try {
              const stringWithACToken = insertAutocompleteToken(currentContents, line, col)
              const result = await promisedExec(flowBin, args, options, stringWithACToken)
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
              const errorM: string = String(e).toLowerCase()
              if ( errorM.includes('rechecking')
                || errorM.includes('launching')
                || errorM.includes('processing')
                || errorM.includes('starting')
                || errorM.includes('spawned')
                || errorM.includes('logs')
                || errorM.includes('initializing')
              ) {
                return []
              }
              console.log('[autocomplete-flow] ERROR:', e)
              return []
            }
          }
        }

      return provider
    }
  }
