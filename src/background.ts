import Browser from "webextension-polyfill";
import { RuntimeMessages, IMessageFreeGames } from "./types/runtimeMessage";
import { getGames } from "./utils/getGames";
import { checkForNewGames } from "./utils/notification";
import { getStorage, updateGame } from "./utils";
import { IFreeGame } from "./types/freegames";

Browser.runtime.onMessage.addListener(async ({ msg }: { msg: RuntimeMessages }) => {
  if (msg === "get-free-games") {
    const data = await getGames();
    const message: IMessageFreeGames = {
      data,
      status: data ? "success" : "error",
      msg,
    };

    Browser.runtime.sendMessage(undefined, message);
  }

  return true;
});

Browser.notifications.onClicked.addListener((id) => {
  const game = getStorage<IFreeGame>(id);

  if (game) {
    updateGame({ ...game, state: { hasClicked: true, hasSendNotification: true } });
    Browser.tabs.create({ url: game.url });
  }
});

// On browser load check for new games
checkForNewGames();

// Check every hour
const getMinutes = (number: number) => 1000 * number * 60;
setInterval(checkForNewGames, getMinutes(60));
