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


export interface InfoCommand   { kind: 'info',   message: string }

export interface ListCommand   { kind: 'list' }
export interface CreateCommand { kind: 'create', name: string, type: string }
export interface AddCommand    { kind: 'add',    name: string, type: string }
export interface RemoveCommand { kind: 'remove', name: string }
export interface LinkCommand   { kind: 'link',   name: string, dependency: string }
export interface UnlinkCommand { kind: 'unlink', name: string, dependency: string }

export interface CleanCommand  { kind: 'clean',  name:  string }
export interface BuildCommand  { kind: 'build',  name:  string }
export interface WatchCommand  { kind: 'watch',  names: string[] }
export interface StartCommand  { kind: 'start',  name:  string }
export interface TestCommand   { kind: 'test',   name:  string }
export interface PackCommand   { kind: 'pack',   name:  string }
export interface RunCommand    { kind: 'run',    name:  string, script: string }

export type Command =
// general
| InfoCommand 

// provision
| ListCommand
| CreateCommand 
| AddCommand 
| RemoveCommand 
| LinkCommand 
| UnlinkCommand

// automation 
| CleanCommand
| BuildCommand
| WatchCommand
| StartCommand 
| TestCommand 
| PackCommand
| RunCommand


/** Parses the given command line arguments. */
export function parse(args: string[]): Command {
  const forward = [args.shift()!, args.shift()!]

  if(args.length === 0) {
    const kind = 'info'
    const message = ''
    return { kind, message }
  }
  const commandKind   = args.shift()!
  switch(commandKind) {
    // ---------------------
    // provision
    // ---------------------
    case 'list': {
      const kind = 'list'
      return { kind }
    }
    // ---------------------
    // provision
    // ---------------------
    case 'create': {
      if(args.length !== 2) {
        const kind    = 'info'
        const message = 'Expected <name> <type> arguments.'
        return { kind, message }
      }
      const kind = 'create'
      const name = args.shift()!
      const type = args.shift()!
      return { kind, name, type }
    }
    case 'add': {
      if(args.length !== 2) {
        const kind    = 'info'
        const message = 'Expected <name> <type> arguments.'
        return { kind, message }
      }
      const kind = 'add'
      const name = args.shift()!
      const type = args.shift()!
      return { kind, name, type }
    }
    case 'remove': {
      if(args.length !== 1) {
        const kind    = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind = 'remove'
      const name = args.shift()!
      return { kind, name }
    }
    case "link": {
      if(args.length !== 2) {
        const kind    = 'info'
        const message = 'Expected <name> <dependency> arguments.'
        return { kind, message }
      }
      const kind       = 'link'
      const name       = args.shift()!
      const dependency = args.shift()!
      return { kind, name, dependency }
    }
    case "unlink": {
      if(args.length !== 2) {
        const kind    = 'info'
        const message = 'Expected <name> <dependency> arguments.'
        return { kind, message }
      }
      const kind       = 'unlink'
      const name       = args.shift()!
      const dependency = args.shift()!
      return { kind, name, dependency }
    }
    // ---------------------
    // automation
    // ---------------------
    case 'clean': {
      const kind = 'clean'
      if(args.length !== 1) {
        const name = '*'
        return { kind, name }
      }
      const name = args.shift()!
      return { kind, name }
    }
    case 'build': {
      if(args.length !== 1) {
        const kind    = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind = 'build'
      const name = args.shift()!
      return { kind, name }
    }
    case 'watch': {
      if(args.length < 1) {
        const kind    = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind  = 'watch'
      const names = [...args]
      return { kind, names }
    }
    case 'start': {
      if(args.length !== 1) {
        const kind    = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind = 'start'
      const name = args.shift()!
      return { kind, name }
    }
    case 'test': {
      if(args.length !== 1) {
        const kind = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind = 'test'
      const name = args.shift()!
      return { kind, name }
    }
    case 'pack': {
      if(args.length !== 1) {
        const kind = 'info'
        const message = 'Expected <name> argument.'
        return { kind, message }
      }
      const kind = 'pack'
      const name = args.shift()!
      return { kind, name }
    }
    case "run": {
      if(args.length !== 2) {
        const kind    = 'info'
        const message = 'Expected <name> <script> arguments.'
        return { kind, message }
      }
      const kind   = 'run'
      const name   = args.shift()!
      const script = args.shift()!
      return { kind, name, script }
    }
    default: {
      const kind    = 'info'
      const message = `Invalid command '${commandKind}'`
      return { kind, message }
    }
  }  
}
