import { RefObject } from "preact";
import { useEffect } from "preact/hooks";

export const useOnClickOutside = <T extends HTMLElement>(ref: RefObject<T>, handler: (e: MouseEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};
