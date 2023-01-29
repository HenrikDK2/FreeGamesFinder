import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { db } from "./../utils/storage";
import { minutesToMs, switchIcon } from "../utils";

const { updateIntervalInMinutes, updateOnBrowserStart } = db.get("settings");
let gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
const resetInternal = () => {
  const { updateIntervalInMinutes } = db.get("settings");
  clearInterval(gamesListInterval);
  gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
};

switchIcon(db.get("games"));
if (updateOnBrowserStart) checkForNewGames();

Browser.notifications.onClicked.addListener((title) => {
  const game = db.find("game", { title });

  if (game) {
    db.update("game", { ...game, state: { ...game.state, hasClicked: true } });
    Browser.tabs.create({ url: game.url });
  }
});

Browser.runtime.onMessage.addListener(async (type, _) => {
  if (type === "reload") {
    resetInternal();
    await checkForNewGames();
    return Promise.resolve("done");
  }
  return;
});

// Update popup games data when storage is updated
window.addEventListener("storage", (e) => {
  Browser.runtime.sendMessage(undefined, "update");

  if (e.key === "settings") resetInternal();
});
