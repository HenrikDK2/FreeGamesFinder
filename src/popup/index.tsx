import "./global.css";
import Browser from "webextension-polyfill";
import Router from "preact-router";
import { FunctionComponent, render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { HomeScreen } from "./screens/Home";
import { BrowserMessages } from "../types/messages";
import { setup } from "goober";
import { SettingsScreen } from "./screens/Settings";
import { getGames, getSettings } from "../utils/storage";
import { RootState } from "../types";
setup(h);

export const App: FunctionComponent = () => {
  const [state, setState] = useState<RootState>({ games: getGames(), settings: getSettings() });

  useEffect(() => {
    const messages = (msg: BrowserMessages) => {
      if (msg === "update") {
        setState({ games: getGames(), settings: getSettings() });
      }
    };

    Browser.runtime.onMessage.addListener(messages);
    return () => Browser.runtime.onMessage.removeListener(messages);
  }, []);

  return (
    <Router>
      <HomeScreen default path="/" state={state} />
      <SettingsScreen path="/settings" settings={state.settings} />
    </Router>
  );
};

render(<App />, document.body);
