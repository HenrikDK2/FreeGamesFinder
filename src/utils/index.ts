import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGameData, GameState, Platform, FreeGamesData } from "../types/freegames";

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

export const sortGames = (games: FreeGamesData | undefined): FreeGamesData => {
  if (games) {
    return games.sort((a, b) => {
      if (a.state.hasClicked === true && b.state.hasClicked === true) {
        return 0;
      } else if (a.state.hasClicked === true) {
        return 1;
      } else if (b.state.hasClicked === true) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  return [];
};

// Check if any games haven't been clicked, if not, then let the icon remain as normal.
// But if all games has been clicked, then show a darker, abit more toned out logo instead.
const active = "assets/logo-32.png";
const hidden = "assets/logo-32-hidden.png";

export const switchIcon = (games: FreeGamesData) => {
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

export const getGameState = (title: IFreeGameData["title"]): GameState => {
  const stateString = localStorage.getItem(title.toLowerCase().trim());
  if (stateString) return JSON.parse(stateString);

  return {
    hasClicked: false,
    hasSendNotification: false,
  };
};

export const setGameState = (title: IFreeGameData["title"], state: GameState, games?: FreeGamesData) => {
  localStorage.setItem(title.toLowerCase().trim(), JSON.stringify(state));

  if (games) {
    const newGames = games.map((game) => (game.title === title ? { ...game, state } : game));
    localStorage.setItem("games", JSON.stringify(sortGames(newGames)));
    switchIcon(newGames);
  }
};

export const getLocalStorage = (key: string) => {
  const gamesString = localStorage.getItem(key);
  if (gamesString) return JSON.parse(gamesString);

  return undefined;
};
