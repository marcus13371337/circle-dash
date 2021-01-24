import { useInput, Key } from "ink";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const createId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

type KeyHandler = () => void | Promise<void> | undefined;

export type KeyboardNavigationConfig = Record<string, KeyHandler>;

interface KeyboardNavigationContextValue {
  subscribe: (config: KeyboardNavigationConfig) => string;
  updateConfig: (id: string, config: KeyboardNavigationConfig) => void;
  unsubscribe: (id: string) => void;
}

export const KeyboardNavigationContext = createContext<KeyboardNavigationContextValue>(
  {
    subscribe: () => "0",
    updateConfig: () => {},
    unsubscribe: () => {},
  }
);

interface QueueEntry {
  config: KeyboardNavigationConfig;
  id: string;
}

export const Provider: React.FC = ({ children }) => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const latestQueue = useRef(queue);

  useEffect(() => {
    latestQueue.current = queue;
  }, [queue]);

  useInput((input, keyPress) => {
    const currentQueue = latestQueue.current;
    let i = currentQueue.length - 1;
    let handler: KeyHandler | undefined = undefined;
    while (i >= 0 && !handler) {
      const highestPrioHandlers = currentQueue[i];
      Object.keys(keyPress)
        .filter((key) => keyPress[key])
        .forEach((pressedKey: keyof Key) => {
          if (!handler) {
            handler = highestPrioHandlers.config[pressedKey];
          }
        });
      i--;
    }

    if (handler) {
      handler();
    }
  });

  const subscribe = useCallback((config: KeyboardNavigationConfig) => {
    const id = createId(5);
    setQueue((q) => [...q, { id, config }]);
    return id;
  }, []);

  const updateConfig = useCallback(
    (id: string, config: KeyboardNavigationConfig) => {
      setQueue((q) => {
        const currentIndex = q.findIndex((entry) => entry.id === id);

        const newQueue = [...q];
        newQueue[currentIndex] = {
          id,
          config,
        };

        return newQueue;
      });
    },
    []
  );

  const unsubscribe = useCallback((id: string) => {
    setQueue((q) => q.filter((entry) => entry.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      subscribe,
      updateConfig,
      unsubscribe,
    }),
    [subscribe, updateConfig, unsubscribe]
  );

  return (
    <KeyboardNavigationContext.Provider value={contextValue}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};
