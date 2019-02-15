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

import * as config from '../config'
import * as host   from '../host'

/** Installs this project and its dependencies */
export async function install(project: string) {
  if(host.exists(`./packages/${project}/node_modules`) ||
    !host.exists(`./packages/${project}/package.json`)) {
    return
  }
  for(const dependency of config.dependencies(project)) {
    await install(dependency) 
  }
  host.print('installing', project)
  await host.shell(`cd ./packages/${project} && npm install`)
}

/** Cleans this project and its dependencies */
export async function clean(project: string) {
  for(const dependency of config.dependencies(project)) {
    await clean(dependency) 
  }
  await host.shell(`cd ./packages/${project} && npx smoke-task clean`)
}

/** Links the given project to the given dependency. */
export async function link(project: string, dependency: string) {
  if(host.exists(`./packages/${project}/node_modules/${dependency}`)) {
    return
  }
  host.print('linking', `${project}/node_modules/${dependency}`)
  await host.shell(`cd ./packages/${project} && npm link ../${dependency}/public/bin`)
}

/** Builds this project and its dependencies */
export async function build(project: string) {
  for(const dependency of config.dependencies(project)) {
    await build(dependency)
  }
  for(const dependency of config.dependencies(project)) {
    await link (project, dependency)
  }
  host.print('building', project)
  await host.shell(`cd ./packages/${project} && npx smoke-task build`)
}

/** Recursively builds this project and its dependencies */
export async function conditional_build(project: string) {
  for(const dependency of config.dependencies(project)) {
    await conditional_build(dependency)
  }
  for(const dependency of config.dependencies(project)) {
    await link (project, dependency)
  }
  host.print('building', project)
  await host.shell(`cd ./packages/${project} && npx smoke-task conditional_build`)
}
