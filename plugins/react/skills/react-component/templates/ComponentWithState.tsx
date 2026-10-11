import { useState } from "react";

export interface __Name__Props {
  initialCount?: number;
  onChange?: (count: number) => void;
}

export function __Name__({ initialCount = 0, onChange }: __Name__Props) {
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    const next = count + 1;
    setCount(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      onClick={handleClick}
    >
      Count: {count}
    </button>
  );
}
