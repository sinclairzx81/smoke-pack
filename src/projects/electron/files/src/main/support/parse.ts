

export class InvalidCommandError extends Error {
  constructor(command: string) {
    super(`Invalid command option '${command}`)
  }
}

export interface Command {
  watch: boolean
}

export function parse(argv: string[]): Command {
  const command = { watch: false }
  const args = argv.slice(2)
  while(args.length > 0) {
    const current = args.shift()!
    switch(current) {
      case '--watch': command.watch = true; break
      default: new InvalidCommandError(current)
    }
  }
  return command
}
