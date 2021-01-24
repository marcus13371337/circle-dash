import { useMemo, useState } from "react";
import { KeyboardNavigationConfig } from "./Provider";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

interface KeyboardSelectionParams<T> {
  items: T[];
  onSelect: (item: T) => void;
  horizontal?: boolean;
  disabled?: boolean;
}

export const useKeyboardSelection = <T extends any>({
  items,
  onSelect,
  horizontal = false,
  disabled = false,
}: KeyboardSelectionParams<T>): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] => {
  const [cursor, setCursor] = useState(0);

  const config = useMemo(() => {
    const next = () => {
      if (cursor < items.length - 1) {
        setCursor(cursor + 1);
      }
    };

    const prev = () => {
      if (cursor > 0) {
        setCursor(cursor - 1);
      }
    };

    const partialConfig: KeyboardNavigationConfig = {
      Enter: () => onSelect(items[cursor]),
      Tab: next,
      ShiftTab: prev,
    };

    if (horizontal) {
      partialConfig.ArrowRight = next;
      partialConfig.ArrowLeft = prev;
    } else {
      partialConfig.ArrowUp = prev;
      partialConfig.ArrowDown = next;
    }

    return partialConfig;
  }, [cursor, horizontal, items, onSelect]);

  useKeyboardNavigation(config, disabled);

  return [cursor, setCursor];
};
