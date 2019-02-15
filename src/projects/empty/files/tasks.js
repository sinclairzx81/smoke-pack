shell_options({ trace: false })

/** Cleans this project. */
export async function clean() {
  await shell('shx rm -rf public')
  await shell('shx rm -rf node_modules')
}

/** Builds this project. */
export async function build() {
  await shell('shx mkdir -p public/bin')
  await shell('shx cp package.json public/bin')
  await shell('shx cp src/index.js public/bin')
}

/** Builds the project if not already built. */
export async function conditional_build() {
  if(!exists('public/bin/index.js')) {
    await build()
  }
}

/** Builds and starts this project. */
export async function start() {
  await shell('cd src && node index.js')
}

/** Watches this project. */
export async function watch() {
  await shell('cd src && smoke-run ./\\{**.,\\}/** -- node index')
}

/** Runs tests for this project. */
export async function test() {
  await shell('echo no tests available for this project.')
}

/** Packs this project for NPM deployment. */
export async function pack() {
  await build()
  await shell('shx rm -rf public/pack')
  await shell('shx mkdir  public/pack')
  await shell('shx cp -r public/bin/* public/pack')
  await shell('cd public/pack && npm pack')
}
