export enum EnumPlatform {
  "Epic Games Store",
  "Steam",
  "GoG",
  "Itch.io",
  "IndieGala",
  "GX.games",
}
export type Platform = keyof typeof EnumPlatform;

export type ProductType = "GAME" | "DLC" | "BUNDLE";

export interface GameState {
  hasSendNotification: boolean;
  hasClicked: boolean;
}

export interface IFreeGame {
  title: string;
  url: string;
  productType: ProductType;
  state: GameState;
  platform?: Platform;
  imageSrc?: string;
}
