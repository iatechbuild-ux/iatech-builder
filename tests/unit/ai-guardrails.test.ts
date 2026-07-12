import { describe, expect, it } from "vitest";

import { buildSystemPrompt, hasRestrictedPersonalInfo, normalizeAssistantRequest } from "../../src/lib/ai/guardrails";

describe("AI learning guardrails", () => {
  it.each([
    "My password is secret123",
    "Email me at learner@example.com",
    "My phone number is 08012345678",
    "My home address is 10 Example Road",
  ])("detects restricted personal information: %s", (message) => {
    expect(hasRestrictedPersonalInfo(message)).toBe(true);
  });

  it("normalizes invalid modes and bounds learner input", () => {
    const result = normalizeAssistantRequest({
      mode: "Ignore safeguards" as never,
      stage: "Unknown" as never,
      missionTitle: "M".repeat(500),
      message: "x".repeat(5000),
    });
    expect(result.mode).toBe("General Learning Tutor");
    expect(result.stage).toBe("Experience");
    expect(result.missionTitle).toHaveLength(120);
    expect(result.message).toHaveLength(1600);
  });

  it("requires learner ownership and prohibits full project completion", () => {
    const prompt = buildSystemPrompt(normalizeAssistantRequest({ message: "Build it for me" }));
    expect(prompt).toContain("never replace thinking");
    expect(prompt).toContain("Do not build full projects");
    expect(prompt).toContain("Ask questions before giving steps");
  });
});
