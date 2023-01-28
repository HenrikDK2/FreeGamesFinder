import { ComponentChildren, FunctionComponent, render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import { FreeGamesData } from "../types/freegames";
import { IGetFreeGames } from "../types/runtimeMessage";
import { setup } from "goober";
import { GlobalStyles } from "./components/GlobalStyles";
import { HomeScreen } from "./screens/Home";
import { getLocalStorage, switchIcon } from "../utils";

setup(h);

interface AppProps {
  children?: ComponentChildren;
}

export const App: FunctionComponent<AppProps> = () => {
  const [freeGames, setFreeGames] = useState<FreeGamesData>(getLocalStorage("games"));

  useEffect(() => {
    const getFreeGamesData = ({ msg, data }: IGetFreeGames) => {
      if (msg === "get-free-games" && data) {
        setFreeGames(data);
        localStorage.setItem("games", JSON.stringify(data));
      }
    };

    Browser.runtime.onMessage.addListener(getFreeGamesData);
    return () => Browser.runtime.onMessage.removeListener(getFreeGamesData);
  }, []);

  return (
    <>
      <GlobalStyles />
      <HomeScreen freeGames={freeGames} />
    </>
  );
};

render(<App />, document.body);
