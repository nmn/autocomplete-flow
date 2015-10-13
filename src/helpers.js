/* @flow */
export function insertAutocompleteToken(contents: string, line: number, col: number): string {
  var lines = contents.split('\n')
  var theLine = lines[line]
  theLine = theLine.substring(0, col) + 'AUTO332' + theLine.substring(col)
  lines[line] = theLine
  return lines.join('\n')
}

export function promisedExec(cmdString: string, args: Array<string>, options: Object, file: string): Promise<Object> {
  return new Promise(function(resolve, reject){

  })
}
