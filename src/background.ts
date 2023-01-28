import Browser from "webextension-polyfill";
import { IGetFreeGames, RuntimeMessages } from "./types/runtimeMessage";
import { getGames } from "./utils/getGames";
import { checkForNewGames } from "./utils/notification";
import { getLocalStorage, sortGames, switchIcon } from "./utils";
import { FreeGamesData } from "./types/freegames";

Browser.runtime.onMessage.addListener(async ({ msg }: { msg: RuntimeMessages }) => {
  if (msg === "get-free-games") {
    const data = await getGames();
    const message: IGetFreeGames = {
      data,
      status: data ? "success" : "error",
      msg,
    };

    Browser.runtime.sendMessage(undefined, message);
  }

  return true;
});

Browser.notifications.onClicked.addListener((id) => {
  const url = sessionStorage.getItem(id);
  const games = getLocalStorage("games") as FreeGamesData;

  // Save that the current game has been clicked
  if (games) {
    const state = { hasClicked: true, hasSendNotification: true };
    const newGames = games.map((game) => (game.url === url ? { ...game, state } : game));
    localStorage.setItem("games", JSON.stringify(sortGames(newGames)));
    switchIcon(newGames);
  }

  // Open url in a new tab
  if (url) Browser.tabs.create({ url });
});

// On browser load check for new games
checkForNewGames();

// Check every hour
const getMinutes = (number: number) => 1000 * number * 60;
setInterval(checkForNewGames, getMinutes(60));
