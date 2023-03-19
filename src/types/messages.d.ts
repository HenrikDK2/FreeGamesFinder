export interface SettingsMessage {
  key: "settings";
}

export interface ReloadMessage {
  key: "reload";
}

export type BackgroundMessages = SettingsMessage | ReloadMessage;
export type BrowserMessages = ReloadMessage;
