import { useInput } from "ink";
import { useEffect, useState } from "react";

export const useKeyboardSelection = <T extends { id: string | number }>(
  items: T[],
  { horizontal = false, preselect = false, reversed = false } = {}
) => {
  const [selected, setSelected] = useState<T | null>(
    preselect && items.length > 0 ? items[0] : null
  );

  useEffect(() => {
    const currentIndex = items.findIndex((item) => item.id === selected?.id);

    if (currentIndex === -1) {
      if (preselect) {
        if (!reversed) {
          setSelected(items.length > 0 ? items[0] : null);
        } else {
          setSelected(items.length > 0 ? items[items.length - 1] : null);
        }
      }
    }
  }, [items, selected, preselect]);

  useInput((input, key) => {
    const currentIndex = items.findIndex((item) => item.id === selected?.id);

    const isNext = horizontal ? key.rightArrow : key.downArrow;
    const isPrev = horizontal ? key.leftArrow : key.upArrow;

    if (key.escape && !preselect) {
      setSelected(null);
    }

    if (currentIndex === -1 && isNext && items.length > 0) {
      setSelected(items[0]);
    }

    if (isNext && currentIndex < items.length - 1) {
      setSelected(items[currentIndex + 1]);
    }

    if (isPrev && currentIndex > 0 && items.length > 0) {
      setSelected(items[currentIndex - 1]);
    }
  });

  return selected;
};
