import { askLearningAssistant } from "@/lib/ai/service";
import { resolveAssistantContext } from "@/lib/ai/context";
import type { AssistantRequest } from "@/lib/ai/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest;
    const supabase = await createSupabaseServerClient();
    if (!supabase) return Response.json({ text: "Authentication is unavailable." }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ text: "Sign in to use the Learning Assistant." }, { status: 401 });
    const context = await resolveAssistantContext(supabase, user.id, body.missionSlug);
    const result = await askLearningAssistant(body, context);
    const message = typeof body.message === "string" ? body.message.replace(/\s+/g, " ").trim().slice(0, 1600) : "Learning support request";
    await supabase.from("ai_interactions").insert({
      student_id: user.id,
      mission_id: context.missionId ?? null,
      stage: context.stageKey ?? "experience",
      mode: typeof body.mode === "string" ? body.mode.slice(0, 120) : "General Learning Tutor",
      provider: result.provider,
      model: result.model ?? null,
      user_message: message,
      assistant_response: result.text.slice(0, 12000),
      safety_flagged: result.safetyFlagged ?? false,
    });
    return Response.json(result);
  } catch {
    return Response.json(
      {
        provider: "local-error",
        fallback: true,
        text: "The assistant could not read that request. Try a smaller learning question without private personal information.",
      },
      { status: 400 },
    );
  }
}
