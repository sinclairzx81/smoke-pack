shell_options({ trace: false })

const package = require(`${process.cwd()}/package.json`)

/** Cleans this project. */
export async function clean() {
  await shell('shx rm -rf public')
  await shell('shx rm -rf node_modules')
}

/** Builds this project. */
export async function build() {
  await shell('tsc-bundle src/tsconfig.json --outFile public/bin/index.js')
  await shell('shx cp src/start.js public/bin')
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
  await shell('node public/bin/index.js')
}

/** Watches this project. */
export async function watch() {
  await conditional_build()
  await Promise.all([
    shell('tsc-bundle src/tsconfig.json --outFile public/bin/index.js --watch'),
    shell('smoke-run public/bin/index.js -- node public/bin/index.js')
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
  await shell('shx mkdir public/pack')
  await shell('shx cp public/bin/* public/pack')
  await shell('shx cp package.json public/pack')
  await shell('shx cp readme.md    public/pack')
  await shell('shx cp license      public/pack')
  await shell('cd public/pack && npm pack')
}

/** Installs program locally. */
export async function install_cli () {
  await pack()
  await shell(`npm install public/pack/${package.name}-${package.version}.tgz -g`)
}