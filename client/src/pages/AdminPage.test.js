import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminFeedbackPanel } from "./AdminPage";

function renderPanel(props) {
  return renderToStaticMarkup(createElement(AdminFeedbackPanel, {
    loading: false,
    error: "",
    feedback: [],
    onRetry: () => {},
    ...props,
  }));
}

describe("admin feedback states", () => {
  it("shows a loading state", () => {
    expect(renderPanel({ loading: true })).toContain("Loading feedback");
  });

  it("shows an error and retry action", () => {
    const markup = renderPanel({ error: "API unavailable" });

    expect(markup).toContain("Couldn’t load feedback");
    expect(markup).toContain("API unavailable");
    expect(markup).toContain("Try again");
  });

  it("shows an empty state", () => {
    expect(renderPanel()).toContain("No feedback yet");
  });

  it("shows loaded feedback", () => {
    const markup = renderPanel({
      feedback: [{
        id: "feedback-1",
        name: "Aisha Rahman",
        message: "Please add more benches.",
        status: "New",
        createdAt: "2026-08-30T09:00:00.000Z",
      }],
    });

    expect(markup).toContain("Please add more benches.");
    expect(markup).toContain("1 items");
  });
});
