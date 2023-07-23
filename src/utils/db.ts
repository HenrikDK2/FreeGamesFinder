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
  notifications: true,
  showPlatforms: ["Steam", "Epic Games Store", "GoG"],
};

function isFreeGameArray(data: any): data is IFreeGame[] {
  return Array.isArray(data) && data.length > 0 && "title" in data[0] && "url" in data[0];
}

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
      const errors = sessionStorage.getItem("errors");

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

    if (key === "errors" && data) {
      sessionStorage.setItem("errors", JSON.stringify(data));
    }

    if (key === "games" && isFreeGameArray(data)) {
      localStorage.setItem("games", JSON.stringify(sortGames(data)));
      Browser.runtime.sendMessage(undefined, { key: "reload" });
      switchIcon(data);
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
