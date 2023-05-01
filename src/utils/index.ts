import axios from "axios";
import DOMPurify from "dompurify";
import Browser from "webextension-polyfill";
import { IFreeGame } from "../types/freegames";
import { db } from "./db";
import { filterGamesList } from "./game";

export const switchIcon = (games: IFreeGame[]) => {
  const icons = ["assets/logo-32.png", "assets/logo-32-hidden.png"];

  Browser.browserAction.setIcon({
    path: filterGamesList(games, db.get("settings")).some((game) => !game.state.hasClicked) ? icons[0] : icons[1],
  });
};

export const minutesToMs = (number: number) => 1000 * number * 60;

export const getDOMFromUrl = async (url: string): Promise<HTMLElement | undefined> => {
  const { data } = await axios({ url, timeout: 5000 });
  return DOMPurify.sanitize(data, { RETURN_DOM: true, SANITIZE_DOM: true });
};
