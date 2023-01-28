export enum EnumProductType {
  "GAME",
  "DLC",
}

export enum EnumPlatform {
  "EpicGamesStore",
  "Steam",
  "GoG",
}

export type ProductType = keyof typeof EnumProductType;
export type Platform = keyof typeof EnumPlatform;
export interface GameState {
  hasSendNotification: boolean;
  hasClicked: boolean;
}

export interface IFreeGameData {
  title: string;
  url: string;
  productType: ProductType;
  state: GameState;
  platform?: Platform;
  imageSrc?: string;
}

export type FreeGamesData = IFreeGameData[];
