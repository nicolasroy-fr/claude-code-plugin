import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { __name__ } from "./__name__";

describe("__name__", () => {
  it("returns the initial value", () => {
    const { result } = renderHook(() => __name__(true));

    expect(result.current.value).toBe(true);
  });

  it("defaults to false", () => {
    const { result } = renderHook(() => __name__());

    expect(result.current.value).toBe(false);
  });

  it("toggles the value", () => {
    const { result } = renderHook(() => __name__());

    act(() => result.current.toggle());

    expect(result.current.value).toBe(true);
  });

  it("keeps stable callbacks across renders", () => {
    const { result, rerender } = renderHook(() => __name__());
    const { toggle } = result.current;

    rerender();

    expect(result.current.toggle).toBe(toggle);
  });
});
