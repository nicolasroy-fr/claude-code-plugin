import { useCallback, useMemo, useState } from "react";

export interface __name__Result {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function __name__(initialValue = false): __name__Result {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((current) => !current), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return useMemo(
    () => ({ value, toggle, setTrue, setFalse }),
    [value, toggle, setTrue, setFalse],
  );
}
