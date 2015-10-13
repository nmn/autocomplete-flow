/* @flow */
import {spawn} from 'child_process'

export function insertAutocompleteToken(contents: string, line: number, col: number): string {
  var lines = contents.split('\n')
  var theLine = lines[line]
  theLine = theLine.substring(0, col) + 'AUTO332' + theLine.substring(col)
  lines[line] = theLine
  return lines.join('\n')
}

export function promisedExec(cmdString: string, args: Array<string>, options: Object, file: string): Promise<Object> {
  return new Promise(function(resolve, reject){
    const command = spawn(cmdString, args, options)

    let data = '', errors = ''
    command.stdout.on('data', function(d){
      data += d
    })
    command.stderr.on('data', function(d){
      errors += d
    })
    command.on('close', function(err){
      if(err){
        reject(errors)
      } else if(!data || errors){
        reject(errors)
      } else {
        data = JSON.parse(data.substr(data))
        resolve(data)
      }
    })

    command.stdin.write(file)
    command.stdin.end()
  })
}

export function processAutocompleteItem(replacementPrefix: string, flowItem: Object): Object {
  var result =
    { description: flowItem['type']
    , displayText: flowItem['name']
    , replacementPrefix
    }
  var funcDetails = flowItem['func_details']
  if (funcDetails) {
    // The parameters turned into snippet strings.
    var snippetParamStrings = funcDetails['params']
      .map((param, i) => `\${${i + 1}:${param['name']}}`)
    // The parameters in human-readable form for use on the right label.
    var rightParamStrings = funcDetails['params']
      .map(param => `${param['name']}: ${param['type']}`)
    result =
      { ...result
      , leftLabel: funcDetails['return_type']
      , rightLabel: `(${rightParamStrings.join(', ')})`
      , snippet: `${flowItem['name']}(${snippetParamStrings.join(', ')})`
      , type: 'function'
      }
  } else {
    result =
      { ...result
      , rightLabel: flowItem['type']
      , text: flowItem['name']
      }
  }
  return result
}
