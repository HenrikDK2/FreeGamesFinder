import { sortGames, switchIcon } from ".";
import { ISettings } from "../types/settings";
import { IDB } from "../types/storage";

const defaultSettings: ISettings = {
  hideClickedGames: false,
  updateIntervalInMinutes: 60,
  updateOnBrowserStart: true,
};

export const db: IDB = {
  get(key) {
    if (key === "games") {
      const games = localStorage.getItem("games");

      if (!games) {
        switchIcon([]);
        return [];
      } else {
        switchIcon(JSON.parse(games));
        return JSON.parse(games);
      }
    }

    if (key === "settings") {
      const settings = localStorage.getItem("settings");
      if (!settings) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(settings) };
    }
  },

  update(key, data) {
    if (key === "settings") localStorage.setItem("settings", JSON.stringify({ ...db.get("settings"), ...data }));
    if (key === "games" && Array.isArray(data)) {
      localStorage.setItem("games", JSON.stringify(sortGames(data)));
      switchIcon(data);
    }

    if (key === "game" && "title" in data) {
      const newGames = db.get("games").map((game) => (game.title === data.title ? data : game));
      localStorage.setItem("games", JSON.stringify(sortGames(newGames)));
      switchIcon(newGames);
    }
  },

  find(key, data) {
    if (key === "game") return db.get("games").find((game) => game.title === data.title);
  },
};
