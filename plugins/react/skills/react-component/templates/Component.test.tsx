import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { __Name__ } from "./__Name__";

describe("__Name__", () => {
  it("renders with default props", () => {
    render(<__Name__ label="Hello" />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls the callback when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<__Name__ label="Hello" onClick={onClick} />);

    await user.click(screen.getByText("Hello"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
