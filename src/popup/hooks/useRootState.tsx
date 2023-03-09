import Browser from "webextension-polyfill";
import { useEffect, useState } from "preact/hooks";
import { BrowserMessages } from "../../types/messages";
import { db } from "../../utils/db";
import { RootState } from "../../types";

export const useRootState = (): RootState => {
  const [state, setState] = useState<RootState>({ games: db.get("games"), settings: db.get("settings") });

  useEffect(() => {
    const messages = ({ key }: BrowserMessages) => {
      if (key === "reload") {
        setState({ games: db.get("games"), settings: db.get("settings") });
      }
    };

    Browser.runtime.onMessage.addListener(messages);
    return () => Browser.runtime.onMessage.removeListener(messages);
  }, []);

  return {
    settings: state.settings,
    games: state.games?.filter((game) => {
      if (game.state.hasClicked && state.settings.hideClickedGames === true) {
        return false;
      }

      if (state.settings.drmFreeGames === false) {
        if (game.platform === "GX.games") return false;
        if (game.platform === "IndieGala") return false;
        if (game.platform === "itch.io") return false;
      }

      return true;
    }),
  };
};
