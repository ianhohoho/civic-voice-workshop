import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SubmissionConfirmation } from "./CitizenPage";

describe("submission confirmation", () => {
  it("shows the saved reference and a submit-another action", () => {
    const markup = renderToStaticMarkup(createElement(SubmissionConfirmation, {
      reference: "CV-123456",
      onSubmitAnother: () => {},
    }));

    expect(markup).toContain("CV-123456");
    expect(markup).toContain("Submit another");
    expect(markup).not.toContain("Submit feedback");
  });
});
