import { ComponentChildren, FunctionComponent } from "preact";
import { Layout } from "../components/Layout";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { css, styled } from "goober";
import { ISettings } from "../../types/settings";
import { db } from "../../utils/db";
import { Accordion } from "../components/Accordion";
import { EnumPlatform, Platform } from "../../types/freegames";
import { IoLogoGithub } from "react-icons/io5";
import packageJson from "../../../package.json";

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

const SupportDevContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto 0 20px 0;
  padding-top: 20px;

  h5 {
    color: var(--text-color);
    margin: 0;
    font-size: 1rem;
  }

  a {
    cursor: pointer;
    opacity: 0.8;
    color: var(--text-color);
    font-size: 2rem;
    transition: all 0.2s ease;

    &:active {
      transform: scale(1.1);
    }

    &:hover {
      opacity: 1;
    }
  }
`;

const layoutClassName = css`
  padding: 0 0 80px 0 !important;
`;

const SettingsScreen: FunctionComponent<SettingsScreenProps> = ({ settings }) => {
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
      <Accordion text="general" gap="1.5rem">
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

      <Accordion text="Updates" gap="1.5rem">
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

      <Accordion text="Platforms" gap="1.5rem">
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

      <SupportDevContainer>
        <h5>Support Development</h5>
        <a href={packageJson.homepage} alt="Link to Github repository">
          <IoLogoGithub />
        </a>
      </SupportDevContainer>
    </Layout>
  );
};

export default SettingsScreen;
