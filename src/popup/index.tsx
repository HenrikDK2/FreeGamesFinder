import { ComponentChildren, FunctionComponent, render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { IMessageFreeGames } from "../types/runtimeMessage";
import { setup } from "goober";
import { GlobalStyles } from "./components/GlobalStyles";
import { HomeScreen } from "./screens/Home";
import { getStorage } from "../utils";

setup(h);

interface AppProps {
  children?: ComponentChildren;
}

export const App: FunctionComponent<AppProps> = () => {
  const [freeGames, setFreeGames] = useState<IFreeGame[] | undefined>(getStorage<IFreeGame[]>("games"));

  useEffect(() => {
    const getFreeGamesData = ({ msg, data }: IMessageFreeGames) => {
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
