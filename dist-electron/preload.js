"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  onMenuAction: (callback) => {
    electron.ipcRenderer.on("menu-action", (_event, action) => callback(action));
  }
});
