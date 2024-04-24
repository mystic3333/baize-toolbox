import {
  app,
  globalShortcut,
  BrowserWindow,
  desktopCapturer,
  screen,
} from "electron";
import { createWin } from "../../helper";
import { showCustomMenu } from "./MenuManger";

let screenShotWin: BrowserWindow | null = null;
app.whenReady().then(async () => {
  screenShotWin = await createWin({
    config: {
      frame: false,
      // resizable: false,
      transparent: true,
      alwaysOnTop: true,
      show: false,
    },
    url: "/siteAssistTransprent/index.html#/screen-shot-win",
  });
  screenShotWin.on("ready-to-show", () => {
    showCustomMenu(screenShotWin);
  });
  escape();
  registerScreenShot();
});

// 退出
const escape = () => {
  globalShortcut.register("Escape", () => {
    console.log("Escape is pressed");
    screenShotWin.setSimpleFullScreen(false);
    screenShotWin.hide();
  });
};

const registerScreenShot = () => {
  // 注册截图快捷键
  globalShortcut.register("Alt+S", async () => {
    console.log("Alt+S is pressed");
    const mousePoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(mousePoint);
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    console.log(display, width, height);
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: display.size,
    });
    const source = sources.find((source) => {
      return source.display_id === String(display.id);
    });
    // screenShotWin.setBounds(display.bounds);
    screenShotWin.setSize(display.size.width, display.size.height);
    screenShotWin.setPosition(display.bounds.x, display.bounds.y);
    screenShotWin.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
    });
    screenShotWin.setSimpleFullScreen(true);
    screenShotWin.show();
    screenShotWin.webContents.send("GET_SCREEN_SHOT_STREAM", {
      source: source,
    });
  });
};