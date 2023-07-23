import { Errors } from ".";
import { IFreeGame } from "./freegames";
import { ISettings } from "./settings";

export interface IStorage {
  games: IFreeGame[];
  settings: ISettings;
}

export type StorageKey = keyof IStorage;

export interface IDB {
  get: { (key: "games"): IFreeGame[]; (key: "errors"): Errors; (key: "settings"): ISettings };
  find: { (key: "game", data: Partial<{ title: IFreeGame["title"]; url: IFreeGame["url"] }>): IFreeGame | undefined };
  update: {
    (key: "game", data: IFreeGame): void;
    (key: "games", data: IFreeGame[]): void;
    (key: "errors", data: Errors): void;
    (key: "settings", data: Partial<ISettings>): void;
  };
}
