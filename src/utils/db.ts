import Browser from "webextension-polyfill";
import { sortGames, switchIcon } from ".";
import { ISettings } from "../types/settings";
import { IDB } from "../types/db";

const defaultSettings: ISettings = {
  hideClickedGames: false,
  updateIntervalInMinutes: 60,
  updateOnBrowserStart: true,
  notifications: true,
  drmFreeGames: false,
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
      Browser.runtime.sendMessage(undefined, { key: "settings" });
    }

    if (key === "games" && Array.isArray(data)) {
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
      return db.get("games").find((game) => game.url === data.url);
    }
  },
};
