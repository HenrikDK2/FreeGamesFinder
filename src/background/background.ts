import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { db } from "../utils/db";
import { minutesToMs } from "../utils";
import { BackgroundMessages } from "../types/messages";
import manifest from "../../public/manifest.json";

// Set popup title
Browser.browserAction.setTitle({ title: `${manifest.name} ${manifest.version}` });

// Check for new games every x minutes
const { updateIntervalInMinutes, updateOnBrowserStart } = db.get("settings");
let gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));

// Check for new games on browser launch
if (updateOnBrowserStart) checkForNewGames();

const resetInterval = () => {
  const { updateIntervalInMinutes } = db.get("settings");
  clearInterval(gamesListInterval);
  gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
};

// Once game notification has been clicked, then update game state value "hasClicked" to True
Browser.notifications.onClicked.addListener((url) => {
  const game = db.find("game", { url });

  if (game) {
    db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
    Browser.tabs.create({ url: game.url });
  }
});

Browser.runtime.onMessage.addListener(async (msg: BackgroundMessages) => {
  switch (msg.key) {
    case "reload": {
      Browser.runtime.sendMessage(undefined, { key: "reload" });
    }

    case "settings": {
      resetInterval();
      Browser.runtime.sendMessage(undefined, { key: "reload" });
    }

    default: {
      return true;
    }
  }
});
