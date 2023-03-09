import Browser from "webextension-polyfill";
import { useEffect, useState } from "preact/hooks";
import { BrowserMessages } from "../../types/messages";
import { db } from "../../utils/db";
import { RootState } from "../../types";
import { filterGamesList } from "../../utils/game";

export const useRootState = (): RootState => {
  const [state, setState] = useState<RootState>({ games: db.get("games"), settings: db.get("settings") });
  const games = state.games && filterGamesList(state.games, state.settings);

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
    games,
  };
};
