import { useEffect } from "preact/hooks";
import { BrowserMessages } from "../../types/messages";
import Browser from "webextension-polyfill";

type CallbackFC = (props: BrowserMessages) => void;

export const useBrowserRuntimeMsg = (callback: CallbackFC) => {
  useEffect(() => {
    const messages = (props: BrowserMessages) => {
      callback(props);
    };

    Browser.runtime.onMessage.addListener(messages);
    return () => Browser.runtime.onMessage.removeListener(messages);
  }, []);
};
