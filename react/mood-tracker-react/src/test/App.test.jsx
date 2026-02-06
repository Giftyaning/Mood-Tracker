import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

beforeEach(() => {
  // Ensure tests start clean
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

describe("Saving entries", () => {
  it("increases entry count when saving", async () => {
    const user = userEvent.setup();

    render(<App />);

    const insightsHeading = screen.getByRole("heading", {
      name: /your insights/i,
    });
    const insightsCard = insightsHeading.closest(".card");
    expect(insightsCard).toBeTruthy();

    const entriesLabel = within(insightsCard).getByText(/^Entries$/i);
    const entriesValue = entriesLabel.parentElement.querySelector("strong");
    expect(entriesValue).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: /happy/i }));

    await user.type(
      screen.getByPlaceholderText(/today's reflection title/i),
      "Test Entry"
    );

    await user.click(screen.getByRole("button", { name: /save entry/i }));

    expect(entriesValue).toHaveTextContent("1");
  });
});
