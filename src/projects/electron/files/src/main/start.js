#!/usr/bin/env node

const electron  = require('electron')
const { spawn } = require('child_process')
const { join }  = require('path')

const main = join(__dirname, 'index.js')
const proc = spawn(electron, [main], { stdio: 'inherit' })
proc.on('close', code => process.exit(code))
