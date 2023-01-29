import { ComponentChildren, FunctionComponent } from "preact";
import { Layout } from "../components/Layout";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { css, styled } from "goober";
import { ISettings } from "../../types/settings";
import { db } from "../../utils/storage";
import manifest from "../../../public/manifest.json";
import Browser from "webextension-polyfill";
import { useState } from "preact/hooks";
import { IoReloadCircle } from "react-icons/io5";

interface SettingsScreenProps {
  children?: ComponentChildren;
  settings: ISettings;
}

const refItems = {
  30: "30 Minutes",
  60: "Hour",
  180: "3 Hours",
  360: "6 Hours",
  720: "12 Hours",
};

const onChangeHandler = (e: string) => {
  const entry = Object.entries(refItems).find(([_, value]) => e === value);
  if (entry) {
    db.update("settings", { updateIntervalInMinutes: entry[0] as unknown as ISettings["updateIntervalInMinutes"] });
  }
};

const Version = styled("p")`
  text-align: center;
  font-weight: 500;
  color: var(--text-color);
  user-select: none;
  opacity: 0.3;
  margin-bottom: 2rem;
`;

const layoutClassName = css`
  gap: 1.5rem;
`;

const ReloadButton = styled("button")`
  appearance: none;
  cursor: pointer;
  display: block;
  background-color: transparent;
  font-size: 3rem;
  border: none;
  color: var(--text-color);
  opacity: 0.5;
  text-align: center;
  width: fit-content;
  margin: auto auto 0;
  transition: all 0.2s ease;
  &:hover {
    opacity: 1;
  }

  &[data-spin="true"] {
    opacity: 1;
    svg {
      animation: spin 1s ease infinite;
    }
  }
`;

export const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ settings }) => {
  const [buttonSpin, setButtonSpin] = useState(false);

  return (
    <Layout className={layoutClassName}>
      <Select
        id="updateIntervalInMinutes"
        onChange={onChangeHandler}
        label="Check for new games every"
        items={Object.values(refItems)}
        value={refItems[`${settings.updateIntervalInMinutes}`]}
      />
      <Checkbox
        onClick={() => db.update("settings", { hideClickedGames: !settings.hideClickedGames })}
        isChecked={settings.hideClickedGames}
        label="Hide claimed games from list"
      />
      <Checkbox
        onClick={() => db.update("settings", { updateOnBrowserStart: !settings.updateOnBrowserStart })}
        isChecked={settings.updateOnBrowserStart}
        label="Update games list on browser start"
      />
      <ReloadButton
        data-spin={buttonSpin}
        onClick={() => {
          setButtonSpin(true);
          Browser.runtime.sendMessage(undefined, "reload").finally(() => setButtonSpin(false));
        }}
      >
        <IoReloadCircle />
      </ReloadButton>
      <Version>Version {manifest.version}</Version>
    </Layout>
  );
};
