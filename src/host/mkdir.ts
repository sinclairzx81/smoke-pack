/*--------------------------------------------------------------------------

MIT License

Copyright (c) smoke-pack 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------*/

import { mkdirSync, statSync } from 'fs'
import * as common             from './common'

/** Tests if this directory path should be created. */
function shouldCreate (directoryPath: string): boolean {
  try {
    const stat = statSync(directoryPath)
    return stat.isDirectory() ? false : true
  } catch {
    return true
  }
}

/** Makes the given directory path. If not exists, create recursively. */
export function mkdir (directoryPath: string): void {
  const uniformPath = common.uniformPath(directoryPath)
  const parts       = uniformPath.split('/')
  let current       = ''
  while (parts.length > 0) {
    current = [current, parts.shift(), '/'].join('')
    if (shouldCreate(current)) {
      mkdirSync(current)
    }
  }
}
