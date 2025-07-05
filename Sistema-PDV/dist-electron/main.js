"use strict";
const electron = require("electron");
const path = require("path");
const url = require("url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __dirname$1 = path.join(url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href), "..");
const isDev = process.env.NODE_ENV === "development";
let mainWindow;
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1e3,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: "default",
    show: false
  });
  mainWindow.maximize();
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
};
const createMenu = () => {
  const template = [
    {
      label: "Arquivo",
      submenu: [
        {
          label: "Nova Venda",
          accelerator: "Ctrl+N",
          click: () => {
            mainWindow.webContents.send("menu-action", "new-sale");
          }
        },
        { type: "separator" },
        {
          label: "Backup",
          click: () => {
            mainWindow.webContents.send("menu-action", "backup");
          }
        },
        { type: "separator" },
        {
          label: "Sair",
          accelerator: "Ctrl+Q",
          click: () => {
            electron.app.quit();
          }
        }
      ]
    },
    {
      label: "Cadastros",
      submenu: [
        {
          label: "Produtos",
          accelerator: "Ctrl+P",
          click: () => {
            mainWindow.webContents.send("menu-action", "products");
          }
        },
        {
          label: "Clientes",
          accelerator: "Ctrl+C",
          click: () => {
            mainWindow.webContents.send("menu-action", "customers");
          }
        }
      ]
    },
    {
      label: "Relatórios",
      submenu: [
        {
          label: "Vendas",
          click: () => {
            mainWindow.webContents.send("menu-action", "sales-report");
          }
        },
        {
          label: "Estoque",
          click: () => {
            mainWindow.webContents.send("menu-action", "stock-report");
          }
        }
      ]
    },
    {
      label: "Ajuda",
      submenu: [
        {
          label: "Sobre",
          click: () => {
            mainWindow.webContents.send("menu-action", "about");
          }
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
};
electron.app.whenReady().then(() => {
  createWindow();
  createMenu();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.handle("get-app-version", () => {
  return electron.app.getVersion();
});
