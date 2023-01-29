import { sortGames, switchIcon } from ".";
import { GetStorage } from "../types";
import { IFreeGame, GameState } from "../types/freegames";
import { ISettings } from "../types/settings";

const defaultSettings: ISettings = {
  hideClickedGames: false,
  updateIntervalInMinutes: 60,
  updateOnBrowserStart: true,
};

export const getGame = (title: IFreeGame["title"]): IFreeGame | undefined => {
  const games = getGames();
  if (games) return games.find((game) => game.title === title);
};

export const updateGame = (data: IFreeGame) => {
  const games = getGames();

  if (games) {
    const newGames = games.map((game) => (game.title === data.title ? data : game));
    localStorage.setItem("games", JSON.stringify(sortGames(newGames)));
    switchIcon(newGames);
  }
};

export const updateGameState = (game: IFreeGame, state: Partial<GameState>) => {
  updateGame({ ...game, state: { ...game.state, ...state } });
};

export const getGames = (): IFreeGame[] | undefined => {
  const games = getStorage("games");
  if (games) return games;
};

export const getSettings = (): ISettings => {
  const settings = getStorage("settings");

  if (settings) {
    return settings;
  } else {
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
    return defaultSettings;
  }
};

export const updateSettings = (data: Partial<ISettings>) => {
  const settings = getSettings();

  if (settings) {
    const newSettings = { ...settings, ...data };
    localStorage.setItem("settings", JSON.stringify(newSettings));
    return newSettings;
  }
};

export const getStorage: GetStorage = (key) => {
  const dataString = localStorage.getItem(key) || sessionStorage.getItem(key);
  if (dataString) return JSON.parse(dataString);
};
