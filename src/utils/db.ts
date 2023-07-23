import Browser from "webextension-polyfill";
import { switchIcon } from ".";
import { ISettings } from "../types/settings";
import { IDB } from "../types/db";
import { compareGameTitles, sortGames } from "./game";
import { IFreeGame } from "../types/freegames";

const defaultSettings: ISettings = {
  hideClickedGames: false,
  updateIntervalInMinutes: 60,
  updateOnBrowserStart: true,
  showErrors: true,
  notifications: true,
  showPlatforms: ["Steam", "Epic Games Store", "GoG"],
};

export const db: IDB = {
  get(key) {
    if (key === "games") {
      const dataString = localStorage.getItem("games");

      if (!dataString) {
        switchIcon([]);
        return [];
      } else {
        const games = JSON.parse(dataString);
        switchIcon(games);
        return games;
      }
    }

    if (key === "errors") {
      const errors = localStorage.getItem("errors");

      if (errors) return JSON.parse(errors);
      return [];
    }

    if (key === "settings") {
      const settings = localStorage.getItem("settings");
      if (!settings) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(settings) };
    }
  },

  update(key, data) {
    if (key === "settings") {
      const oldSettings = db.get("settings");
      localStorage.setItem("settings", JSON.stringify({ ...oldSettings, ...data }));

      if ("updateIntervalInMinutes" in data) {
        Browser.runtime.sendMessage(undefined, { key: "update-interval" });
      } else {
        Browser.runtime.sendMessage(undefined, { key: "reload" });
      }
    }

    if (key === "errors" && Array.isArray(data)) {
      localStorage.setItem("errors", JSON.stringify(data));
      Browser.runtime.sendMessage(undefined, "errors");
    }

    if (key === "games") {
      const gamesData = data as IFreeGame[];
      localStorage.setItem("games", JSON.stringify(sortGames(gamesData)));
      Browser.runtime.sendMessage(undefined, { key: "reload" });
      switchIcon(gamesData);
    }

    if (key === "game" && "title" in data) {
      const newGames = db
        .get("games")
        .map((game) => (game.title === data.title && game.url === data.url ? data : game));
      db.update("games", newGames);
    }
  },

  find(key, data) {
    if (key === "game") {
      return db.get("games").find((game) => {
        if (game.url === data.url || (data.title && compareGameTitles(game.title, data.title))) {
          return game;
        }
      });
    }
  },
};
