/* @flow */
/* global atom */
// import fs from 'fs'
import path from 'path'
// import {sync} from 'resolve'
import {spawn} from 'child_process'
import type {AutocompleteProvider} from './types'
// import {CompositeDisposable} from 'atom'
// import {allowUnsafeNewFunction} from 'loophole'
const linterPackage: boolean = atom.packages.getLoadedPackage('linter')
if(!linterPackage){
  atom.notifications.addError('Linter should be installed first, `apm install linter`', {dismissable: true}) // eslint-disable-line
}

// const linterPath = linterPackage.path
// const findFile = require(`${linterPath}/lib/util`)

let cmdString = 'flow'

function extractRange(message){
  return [ [message.line - 1, message.start - 1]
         , [message.endline - 1, message.end]
         ]
}

function flowMessageToTrace(message){
  return { type: 'Trace'
         , text: message.descr
         , filePath: message.path
         , range: extractRange(message)
         }
}

function flowMessageToLinterMessage(arr) {
  // h/t Nuclide-flow
  // It's unclear why the 1-based to 0-based indexing works the way that it
  // does, but this has the desired effect in the UI, in practice.
  var message = Array.isArray(arr) ? arr[0] : arr

  var obj: Object =
    { type: message.level
    , text: Array.isArray(arr) ? arr.map(o => o.descr).join(' ') : message.descr
    , filePath: message.path
    , range: extractRange(message)
    }

  if(Array.isArray(arr) && arr.length > 1){
    obj.trace = arr.slice(1).map(flowMessageToTrace)
  }

  return obj
}

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
  , provideLinter(): AutocompleteProvider {
      const provider =
        { selector: '.source.js, .source.js.jsx, .source.jsx'
        , disableForSelector: '.source.js .comment, source.js .keyword'
        , inclusionPriority: 1
        , excludeLowerPriority: true
        , getSuggestions({editor, bufferPosition, prefix}){
            return [{text: 'yo'}]
          }
        }

      return provider
    }
  }
