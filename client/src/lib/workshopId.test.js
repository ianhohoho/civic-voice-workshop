import { describe, expect, it } from "vitest";
import { isValidWorkshopId, normalizeWorkshopId } from "./workshopId";

describe("workshop ID validation", () => {
  it.each(["S0000001A", "S0000002B", "t1234567c"])('accepts "%s"', (value) => {
    expect(isValidWorkshopId(value)).toBe(true);
  });

  it.each(["", "S0000001", "S0000001AA", "A0000001A", "S00000X1A"])('rejects "%s"', (value) => {
    expect(isValidWorkshopId(value)).toBe(false);
  });

  it("normalizes surrounding spaces and letter case", () => {
    expect(normalizeWorkshopId("  s0000001a ")).toBe("S0000001A");
  });
});
