import { Platform } from "./freegames";

export interface ISettings {
  hideClickedGames: boolean;
  updateIntervalInMinutes: 30 | 60 | 180 | 360 | 720;
  updateOnBrowserStart: boolean;
  notifications: boolean;
  showErrors: boolean;
  showPlatforms: Platform[];
}
