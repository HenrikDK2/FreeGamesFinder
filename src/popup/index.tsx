import { ComponentChildren, FunctionComponent, render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IFreeGame } from "../types/freegames";
import { setup } from "goober";
import { GlobalStyles } from "./components/GlobalStyles";
import { HomeScreen } from "./screens/Home";
import { getStorage } from "../utils";
import Browser from "webextension-polyfill";
import { BrowserMessages } from "../types/messages";

setup(h);

interface AppProps {
  children?: ComponentChildren;
}

export const App: FunctionComponent<AppProps> = () => {
  const [freeGames, setFreeGames] = useState<IFreeGame[] | undefined>(getStorage<IFreeGame[]>("games"));

  useEffect(() => {
    const messages = (msg: BrowserMessages) => {
      if (msg === "update") setFreeGames(getStorage<IFreeGame[]>("games"));
    };

    Browser.runtime.onMessage.addListener(messages);
    return () => Browser.runtime.onMessage.removeListener(messages);
  }, []);

  return (
    <>
      <GlobalStyles />
      <HomeScreen freeGames={freeGames} />
    </>
  );
};

render(<App />, document.body);
