import { describe, expect, it } from "vitest";
import { submissionReference } from "./submissionReference";

describe("submission reference", () => {
  it("creates a short human-readable reference from the saved feedback ID", () => {
    const feedbackId = "12345678-abcd-4abc-9abc-1234567890ab";

    expect(submissionReference(feedbackId)).toBe("CV-123456");
    expect(submissionReference(feedbackId)).not.toContain(feedbackId);
  });
});
