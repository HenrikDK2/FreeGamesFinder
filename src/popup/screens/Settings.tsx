import { ComponentChildren, FunctionComponent } from "preact";
import { Layout } from "../components/Layout";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { css, styled } from "goober";
import { ISettings } from "../../types/settings";
import { updateSettings } from "../../utils/storage";
import manifest from "../../../public/manifest.json";

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
    updateSettings({ updateIntervalInMinutes: entry[0] as unknown as ISettings["updateIntervalInMinutes"] });
  }
};

const Version = styled("p")`
  text-align: center;
  font-weight: 500;
  color: var(--text-color);
  user-select: none;
  margin: auto 0 2rem 0;
`;

const layoutClassName = css`
  gap: 1.5rem;
`;

export const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ settings }) => {
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
        onClick={() => updateSettings({ hideClickedGames: !settings.hideClickedGames })}
        isChecked={settings.hideClickedGames}
        label="Hide claimed games from list"
      />
      <Checkbox
        onClick={() => updateSettings({ updateOnBrowserStart: !settings.updateOnBrowserStart })}
        isChecked={settings.updateOnBrowserStart}
        label="Update games list on browser start"
      />
      <Version>Version {manifest.version}</Version>
    </Layout>
  );
};
