export interface UpdateIntervalMessage {
  key: "update-interval";
}

export interface ReloadMessage {
  key: "reload";
}

export interface ErrorMessage {
  key: "errors";
}

export type BackgroundMessages = UpdateIntervalMessage | ReloadMessage;
export type BrowserMessages = ReloadMessage | ErrorMessage;
