shell_options({ trace: false })

const package = require(`${process.cwd()}/package.json`)

/** Cleans this project. */
export async function clean() {
  await shell('shx rm -rf public')
  await shell('shx rm -rf node_modules')
}

/** Builds this project. */
export async function build() {
  await shell('tsc-bundle src/program/tsconfig.json --outFile public/bin/pages/index.js')
  await shell('tsc-bundle src/main/tsconfig.json    --outFile public/bin/index.js')
  await shell('shx cp -R src/pages/* public/bin/pages')
  await shell('shx cp -R src/main/start.js public/bin')
}

/** Builds the project if not already built. */
export async function conditional_build() {
  if(!exists('public/bin/index.js')) {
    await build()
  }
}

/** Builds and starts this project. */
export async function start() {
  await conditional_build()
  await shell('electron public/bin/index.js')
}

/** Watches this project. */
export async function watch() {
  await conditional_build()
  await Promise.all([
    shell('tsc-bundle src/program/tsconfig.json --outFile public/bin/pages/index.js --watch'),
    shell('tsc-bundle src/main/tsconfig.json --outFile public/bin/index.js  --watch'),
    shell('smoke-run  src/pages/\\{**,.\\}/** -- shx cp -r src/pages/* public/bin/pages'),
    shell('smoke-run ./public/bin/index.js     -- electron ./public/bin/index.js --watch')
  ])
}

/** Runs tests for this project. */
export async function test() {
  await shell('tsc-bundle test/tsconfig.json --outFile public/test/index.js')
  await shell('mocha public/test/index.js')
}

/** Packs this project for NPM deployment. */
export async function pack() {
  await build()
  await shell('shx rm -rf public/pack')
  await shell('shx mkdir -p public/pack')
  await shell('shx cp -r public/bin/* public/pack')
  await shell('shx cp package.json public/pack')
  await shell('shx cp readme.md public/pack')
  await shell('shx cp license public/pack')
  await shell('cd public/pack && npm pack')
}

/** Installs program locally. */
export async function install_cli () {
  await pack()
  await shell(`npm install public/pack/${package.name}-${package.version}.tgz -g`)
}