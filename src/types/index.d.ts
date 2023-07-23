import { IFreeGame } from "./freegames";
import { ISettings } from "./settings";

export interface RootState {
  games: IFreeGame[] | undefined;
  settings: ISettings;
}

export type Error = { msg: string; details: string };
export type Errors = Error[];
