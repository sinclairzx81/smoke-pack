export function print(context: string, message: string) {
  const green  = '\x1b[32m'
  const yellow = '\x1b[33m'
  const esc    = '\x1b[0m'
  console.log(`${green}${context}${esc}`, message)
}