import { IFreeGame } from "./freegames";
import { ISettings } from "./settings";

export interface IStorage {
  games: IFreeGame[];
  settings: ISettings;
}

export type StorageKey = keyof IStorage;
