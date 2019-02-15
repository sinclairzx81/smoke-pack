import { app, session, BrowserWindow } from 'electron'
import { join, dirname }               from 'path'
import { parse }                       from './support'
import { watch }                       from './support'

// ---------------------------------------------------------------------------------
//
// Content Security Policy
// 
// https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy 
//
// ---------------------------------------------------------------------------------

function content_security_policy() {
  session.defaultSession!.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Content-Security-Policy': ["default-src 'self'"],
        ...details.responseHeaders
      }
    })
  })
}

const index = join(__dirname, 'pages/index.html')
const options = {
  width:  800, 
  height: 600,
  webPreferences: {
    nodeIntegration: true
  }
}

function main() {
  content_security_policy()

  const window = new BrowserWindow(options)
  window.loadFile(index)
  const command = parse([...process.argv])
  if(command.watch) {
    const handle = watch(dirname(index), () => window.reload())
    window.on('close', () => handle.dispose())
    const facade: any = window
    facade.openDevTools()
  }
}

app.on('ready', () => main())