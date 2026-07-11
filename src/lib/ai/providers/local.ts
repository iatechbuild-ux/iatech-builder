import type { AssistantResponse, NormalizedAssistantRequest } from "../types";

export function createLocalFallback(input: NormalizedAssistantRequest): AssistantResponse {
  return {
    provider: "local-fallback",
    fallback: true,
    text: [
      `Mode: ${input.mode}. Stage: ${input.stage}.`,
      "I can help you move forward, but I will not replace your thinking.",
      "First, write the problem in one sentence. Then list what you already understand, what AI suggested, and what you can rebuild yourself.",
      "Choose one small next step, test it, and explain why it worked or failed.",
    ].join("\n\n"),
  };
}

export function createSafetyFallback(input: NormalizedAssistantRequest): AssistantResponse {
  return {
    provider: "local-safety",
    fallback: true,
    safetyFlagged: true,
    text: [
      `Mode: ${input.mode}. Stage: ${input.stage}.`,
      "I cannot process messages that may include private personal information.",
      "Remove passwords, phone numbers, addresses, email addresses, family details, or private school records. Then ask the learning question again using only the project details needed for help.",
    ].join("\n\n"),
  };
}
