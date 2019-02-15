shell_options({ trace: false })

/** Cleans this project. */
export async function clean() {
  await shell('shx rm -rf pkg')
  await shell('shx rm -rf target')
}

/** Builds this project. */
export async function build() {
  await shell('wasm-pack build')
  await make ('public/bin')
  await shell('cp -r pkg/* public/bin')
  await drop ('pkg')
}

/** Builds the project if not already built. */
export async function conditional_build() {
  if(!exists('public/bin/index.js')) {
    await build()
  }
}

/** Builds and starts this project. */
export async function start() {

}

/** Watches this project. */
export async function watch() {

}

/** Runs tests for this project. */
export async function test() {
  await shell('cargo test')
}

/** Packs this project for NPM deployment. */
export async function pack() {

}
