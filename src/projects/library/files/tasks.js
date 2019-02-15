shell_options({ trace: false })

/** Cleans this project. */
export async function clean() {
  await shell('shx rm -rf public')
  await shell('shx rm -rf node_modules')
}

/** Builds this project. */
export async function build() {
  await shell('tsc --project src/tsconfig.json --outDir public/bin --declaration')
  await shell('shx cp package.json public/bin')
}

/** Builds the project if not already built. */
export async function conditional_build() {
  if(!exists('public/bin/package.json')) {
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
  await shell('tsc --project src/tsconfig.json --outDir public/bin --declaration --watch')
}

/** Runs tests for this project. */
export async function test() {
  await shell('tsc --project test/tsconfig.json --outDir public/test')
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
