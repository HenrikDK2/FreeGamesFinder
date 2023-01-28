import Browser from "webextension-polyfill";
import { checkForNewGames } from "./notification";
import { getGame, updateGameState } from "./../utils";

Browser.notifications.onClicked.addListener((title) => {
  const game = getGame(title);

  if (game) {
    updateGameState(game, { hasClicked: true });
    Browser.tabs.create({ url: game.url });
  }
});

// Update popup games data when storage is updated
window.addEventListener("storage", () => {
  Browser.runtime.sendMessage(undefined, "update");
});

// On browser load check for new games
checkForNewGames();

// Check every hour
const getMinutes = (number: number) => 1000 * number * 60;
setInterval(checkForNewGames, getMinutes(60));
