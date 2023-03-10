const { contextBridge, ipcRenderer } = require('electron');

// 安全地将 Electron API 暴露给渲染进程
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
});
