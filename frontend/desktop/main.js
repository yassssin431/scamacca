const { app, BrowserWindow, Menu } = require('electron')
const fs = require('fs')
const http = require('http')
const path = require('path')

const FRONTEND_ROOT = path.join(__dirname, '..')
const DEV_SERVER_URL = 'http://localhost:5173/'
const FALLBACK_SERVER_PORT = 4173
const DIST_INDEX = path.join(FRONTEND_ROOT, 'dist', 'index.html')
const LOG_FILE = path.join(FRONTEND_ROOT, 'electron-startup.log')
const USER_DATA_DIR = path.join(FRONTEND_ROOT, '.electron-user-data')

let mainWindow = null
let staticServer = null

app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor')

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(LOG_FILE, line)
  console.log(message)
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

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase()

  const types = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  }

  return types[extension] || 'application/octet-stream'
}

function startStaticServer() {
  if (staticServer) {
    return Promise.resolve(`http://127.0.0.1:${FALLBACK_SERVER_PORT}/`)
  }

  return new Promise((resolve, reject) => {
    staticServer = http.createServer((request, response) => {
      const requestUrl = new URL(request.url, `http://127.0.0.1:${FALLBACK_SERVER_PORT}`)
      const safePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '')
      const requestedFile = path.normalize(path.join(FRONTEND_ROOT, 'dist', safePath))
      const distRoot = path.join(FRONTEND_ROOT, 'dist')
      const filePath = requestedFile.startsWith(distRoot) && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()
        ? requestedFile
        : DIST_INDEX

      response.setHeader('Content-Type', getContentType(filePath))
      fs.createReadStream(filePath).pipe(response)
    })

    staticServer.on('error', reject)
    staticServer.listen(FALLBACK_SERVER_PORT, '127.0.0.1', () => {
      const url = `http://127.0.0.1:${FALLBACK_SERVER_PORT}/`
      log(`[electron] Static dist server ready: ${url}`)
      resolve(url)
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

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    log(`[electron] Failed to load ${validatedURL}: ${errorCode} ${errorDescription}`)
  })

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    log(`[electron] Renderer process gone: ${JSON.stringify(details)}`)
  })

  const devServerReady = !app.isPackaged && await isDevServerReady(DEV_SERVER_URL)
  log(`[electron] Vite dev server ready: ${devServerReady}`)

  if (devServerReady) {
    await mainWindow.loadURL(DEV_SERVER_URL)
    log('[electron] Loaded Vite app')
    return
  }

  const fallbackUrl = await startStaticServer()
  await mainWindow.loadURL(fallbackUrl)
  log('[electron] Loaded built app from local static server')
}

app.setPath('userData', USER_DATA_DIR)

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
  if (staticServer) {
    staticServer.close()
    staticServer = null
  }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
