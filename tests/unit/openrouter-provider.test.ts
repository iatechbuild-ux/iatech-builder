import { afterEach, describe, expect, it, vi } from "vitest";

import { createOpenRouterProvider } from "../../src/lib/ai/providers/openrouter";
import { normalizeAssistantRequest } from "../../src/lib/ai/guardrails";

afterEach(() => vi.unstubAllGlobals());

describe("OpenRouter provider", () => {
  it("returns a validated response and configures a timeout", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: "Try one small loop." } }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = createOpenRouterProvider({ apiKey: "test", model: "test-model" });
    const result = await provider.generate(normalizeAssistantRequest({ message: "Help me understand loops" }));
    expect(result.text).toBe("Try one small loop.");
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it("rejects malformed provider output so the service can fall back", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] }), { status: 200 })));
    const provider = createOpenRouterProvider({ apiKey: "test", model: "test-model" });
    await expect(provider.generate(normalizeAssistantRequest({ message: "Help" }))).rejects.toThrow("empty assistant response");
  });
});
