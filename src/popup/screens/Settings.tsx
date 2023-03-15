import { ComponentChildren, FunctionComponent } from "preact";
import { Layout } from "../components/Layout";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { css } from "goober";
import { ISettings } from "../../types/settings";
import { db } from "../../utils/db";
import { Accordion } from "../components/Accordion";
import { EnumPlatform, Platform } from "../../types/freegames";

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

const layoutClassName = css`
  padding: 0 0 80px 0 !important;
`;

const accordionContentClassName = css`
  display: flex;
  margin: 1rem 0;
  padding: 0 1rem;
  box-sizing: border-box;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ settings }) => {
  const platformHandler = (platform: Platform) => {
    if (settings.showPlatforms.includes(platform)) {
      const index = settings.showPlatforms.indexOf(platform);
      const showPlatforms = settings.showPlatforms.slice();
      showPlatforms.splice(index, 1);

      db.update("settings", { showPlatforms });
    } else {
      db.update("settings", { showPlatforms: [...settings.showPlatforms, platform] });
    }

    // Don't show notifications for games
    const { showPlatforms } = db.get("settings");

    const gamesWithUpdatedState = db.get("games").map((game) => {
      if (game.platform && showPlatforms.includes(game.platform)) {
        game.state.hasSendNotification = true;
      }

      return game;
    });

    db.update("games", gamesWithUpdatedState);
  };

  return (
    <Layout className={layoutClassName}>
      <Accordion text="general" contentClassName={accordionContentClassName}>
        <Checkbox
          onClick={() => db.update("settings", { hideClickedGames: !settings.hideClickedGames })}
          isChecked={settings.hideClickedGames}
          label="Hide claimed games from list"
        />

        <Checkbox
          onClick={() => db.update("settings", { notifications: !settings.notifications })}
          isChecked={settings.notifications}
          label="Show browser notifications"
        />
      </Accordion>

      <Accordion text="Updates" contentClassName={accordionContentClassName}>
        <Select
          id="updateIntervalInMinutes"
          onChange={onChangeHandler}
          label="Check for new games every"
          items={Object.values(refItems)}
          value={refItems[`${settings.updateIntervalInMinutes}`]}
        />
        <Checkbox
          onClick={() => db.update("settings", { updateOnBrowserStart: !settings.updateOnBrowserStart })}
          isChecked={settings.updateOnBrowserStart}
          label="Update on browser start"
        />
      </Accordion>

      <Accordion text="Platforms" contentClassName={accordionContentClassName}>
        {Object.values(EnumPlatform).map((str) => {
          const platform = str as Platform;

          if (typeof platform !== "number") {
            return (
              <Checkbox
                onClick={() => platformHandler(platform)}
                isChecked={settings.showPlatforms.includes(platform)}
                label={platform}
              />
            );
          }
        })}
      </Accordion>
    </Layout>
  );
};
