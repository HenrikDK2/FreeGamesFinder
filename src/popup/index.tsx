import "./global.css";
import Browser from "webextension-polyfill";
import Router from "preact-router";
import { FunctionComponent, render, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { HomeScreen } from "./screens/Home";
import { BrowserMessages } from "../types/messages";
import { setup } from "goober";
import { SettingsScreen } from "./screens/Settings";
import { db } from "../utils/db";
import { RootState } from "../types";
setup(h);

export const App: FunctionComponent = () => {
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

  return (
    <Router>
      <HomeScreen default path="/" state={state} />
      <SettingsScreen path="/settings" settings={state.settings} />
    </Router>
  );
};

render(<App />, document.body);
