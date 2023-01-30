export interface UpdateMessage {
  key: "update";
}

export interface SettingsMessage {
  key: "settings";
  update: boolean;
}

export interface ReloadMessage {
  key: "reload";
}

export type BackgroundMessages = UpdateMessage | SettingsMessage | ReloadMessage;
export type BrowserMessages = ReloadMessage;
