import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = join(fileURLToPath(import.meta.url), '..')

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: 'default',
    show: false,
  })

  // Maximizar a janela na inicialização
  mainWindow.maximize()

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

// Menu personalizado
const createMenu = () => {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Nova Venda',
          accelerator: 'Ctrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-sale')
          }
        },
        { type: 'separator' },
        {
          label: 'Backup',
          click: () => {
            mainWindow.webContents.send('menu-action', 'backup')
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Cadastros',
      submenu: [
        {
          label: 'Produtos',
          accelerator: 'Ctrl+P',
          click: () => {
            mainWindow.webContents.send('menu-action', 'products')
          }
        },
        {
          label: 'Clientes',
          accelerator: 'Ctrl+C',
          click: () => {
            mainWindow.webContents.send('menu-action', 'customers')
          }
        }
      ]
    },
    {
      label: 'Relatórios',
      submenu: [
        {
          label: 'Vendas',
          click: () => {
            mainWindow.webContents.send('menu-action', 'sales-report')
          }
        },
        {
          label: 'Estoque',
          click: () => {
            mainWindow.webContents.send('menu-action', 'stock-report')
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            mainWindow.webContents.send('menu-action', 'about')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template as any)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

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

// IPC handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})
