import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame, Platform, GameState } from "../types/freegames";
import { IStorage } from "../types/storage";

export const getProductType = (type?: string) => {
  switch (type) {
    case "DLC":
      return "DLC";
  }

  return "GAME";
};

export const getPlatform = (platform: string): Platform | undefined => {
  if (platform === "Epic Games Store") return "EpicGamesStore";
  if (platform === "EpicGamesStore") return "EpicGamesStore";

  if (platform === "Gog.com") return "GoG";

  if (platform === "Steam") return "Steam";
};

export const sortGames = (games: IFreeGame[]): IFreeGame[] => {
  if (!games) return [];
  return games.sort((a, b) => Number(a.state.hasClicked) - Number(b.state.hasClicked));
};

// Check if any games haven't been clicked, if not, then let the icon remain as normal.
// But if all games has been clicked, then show a darker, abit more toned out logo instead.
const active = "assets/logo-32.png";
const hidden = "assets/logo-32-hidden.png";

export const switchIcon = (games: IFreeGame[]) => {
  const foundOne = games.find((game) => !game.state.hasClicked);
  Browser.browserAction.setIcon({ path: foundOne ? active : hidden });
};

export const getDOMFromUrl = async (url: string): Promise<HTMLElement | undefined> => {
  try {
    const { data } = await axios.get(url);
    return DOMPurify.sanitize(data, { RETURN_DOM: true });
  } catch (error) {
    console.error(`Error fetching HTML: ${error}`);
  }
};

export const getGame = (title: IFreeGame["title"]): IFreeGame | undefined => {
  const games = getStorage("games");
  if (games) return games.find((game) => game.title === title);
};

export const updateGame = (data: IFreeGame) => {
  const games = getStorage("games");

  if (games) {
    const newGames = games.map((game) => (game.title === data.title ? data : game));
    localStorage.setItem("games", JSON.stringify(sortGames(newGames)));
    switchIcon(newGames);
  }
};

export const updateGameState = (game: IFreeGame, state: Partial<GameState>) => {
  updateGame({ ...game, state: { ...game.state, ...state } });
};

export const getStorage = (key: keyof IStorage): IStorage["games"] | undefined => {
  const dataString = localStorage.getItem(key) || sessionStorage.getItem(key);
  if (dataString) {
    if (key === "games") return JSON.parse(dataString);
  }
};
