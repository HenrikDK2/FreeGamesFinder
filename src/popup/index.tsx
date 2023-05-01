import "./global.css";
import Router from "preact-router";
import { FunctionComponent, render, h } from "preact";
import { HomeScreen } from "./screens/Home";
import { setup } from "goober";
import { SettingsScreen } from "./screens/Settings";
import { useRootState } from "./hooks/useRootState";
import { ErrorProvider } from "./components/ErrorProvider";

setup(h);

export const App: FunctionComponent = () => {
  const state = useRootState();

  return (
    <>
      <ErrorProvider />
      <Router>
        <HomeScreen default path="/" state={state} />
        <SettingsScreen path="/settings" settings={state.settings} />
      </Router>
    </>
  );
};

render(<App />, document.body);
