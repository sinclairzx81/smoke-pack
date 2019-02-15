shell_options({ trace: true })

const package = require(`${process.cwd()}/package.json`)

export async function clean() {
  await shell('shx rm -rf public')
  await shell('shx rm -rf node_modules')
}

export async function build() {
  await shell(`tsc-bundle src/tsconfig.json --outFile public/bin/index.js`)
  await shell(`shx cp src/start      public/bin`)
  await shell(`shx cp package.json   public/bin`)
  await shell(`shx cp readme.md      public/bin`)
  await shell(`shx cp license        public/bin`)
}

export async function pack() {
  await build()
  await shell(`cd public/bin && npm pack`)
  await shell('shx mkdir -p public/pack')
  await shell('shx mv -f  public/bin/*.tgz public/pack')
}

export async function install_cli() {
  await pack()
  await shell(`npm install public/pack/${package.name}-${package.version}.tgz -g`)
}

export async function watch() {
  await shell(`smoke-run ./src/{**,.}/** -- npx smoke-task install_cli`)
}