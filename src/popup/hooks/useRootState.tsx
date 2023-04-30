import { useState } from "preact/hooks";
import { db } from "../../utils/db";
import { RootState } from "../../types";
import { filterGamesList } from "../../utils/game";
import { useBrowserRuntimeMsg } from "./useBrowserRuntimeMsg";

export const useRootState = (): RootState => {
  const [state, setState] = useState<RootState>({ games: db.get("games"), settings: db.get("settings") });
  const games = state.games && filterGamesList(state.games, state.settings);

  useBrowserRuntimeMsg((props) => {
    if (props.key === "reload") {
      setState({ games: db.get("games"), settings: db.get("settings") });
    }
  });

  return {
    settings: state.settings,
    games,
  };
};
