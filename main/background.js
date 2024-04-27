import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

import * as fs from "fs";

const isProd = process.env.NODE_ENV === "production"

if (isProd) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow("main", {
    width: 1520,
    height: 980,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  if (isProd) {
    await mainWindow.loadURL("app://./home")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
  }
})()

app.on("window-all-closed", () => {
  app.quit()
})

ipcMain.on("characters", async (event, arg) => {
  event.reply("characters", "")
})

ipcMain.on("monsters", async (event, arg) => {
  event.reply("monsters", "")
})

ipcMain.on("classes", async (event, arg) => {
  event.reply("classes", "")
})

ipcMain.on("races", async (event, arg) => {
  event.reply("races", "")
})

ipcMain.on("items", async (event, arg) => {
  event.reply("items", "")
})
