import { IFreeGame } from "./freegames";
import { ISettings } from "./settings";

export interface IStorage {
  games: IFreeGame[];
  settings: ISettings;
}

export type StorageKey = keyof IStorage;

export interface IDB {
  get: { (key: "games"): IFreeGame[]; (key: "settings"): ISettings };
  find: { (key: "game", data: { title: string }): IFreeGame | undefined };
  update: {
    (key: "game", data: IFreeGame): void;
    (key: "settings", data: Partial<ISettings>): void;
  };
}
