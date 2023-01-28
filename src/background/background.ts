import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { getGame, getSettings, updateGameState } from "./../utils/storage";

const { updateIntervalInMinutes, updateOnBrowserStart } = getSettings();

if (updateOnBrowserStart) checkForNewGames();
let gamesListInterval = setInterval(checkForNewGames, updateIntervalInMinutes);

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

  if (e.key === "settings") {
    clearInterval(gamesListInterval);
    gamesListInterval = setInterval(checkForNewGames, getSettings().updateIntervalInMinutes);
  }
});
