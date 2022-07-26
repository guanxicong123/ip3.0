"use strict";
import path from "path";
import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment =
  process.env.NODE_ENV !== "production"
    ? "http://172.16.21.10:8003"
    : `file://${__dirname}/index.html`;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 320,
    height: 530,
    resizable: false, //窗口是否可以由用户手动调整大小的属性
    autoHideMenuBar: true, //是否隐藏菜单
    frame: false, //false为无边框窗口
    transparent: true, //使窗口 透明。 默认值为 false. 在Windows上，仅在无边框窗口下起作用。
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"), //预加载
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  // 定义calendar窗体
  let calendarWin;
  // 创建calendar窗口方法
  function openCalendarWindow() {
    calendarWin = new BrowserWindow({
      width: 450,
      height: 260,
      parent: win, // win是主窗口
      resizable: false, //窗口是否可以由用户手动调整大小的属性
      autoHideMenuBar: true, //是否隐藏菜单
      // frame: false, //false为无边框窗口
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    calendarWin.loadURL(isDevelopment + "/register");
    calendarWin.on("closed", () => {
      calendarWin = null;
    });
  }

  ipcMain.on("register-window", () => {
    openCalendarWindow();
  });
  // ipcMain 修改主进程，监听渲染进程的消息，并根据消息执行相应的动作
  // open-devtools
  ipcMain.on("open-devtools", () => {
    win.webContents.openDevTools();
  });
  // close
  ipcMain.on("close", () => {
    win.close();
  });
  // minimize
  ipcMain.on("minimize", () => {
    win.minimize();
  });
  // maximize
  ipcMain.on("maximize", () => {
    win.maximize();
  });
  /**
   *   unmaximize
   * isMaximized(): 判断窗口是否最大化
   * isNormal(): 窗口是否处于正常状态（未最大化，未最小化，不在全屏模式下）
   * restore()：将窗口从最小化状态恢复到以前的状态
   * center()：将窗口移动到屏幕中央
   */
  ipcMain.on("unmaximize", () => {
    const isMax = win.isMaximized();
    const isNor = win.isNormal();
    if (isMax) {
      win.unmaximize();
    }
    if (isNor) {
      // 窗口变大后，拖拽区域双击不能使窗口变小，但win.isNormal()还是处于正常状态，需要执行以下逻辑，使窗口恢复
      win.restore();
      win.unmaximize();
      win.center();
    }
  });
  // setFullScreen
  ipcMain.on("setFullScreen", () => {
    win.setFullScreen(true);
  });
  /**
   * login-window：登录界面
   * main-window：登录后主体界面
   * setResizable：设置是否可以由用户手动调整窗口的大小
   * setSize：将窗口调整为width和的大小height。如果width或height低于任何设置的最小大小限制，则窗口将捕捉到其最小大小。
   * setMinimumSize：将窗口的最小大小设置为width和height。
   */
  ipcMain.on("login-window", () => {
    win.setMinimumSize(320, 530);
    win.setSize(320, 530);
    win.center();
    win.setResizable(true);
  });
  ipcMain.on("main-window", (e, value) => {
    // 渲染进程传值，设置记住的宽高
    const isTrue = value && (value.width || value.height);
    const width = isTrue ? Number(value.width) : 1280;
    const height = isTrue ? Number(value.height) : 768;
    win.setSize(width, height);
    win.center();
    win.setResizable(true);
    win.setMinimumSize(1280, 720);
  });
  ipcMain.on("main-window", (e, value) => {
    // 渲染进程传值，设置记住的宽高
    const isTrue = value && (value.width || value.height);
    const width = isTrue ? Number(value.width) : 1280;
    const height = isTrue ? Number(value.height) : 768;
    win.setSize(width, height);
    win.center();
    win.setResizable(true);
    win.setMinimumSize(1024, 600);
  });
  // 窗口移动的监听事件
  win.on("resize", () => {
    const sizeData = win.getContentBounds();
    win.webContents.send(
      "on-resize",
      JSON.stringify(sizeData),
      win.isMaximized()
    );
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS3_DEVTOOLS)
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}