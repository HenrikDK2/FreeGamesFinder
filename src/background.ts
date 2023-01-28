import Browser from "webextension-polyfill";
import { checkForNewGames } from "./utils/notification";
import { getStorage, updateGame } from "./utils";
import { IFreeGame } from "./types/freegames";

Browser.notifications.onClicked.addListener((id) => {
  const game = getStorage<IFreeGame>(id);

  if (game) {
    updateGame({ ...game, state: { hasClicked: true, hasSendNotification: true } });
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
