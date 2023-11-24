import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { db } from "../utils/db";
import { minutesToMs, switchIcon } from "../utils";
import { BackgroundMessages } from "../types/messages";
import manifest from "../../public/manifest.json";

// Set icon and popup title
Browser.browserAction.setTitle({ title: `${manifest.name} ${manifest.version}` });
switchIcon(db.get("games"));

// Reset errors
db.update("errors", []);

// Check for new games every x minutes
const { updateIntervalInMinutes, updateOnBrowserStart } = db.get("settings");
let gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));

// Reset update interval for new "updateIntervalInMinutes" value
const resetInterval = () => {
  const { updateIntervalInMinutes } = db.get("settings");
  clearInterval(gamesListInterval);
  gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
};

// Check for new games on browser launch
if (updateOnBrowserStart && navigator.onLine) {
  setTimeout(() => checkForNewGames(), 2000);
}

// Once game notification has been clicked, then update game state value "hasClicked" to True
Browser.notifications.onClicked.addListener((url) => {
  const game = db.find("game", { url });

  if (game) {
    db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
    Browser.tabs.create({ url: game.url });
  }
});

Browser.runtime.onMessage.addListener(async (msg: BackgroundMessages) => {
  if (msg.key === "update-interval") {
    resetInterval();
  }

  // By default it will update the rootState in popup.
  Browser.runtime.sendMessage(undefined, { key: "reload" });
});
