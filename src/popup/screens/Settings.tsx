import { ComponentChildren, FunctionComponent } from "preact";
import { Layout } from "../components/Layout";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { styled } from "goober";
import { ISettings } from "../../types/settings";
import { updateSettings } from "../../utils/storage";

interface SettingsScreenProps {
  children?: ComponentChildren;
  settings: ISettings;
}

const Container = styled("section")`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const refItems = {
  30: "30 Minutes",
  60: "1 Hours",
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

export const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ settings }) => {
  return (
    <Layout>
      <Container>
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
          label="Hide opened games from list"
        />
        <Checkbox
          onClick={() => updateSettings({ updateOnBrowserStart: !settings.updateOnBrowserStart })}
          isChecked={settings.updateOnBrowserStart}
          label="Update games list on browser start"
        />
      </Container>
    </Layout>
  );
};
