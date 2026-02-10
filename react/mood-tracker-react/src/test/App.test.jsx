import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  localStorage.clear();
});

describe("Mood selection", () => {
  it("highlights a mood when clicked", async () => {
    const user = userEvent.setup();

    render(<App />);

    const happyButton = screen.getByRole("button", { name: /happy/i });
    await user.click(happyButton);

    expect(happyButton).toHaveClass("active");

    const calmButton = screen.getByRole("button", { name: /calm/i });
    expect(calmButton).not.toHaveClass("active");
  });
});


