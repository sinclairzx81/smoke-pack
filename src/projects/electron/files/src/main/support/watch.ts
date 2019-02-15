import { resolve, join }               from 'path'
import { FSWatcher, watch as fswatch } from 'fs'
import { readdirSync }                 from 'fs'
import { statSync }                    from 'fs'
import { existsSync }                  from 'fs'

/** Scans for directories under the given directory path. */
function scan(directoryPath: string): string[] {
  try {
    return [directoryPath, ...readdirSync(directoryPath)
      .map     (path  => join(directoryPath, path))
      .filter  (path => existsSync(path))
      .filter  (path => statSync(path).isDirectory())
      .map     (path => scan(path))
      .flatMap (paths => paths)]
  } catch {
    return [directoryPath]
  }
}

export class ResetTimeout {
  private timer!: NodeJS.Timer
  constructor(private timeout: number) {}
  public run(func: () => void) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => func(), this.timeout)
  }
}

export type WatchFunction = (filePath: string) => void

export class WatchHandle {
  constructor(private watchers: FSWatcher[]) {}
  public dispose() {
    this.watchers.forEach(watcher => watcher.close())
  }
}

/** Creates a file system watcher and returns a WatchHandle to the caller. */
export function watch(directoryPath: string, callback: () => void): WatchHandle {
  const reset = new ResetTimeout(100)
  const paths = scan(resolve(directoryPath))
  return new WatchHandle(paths.map(directoryPath => fswatch(directoryPath, () => {
    reset.run(() => callback())
  })))
}
