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

import { join, basename } from 'path'
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, readdirSync } from 'fs'

const packagesRoot = './packages'
const configFile   = join(packagesRoot, 'packages.json')

// -------------------------------------------------------------------------
//
// Config
//
// This code manages the packages/packages.json file. It handles creating
// updating and syncing with the state of the packages directory. The
// config itself is used in the commands to enumerate projects, their
// dependencies and performing various asserts.
//
// -------------------------------------------------------------------------

export interface Config {
  [hame: string]: string[]
}

/** 
 * Safe parses the packages.json file. Allows for comments.
 */
function readJson(filePath: string): Config {
  const content = readFileSync(filePath, 'utf8')
  const parsed  = JSON.stringify(eval('(' + content + ')'))
  return JSON.parse(parsed)
}

/** 
 * Gets package names from disk. This function enumerates the
 * packageRoot and tests for directories that contain package.json
 * files. These are interpretted as targettable packages to build.
 */
export function getPackageNamesFromDisk(): string [] {
  if(!existsSync(packagesRoot)) {
    return []
  }
  return readdirSync(packagesRoot)
  .map(path => join(packagesRoot, path))
  .filter(packageRoot => statSync(packageRoot).isDirectory())
  .filter(packageRoot => existsSync(join(packageRoot, 'tasks.js')))
  .map(packagesRoot   => basename(packagesRoot))    
}

/** 
 * Refreshes the config file, adding new packages, and removing
 * non-existent modules. Following a refresh, the config file
 * should be in a consistent state.
 */
export function refresh() {
  const names  = getPackageNamesFromDisk()
  const config = read()
  names.forEach(name => {
    if(!config[name]) {
      config[name] = []
    }
  })
  Object.keys(config).forEach(name => {
    if(!names.includes(name)) {
      delete config[name]
    }
  })
  Object.keys(config).forEach(name => {
    config[name] = config[name].filter(dependency => {
      return names.includes(dependency)
    })
  })
  write(config)
}

/** 
 * Performs a cyclic dependency check on the given config. This
 * function will exit the process on detection.
 */
export function nonCyclic(name: string, config: Config) {
  const buffer: string[] = []
  const stack = [name]
  while(stack.length > 0) {
    const current = stack.pop()!
    if(buffer.includes(current)) {
      console.log('Cyclic dependency reference detected.')
      process.exit(1)
    }
    stack.push(...config[current])
    buffer.push(current)
  }
}

/** 
 * Reads the config file. If the file does not exist it is
 * automatically created with an empty config.
 */
export function read(): Config {
  if(!existsSync(configFile)) {
    write({})
  }
  return readJson(configFile)
}

/** 
 * Writes the config to disk.
 */
export function write(config: Config) {
  if(!existsSync(packagesRoot)) {
    mkdirSync(packagesRoot)
  }
  writeFileSync(configFile, JSON.stringify(config, null, 2))
}

/** 
 * Adds a package to the config.
 */
export function add(name: string) {
  refresh()
  const config = read()
  if(!config[name]) {
    config[name] = []
  }
  write(config)
}

/** 
 * Removes a package to the config.
 */
export function remove(name: string) {
  refresh()
  const config = read()
  if(config[name]) {
    Object.keys(config).forEach(key => {
      config[key] = config[key]
        .filter(dependency => dependency !== name)
    })
    delete config[name]
  }
  write(config)
}

/** 
 * Links the package name to the given dependency name.
 */
export function link (name: string, dependency: string) {
  refresh()
  const config = read()
  if(!config[name]) {
    console.log(`package '${name}' does not exist.`)
    process.exit(1)
  }
  if(!config[dependency]) {
    console.log(`dependency '${dependency}' does not exist.`)
    process.exit(1)
  }
  if(config[name].includes(dependency)) {
    return
  }
  config[name].push(dependency)
  nonCyclic(name, config)
  write(config)
}

/** 
 * Unlinks the package name from the given dependency name.
 */
export function unlink (name: string, dependency: string) {
  refresh()
  const config = read()
  if(!config[name]) {
    console.log(`package '${name}' does not exist.`)
    process.exit(1)
  }
  if(!config[name].includes(dependency)) {
    return
  }
  config[name] = config[name].filter(d => d !== dependency)
  nonCyclic(name, config)
  write(config)
}

/** 
 * Tests if the given package name exists in this config.
 */
export function exists(name: string): boolean {
  refresh()
  const config = read()
  return config[name] ? true : false
}

/** 
 * Lists the packages in the config.
 */
export function list(): string [] {
  refresh()
  const config = read()
  return Object.keys(config)
}

/** 
 * Returns the dependencies for the given package name.
 */
export function dependencies(name: string): string [] {
  refresh()
  const config = read()
  return config[name] || []
}

/** 
 * Returns the watch-set for the given project name. The
 * set includes the given project name and all dependent
 * projects.
 */
export function watch_set (name: string): string[] {
  refresh()
  const config = read()
  if(!config[name]) {
    return []
  }
  const list  = []
  const stack = [name]
  while(stack.length > 0) {
    const current = stack.pop()!
    stack.push(...config[current])
    list.unshift(current)
  }
  return list
    .filter((value, index, result) => 
      result.indexOf(value) === index)
}
