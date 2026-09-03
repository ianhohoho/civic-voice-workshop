import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AdminFeedbackPanel, filterFeedback } from "./AdminPage";

function renderPanel(props) {
  return renderToStaticMarkup(createElement(AdminFeedbackPanel, {
    loading: false,
    error: "",
    feedback: [],
    onRetry: () => {},
    onClearFilters: () => {},
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
        category: "Estate",
        status: "New",
        createdAt: "2026-08-30T09:00:00.000Z",
      }],
    });

    expect(markup).toContain("Please add more benches.");
    expect(markup).toContain("Estate");
    expect(markup).toContain("1 items");
  });

  it("shows a useful empty state when filters have no matches", () => {
    const markup = renderPanel({ filtersActive: true, totalCount: 2 });

    expect(markup).toContain("No matching feedback");
    expect(markup).toContain("Clear filters");
    expect(markup).toContain("0 of 2 items");
  });
});

describe("admin feedback filters", () => {
  const feedback = [
    { id: "1", category: "Estate", status: "New" },
    { id: "2", category: "Estate", status: "Closed" },
    { id: "3", category: "Transport", status: "New" },
  ];

  it("combines category and status filters", () => {
    expect(filterFeedback(feedback, "Estate", "New").map((item) => item.id)).toEqual(["1"]);
  });

  it("returns all feedback when filters are clear", () => {
    expect(filterFeedback(feedback, "", "")).toEqual(feedback);
  });
});
