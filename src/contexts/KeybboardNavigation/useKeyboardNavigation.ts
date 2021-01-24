import { useContext, useEffect, useRef } from "react";
import {
  KeyboardNavigationConfig,
  KeyboardNavigationContext,
} from "./Provider";

export const useKeyboardNavigation = (
  config: KeyboardNavigationConfig,
  disabled = false
) => {
  const { subscribe, unsubscribe, updateConfig } = useContext(
    KeyboardNavigationContext
  );
  const firstConfig = useRef<KeyboardNavigationConfig>(config);

  const id = useRef<string | null>(null);

  useEffect(() => {
    if (!id.current && !disabled) {
      const newId = subscribe(firstConfig.current);
      id.current = newId;

      return () => {
        unsubscribe(newId);
        id.current = null;
      };
    }
  }, [disabled, subscribe, unsubscribe]);

  useEffect(() => {
    if (id.current) {
      updateConfig(id.current, config);
    }
  }, [updateConfig, config]);
};
