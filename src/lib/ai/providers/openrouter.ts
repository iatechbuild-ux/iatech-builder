import { buildSystemPrompt } from "../guardrails";
import type { AssistantProvider, AssistantResponse, NormalizedAssistantRequest } from "../types";

type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export type OpenRouterProviderOptions = {
  apiKey: string;
  model: string;
  siteUrl?: string;
  appName?: string;
};

export function createOpenRouterProvider(options: OpenRouterProviderOptions): AssistantProvider {
  return {
    name: "openrouter",
    async generate(input: NormalizedAssistantRequest): Promise<AssistantResponse> {
      const messages: OpenRouterMessage[] = [
        { role: "system", content: buildSystemPrompt(input) },
        {
          role: "user",
          content: [
            `Mission: ${input.missionTitle}`,
            `Stage: ${input.stage}`,
            `Learner message: ${input.message}`,
          ].join("\n"),
        },
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": options.siteUrl || "http://localhost:3000",
          "X-Title": options.appName || "IATECH Builder",
        },
        body: JSON.stringify({
          model: options.model,
          messages,
          temperature: 0.35,
          max_tokens: 520,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      const text = data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("OpenRouter returned an empty assistant response");
      }

      return {
        provider: "openrouter",
        model: options.model,
        text,
      };
    },
  };
}
