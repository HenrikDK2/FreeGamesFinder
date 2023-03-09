import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame, Platform } from "../types/freegames";

export const switchIcon = (games: IFreeGame[]) => {
  const icons = ["assets/logo-32.png", "assets/logo-32-hidden.png"];

  Browser.browserAction.setIcon({
    path: games.some((game) => !game.state.hasClicked) ? icons[0] : icons[1],
  });
};

export const minutesToMs = (number: number) => 1000 * number * 60;

export const getDOMFromUrl = async (url: string): Promise<HTMLElement | undefined> => {
  try {
    const { data } = await axios({ url, timeout: 5000 });
    return DOMPurify.sanitize(data, { RETURN_DOM: true, SANITIZE_DOM: true });
  } catch (error) {
    console.error(`Error fetching HTML: ${error}`);
  }
};
