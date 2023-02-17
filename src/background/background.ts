import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { db } from "../utils/db";
import { minutesToMs } from "../utils";
import { BackgroundMessages } from "../types/messages";
import manifest from "../../public/manifest.json";

// Set popup title
Browser.browserAction.setTitle({ title: `${manifest.name} ${manifest.version}` });

const { updateIntervalInMinutes, updateOnBrowserStart } = db.get("settings");
let gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));

const resetInternal = () => {
  const { updateIntervalInMinutes } = db.get("settings");
  clearInterval(gamesListInterval);
  gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
};

const browserUpdate = async () => {
  resetInternal();
  await checkForNewGames();
  Browser.runtime.sendMessage(undefined, { key: "reload" });
  return Promise.resolve("done");
};

if (updateOnBrowserStart) checkForNewGames();

Browser.notifications.onClicked.addListener((title) => {
  const game = db.find("game", { title });

  if (game) {
    db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
    Browser.tabs.create({ url: game.url });
  }
});

Browser.runtime.onMessage.addListener(async (msg: BackgroundMessages) => {
  console.log(JSON.stringify(msg));
  switch (msg.key) {
    case "update": {
      return browserUpdate();
    }

    case "reload": {
      Browser.runtime.sendMessage(undefined, { key: "reload" });
    }

    case "settings": {
      resetInternal();
      Browser.runtime.sendMessage(undefined, { key: "reload" });
      if ("update" in msg && msg.update) browserUpdate();
    }

    default: {
      return true;
    }
  }
});
