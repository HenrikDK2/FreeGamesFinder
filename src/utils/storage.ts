import { sortGames, switchIcon } from ".";
import { ISettings } from "../types/settings";
import { IDB, GetStorage } from "../types/storage";

const defaultSettings: ISettings = {
  hideClickedGames: false,
  updateIntervalInMinutes: 60,
  updateOnBrowserStart: true,
};

export const db: IDB = {
  get(key) {
    if (key === "games") {
      const games = localStorage.getItem("games");
      if (!games) return [];
      return JSON.parse(games);
    }

    if (key === "settings") {
      const settings = localStorage.getItem("settings");
      if (!settings) return defaultSettings;
      return JSON.parse(settings);
    }
  },

  update(key, data) {
    if (key === "settings") localStorage.setItem("settings", JSON.stringify({ ...db.get("settings"), ...data }));

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

export const getStorage: GetStorage = (key) => {
  const dataString = localStorage.getItem(key) || sessionStorage.getItem(key);
  if (dataString) return JSON.parse(dataString);
};
