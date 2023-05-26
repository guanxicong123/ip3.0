"use strict";
import path from "path";
import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { startCarashReporter, printCrashLogPath } from "./crashReport";
// import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

// TS接口-定义类型
interface formData {
  downloadPath: string;
  fileName: string;
  savedPath: any;
}
// 定义下载对象变量
let downloadObj = <formData>{
  downloadPath: "", // 要下载的链接或文件
  fileName: "", // 要保存的文件名，需要带文件后缀名
  savedPath: "", // 要保存的路径
};
// 重置下载对象
const resetDownloadObj = () => {
  downloadObj = {
    downloadPath: "",
    fileName: "",
    savedPath: "",
  };
};
// 开启崩溃日志收集
startCarashReporter();
const isDevelopment =
  process.env.NODE_ENV !== "production"
    ? "http://127.0.0.1:8010"
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
    icon: path.join(__dirname, "../public/icons/ip.ico"),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"), //预加载
      webSecurity: false,
    },
  });
  printCrashLogPath(win);
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
  let calendarWin: any = null;
  // 创建calendar窗口方法
  const openCalendarWindow = (name: any) => {
    calendarWin = new BrowserWindow({
      width: 450,
      height: 260,
      parent: win, // win是主窗口
      modal: false,
      resizable: false, //窗口是否可以由用户手动调整大小的属性
      autoHideMenuBar: true, //是否隐藏菜单
      frame: false, //false为无边框窗口
      transparent: true, //使窗口 透明。 默认值为 false. 在Windows上，仅在无边框窗口下起作用。
      icon: path.join(__dirname, "../public/icons/ip.ico"),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        webSecurity: false,
      },
    });
    calendarWin.loadURL(isDevelopment + `#/register?name=${name}`);

    calendarWin.on("closed", () => {
      calendarWin = null;
    });

    calendarWin.on("imgUploadMsgFromMain", (event: any, message: any) => {
      console.log(message);
    });
  };
  ipcMain.on("register-window", (event: any, name) => {
    if (calendarWin) return calendarWin.show();
    openCalendarWindow(name);
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

  // close
  ipcMain.on("register-close", () => {
    calendarWin.close();
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
    win.setResizable(false);
    win.setSize(320, 530);
    win.center();
  });
  ipcMain.on("set-login-window-size", () => {
    win.setSize(320, 530);
    win.center();
  });
  ipcMain.on("main-window", (e, value) => {
    // 渲染进程传值，设置记住的宽高
    const isTrue = value && (value.width || value.height);
    const width = isTrue ? Number(value.width) : 1280;
    const height = isTrue ? Number(value.height) : 720;
    win.setSize(width, height);
    win.center();
    win.setResizable(true);
    win.setMinimumSize(1280, 620);
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
  // 窗口F11的监听事件
  // 保存全屏之前的窗口大小
  const F11Size = {
    width: 0,
    height: 0,
  };
  // 防止用户快速点击F11,
  let setPrevSize = 0;
  // 仅适用与F11全屏操作，
  // 当前是否为全屏状态
  let winIsFullScreenFlog = false;
  win.on("enter-full-screen", () => {
    winIsFullScreenFlog = !winIsFullScreenFlog;
    if (winIsFullScreenFlog && setPrevSize === 0) {
      F11Size.width = win.getSize()[0];
      F11Size.height = win.getSize()[1];
      setPrevSize = 1;
    }
    setTimeout(() => {
      if (!winIsFullScreenFlog) {
        win.setSimpleFullScreen(false);
      }
    }, 500);
  });
  // 通过win.setSimpleFullScreen(false)，可触发这个事件
  win.on("leave-full-screen", () => {
    setTimeout(() => {
      win.setSize(F11Size.width, F11Size.height);
      win.center();
      setPrevSize = 0;
    });
  });
  ipcMain.on("register-success", () => {
    win.webContents.send("register-success", 1);
  });
  // 监听渲染进程发出的download事件
  ipcMain.on("download", (evt, args) => {
    downloadObj.downloadPath = args.downloadPath;
    downloadObj.fileName = args.fileName;
    const ext = path.extname(downloadObj.fileName);
    const filters = [{ name: "all files", extensions: ["*"] }];
    if (ext && ext !== ".") {
      const text = ext.match(/[a-zA-Z]+$/) || [""];
      filters.unshift({
        name: "",
        extensions: [text[0]],
      });
    }
    // 弹出另存为弹框，用于获取保存路径
    dialog
      .showSaveDialog(win, {
        filters,
        defaultPath: downloadObj.fileName,
      })
      .then((result) => {
        downloadObj.savedPath = result.filePath;
        if (downloadObj.savedPath) {
          win.webContents.downloadURL(downloadObj.downloadPath); // 触发will-download事件
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  // will-download
  win.webContents.session.on("will-download", (event, item) => {
    // 无需对话框提示， 直接将文件保存到路径
    item.setSavePath(downloadObj.savedPath);
    // 当下载正在执行但还没完成的时候发出
    item.on("updated", (event, state) => {
      if (state === "interrupted") {
        // 下载已经中断，可以恢复
        console.log("Download is interrupted but can be resumed");
      } else if (state === "progressing") {
        // 下载正在进行中
        // item.isPaused() 暂停状态
        if (item.isPaused()) {
          console.log("Download is paused");
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
          // 如果想要通知渲染进程中，这个就可能存在一个win不存在的异常。
          if (win.isDestroyed()) {
            return;
          }
          // 已经下载的进度百分比
          const data =
            ((item.getReceivedBytes() / item.getTotalBytes()) * 100).toFixed(
              2
            ) + "%";
          // 在任务栏图标上面显示下载进度
          win.webContents.send("download-progress", {
            name: item.getFilename(),
            receive: item.getReceivedBytes(),
            total: item.getTotalBytes(),
            status: data,
          });
          win.setProgressBar(Number(data));
          // win.setProgressBar(-1) // 不显示进度
        }
      }
    });
    // 当下载处于终止态时触发。 包括下载完成，取消下载 (通过 downloadItem.cancel())，以及无法恢复的中断下载。
    item.once("done", (event, state) => {
      if (state === "completed") {
        // 下载成功完成
        // 如果想要通知渲染进程中，这个就可能存在一个win不存在的异常。
        if (win.isDestroyed()) {
          return;
        }
        // 已经下载的进度百分比
        const data =
          ((item.getReceivedBytes() / item.getTotalBytes()) * 100).toFixed(2) +
          "%";
        // 在任务栏图标上面显示下载进度
        win.webContents.send("download-done", {
          name: item.getFilename(),
          receive: item.getReceivedBytes(),
          total: item.getTotalBytes(),
          status: data,
        });
        // 不显示进度
        win.setProgressBar(-1);
        // 下载成功后打开文件所在文件夹
        // shell.showItemInFolder(downloadObj.savedPath)
        // win.setProgressBar(Number(data))
        console.log("Download successfully", item.getFilename());
      } else if (state == "cancelled") {
        // 下载已被取消
        win.webContents.send("download-cancell", {
          name: item.getFilename(),
        });
        console.log("Download cancelled");
      } else {
        win.webContents.send("download-failed", {
          name: item.getFilename(),
        });
        console.log(`Download failed: ${state}`);
      }
      resetDownloadObj();
    });
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
