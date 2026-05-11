const { app, BrowserWindow, Menu } = require('electron')
const fs = require('fs')
const http = require('http')
const path = require('path')

const DEV_SERVER_URL = 'http://localhost:5173/'
const DIST_INDEX = path.join(__dirname, 'dist', 'index.html')
const LOG_FILE = path.join(__dirname, 'electron-startup.log')

let mainWindow = null

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(LOG_FILE, line)
  console.log(message)
}

function renderStartupError(error) {
  const message = error instanceof Error ? error.stack || error.message : String(error)

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Tradrly Electron Startup</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #eef2f7;
            color: #061827;
          }
          main {
            width: min(760px, calc(100vw - 48px));
            padding: 32px;
            border-radius: 18px;
            background: white;
            box-shadow: 0 18px 60px rgba(6, 24, 39, 0.16);
          }
          h1 {
            margin: 0 0 10px;
            font-size: 30px;
          }
          p {
            margin: 0 0 16px;
            line-height: 1.5;
            color: #41536a;
          }
          code, pre {
            font-family: Consolas, monospace;
          }
          pre {
            overflow: auto;
            padding: 16px;
            border-radius: 10px;
            background: #061827;
            color: #d9f99d;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Tradrly Electron is running</h1>
          <p>Electron opened correctly, but it could not load the React app yet.</p>
          <p>Start Vite in another terminal with <code>npm run dev</code>, then run <code>npm run electron</code> again.</p>
          <pre>${message.replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }[char]))}</pre>
        </main>
      </body>
    </html>
  `
}

function isDevServerReady(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume()
      resolve(response.statusCode >= 200 && response.statusCode < 500)
    })

    request.on('error', () => resolve(false))
    request.setTimeout(1000, () => {
      request.destroy()
      resolve(false)
    })
  })
}

async function createWindow() {
  log('[electron] Starting Tradrly desktop shell')
  log(`[electron] Dev URL: ${DEV_SERVER_URL}`)
  log(`[electron] Dist index: ${DIST_INDEX}`)

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: true,
    title: 'Tradrly',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.focus()
  mainWindow.setAlwaysOnTop(true)
  setTimeout(() => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(false)
    }
  }, 2500)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    log(`[electron] Failed to load ${validatedURL}: ${errorCode} ${errorDescription}`)
  })

  const devServerReady = !app.isPackaged && await isDevServerReady(DEV_SERVER_URL)
  log(`[electron] Vite dev server ready: ${devServerReady}`)

  if (devServerReady) {
    await mainWindow.loadURL(DEV_SERVER_URL)
    log('[electron] Loaded Vite app')
    return
  }

  try {
    await mainWindow.loadFile(DIST_INDEX)
    log('[electron] Loaded built app from dist')
  } catch (error) {
    log(`[electron] Failed to load built app: ${error.stack || error.message}`)
    await mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(renderStartupError(error))}`)
  }
}

app.whenReady().then(() => {
  log('[electron] app.whenReady resolved')
  Menu.setApplicationMenu(null)

  createWindow().catch((error) => {
    log(`[electron] Failed to create Electron window: ${error.stack || error.message}`)
    app.quit()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
