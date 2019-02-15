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

import * as host from '../host'

// -------------------------------------------------------------
//
// The following tokens are rewritten during template rewrite.
//
// token-project-name
// token-year
// token-email
// token-user
//
// -------------------------------------------------------------

export interface WriteTemplateOptions {
  name:        string
  filePath:    string
  content:     string
  year?:       string
  email?:      string
  user?:       string
}

/** Writes the given project template file with the given options. */
export function writeTemplate (options: WriteTemplateOptions) {
  const year    = options.year  || (new Date()).getFullYear().toString()
  const email   = options.email || 'user@domain.com'
  const user    = options.user  || 'user'
  host.writeFile(options.filePath, options.content
    .replace(new RegExp('token-project-name', 'g'), options.name)
    .replace(new RegExp('token-year',  'g'), year)
    .replace(new RegExp('token-email', 'g'), email)
    .replace(new RegExp('token-user',  'g'), user))
}