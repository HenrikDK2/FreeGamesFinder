import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { getGame, getGames, getSettings, updateGameState } from "./../utils/storage";
import { minutesToMs, switchIcon } from "../utils";

const { updateIntervalInMinutes, updateOnBrowserStart } = getSettings();
let gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));

switchIcon(getGames());
if (updateOnBrowserStart) checkForNewGames();

Browser.notifications.onClicked.addListener((title) => {
  const game = getGame(title);

  if (game) {
    updateGameState(game, { hasClicked: true });
    Browser.tabs.create({ url: game.url });
  }
});

// Update popup games data when storage is updated
window.addEventListener("storage", (e) => {
  Browser.runtime.sendMessage(undefined, "update");
  const { updateIntervalInMinutes } = getSettings();

  if (e.key === "settings") {
    clearInterval(gamesListInterval);
    gamesListInterval = setInterval(checkForNewGames, minutesToMs(updateIntervalInMinutes));
  }
});
