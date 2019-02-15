/*--------------------------------------------------------------------------

MIT License

Copyright (c) smoke-pack 2019 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---------------------------------------------------------------------------*/

import * as projects from '../projects'
import * as config   from '../config'
import * as assert   from './assert'

/** Adds a new package to the packages directory. */
export async function add(project: string, type: string) {
  assert.canAddProject(project)
  const directoryPath = `./packages/${project}`
  switch(type) {
    case 'empty':    await projects.empty    (directoryPath, project); break
    case 'console':  await projects.console  (directoryPath, project); break
    case 'library':  await projects.library  (directoryPath, project); break
    case 'browser':  await projects.browser  (directoryPath, project); break
    case 'electron': await projects.electron (directoryPath, project); break
    case 'wasm':     await projects.wasm     (directoryPath, project); break
    default: return console.log(`Unknown project type '${type}'`)
  }
  config.add(project)
}