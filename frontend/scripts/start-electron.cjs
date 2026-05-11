const { spawn } = require('child_process')
const path = require('path')

const electronPath = require('electron')
const appEntry = path.join(__dirname, '..', 'electron-main.cjs')
const passthroughArgs = process.argv.slice(2)
const env = { ...process.env }

delete env.ELECTRON_RUN_AS_NODE

console.log(`[electron-launcher] exe: ${electronPath}`)
console.log(`[electron-launcher] app: ${appEntry}`)
console.log(`[electron-launcher] ELECTRON_RUN_AS_NODE: ${env.ELECTRON_RUN_AS_NODE || 'unset'}`)

function quote(value) {
  return `"${String(value).replace(/"/g, '""')}"`
}

const command = `"${[quote(electronPath), ...passthroughArgs, quote(appEntry)].join(' ')}"`
const child = spawn('cmd.exe', ['/d', '/s', '/c', command], {
  cwd: path.join(__dirname, '..'),
  env,
  stdio: 'inherit'
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (error) => {
  console.error('Failed to start Electron:', error)
  process.exit(1)
})
