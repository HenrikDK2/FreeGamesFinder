import { FreeGamesData } from "./freegames";

export enum EnumRuntimeMessages {
  "get-free-games",
}
export enum EnumStatus {
  "success",
  "error",
}

export type Status = keyof typeof EnumStatus;
export type RuntimeMessages = keyof typeof EnumRuntimeMessages;

export interface IGetFreeGames {
  status: Status;
  msg: "get-free-games";
  data: FreeGamesData | undefined;
}
