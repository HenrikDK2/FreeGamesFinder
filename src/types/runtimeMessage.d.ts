import { IFreeGame } from "./freegames";

export enum EnumRuntimeMessages {
  "get-free-games",
}
export enum EnumStatus {
  "success",
  "error",
}

export type Status = keyof typeof EnumStatus;
export type RuntimeMessages = keyof typeof EnumRuntimeMessages;

export interface IMessageFreeGames {
  status: Status;
  msg: "get-free-games";
  data: IFreeGame[] | undefined;
}
