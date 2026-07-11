import { hasRestrictedPersonalInfo, normalizeAssistantRequest } from "./guardrails";
import { createLocalFallback, createSafetyFallback } from "./providers/local";
import { createOpenRouterProvider } from "./providers/openrouter";
import type { AssistantContext, AssistantRequest, AssistantResponse } from "./types";

const DEFAULT_OPENROUTER_MODEL = "google/gemini-2.5-flash-lite";

function getConfiguredProvider() {
  const provider = (process.env.AI_PROVIDER || "local").toLowerCase();

  if (provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
    return createOpenRouterProvider({
      apiKey: process.env.OPENROUTER_API_KEY,
      model: process.env.AI_MODEL || DEFAULT_OPENROUTER_MODEL,
      siteUrl: process.env.APP_URL,
      appName: "IATECH Builder",
    });
  }

  return null;
}

export async function askLearningAssistant(body: AssistantRequest, context?: AssistantContext): Promise<AssistantResponse> {
  const input = normalizeAssistantRequest(body, context);

  if (hasRestrictedPersonalInfo(input.message)) {
    return createSafetyFallback(input);
  }

  const provider = getConfiguredProvider();

  if (!provider) {
    return createLocalFallback(input);
  }

  try {
    return await provider.generate(input);
  } catch {
    return createLocalFallback(input);
  }
}
