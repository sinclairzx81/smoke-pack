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

import { parse, InfoCommand } from './commands'
import { list }   from './commands'
import { create } from './commands'
import { add }    from './commands'
import { remove } from './commands'
import { link }   from './commands'
import { unlink } from './commands'
import { clean }  from './commands'
import { build }  from './commands'
import { watch }  from './commands'
import { start }  from './commands'
import { test }   from './commands'
import { pack }   from './commands'
import { run }    from './commands'

/** Prints informational message to console. */
async function info(command: InfoCommand) {
  const green  = '\x1b[32m'
  const yellow = '\x1b[33m'
  const esc    = '\x1b[0m'
  const buffer = [
  `Version 0.8.0`, ``,
  `$ ${green}smoke-pack${esc} <command> <...args>`, ``,
  `Options: ${green}smoke-pack${esc} ${yellow}create${esc} <name> <type>`,
  `         ${green}smoke-pack${esc} ${yellow}add${esc}    <name> <type>`,
  `         ${green}smoke-pack${esc} ${yellow}remove${esc} <name>`,
  `         ${green}smoke-pack${esc} ${yellow}link${esc}   <name> <dependency>`,
  `         ${green}smoke-pack${esc} ${yellow}unlink${esc} <name> <dependency>`,
  `         ${green}smoke-pack${esc} ${yellow}clean${esc}  <name>`,
  `         ${green}smoke-pack${esc} ${yellow}build${esc}  <name>`,
  `         ${green}smoke-pack${esc} ${yellow}watch${esc}  [...<names>]`,
  `         ${green}smoke-pack${esc} ${yellow}start${esc}  <name>`,
  `         ${green}smoke-pack${esc} ${yellow}test${esc}   <name>`,
  `         ${green}smoke-pack${esc} ${yellow}pack${esc}   <name>`,
  `         ${green}smoke-pack${esc} ${yellow}run${esc}    <name> <script>`,
  `         ${green}smoke-pack${esc} ${yellow}list${esc}`,
  ``
  ]
  if(command.message.length > 0) {
    buffer.push(command.message)
    buffer.push('')
  }
  console.log(buffer.join('\n'))
}

async function main(args: string[]) {
  const command = parse(args)
  switch(command.kind) {
    case 'info':   return info   (command)
    case 'list':   return list   ()
    case 'create': return create (command.name, command.type)
    case 'add':    return add    (command.name, command.type)
    case 'remove': return remove (command.name)
    case 'link':   return link   (command.name, command.dependency)
    case 'unlink': return unlink (command.name, command.dependency)
    case 'clean':  return clean  (command.name)
    case 'build':  return build  (command.name)
    case 'watch':  return watch  (command.names)
    case 'start':  return start  (command.name)
    case 'test':   return test   (command.name)
    case 'pack':   return pack   (command.name)
    case 'run':    return run    (command.name, command.script)
    default: {
      const kind = 'info'
      const message = 'unknown option'
      return info({ kind, message })
    }
  }
}

main([...process.argv])



