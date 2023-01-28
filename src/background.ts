import Browser from "webextension-polyfill";
import { IGetFreeGames, RuntimeMessages } from "./types/runtimeMessage";
import { getGames } from "./utils/getGames";
import { checkForNewGames } from "./utils/notification";
import { getStorage, setGameData } from "./utils";

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
  const game = getStorage(id);

  // Update game state
  if (game) {
    setGameData({ ...game, state: { hasClicked: true, hasSendNotification: true } });
  }

  // Open url in a new tab
  if (game.url) Browser.tabs.create({ url: game.url });
});

// On browser load check for new games
checkForNewGames();

// Check every hour
const getMinutes = (number: number) => 1000 * number * 60;
setInterval(checkForNewGames, getMinutes(60));
