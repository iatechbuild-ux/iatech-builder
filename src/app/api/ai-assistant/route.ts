import { askLearningAssistant } from "@/lib/ai/service";
import { resolveAssistantContext } from "@/lib/ai/context";
import type { AssistantRequest } from "@/lib/ai/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest;
    if (typeof body.message !== "string" || !body.message.trim()) {
      return Response.json({ text: "Enter a learning question before asking the assistant." }, { status: 400 });
    }
    const supabase = await createSupabaseServerClient();
    if (!supabase) return Response.json({ text: "Authentication is unavailable." }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ text: "Sign in to use the Learning Assistant." }, { status: 401 });
    const profile = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile.data?.role !== "student") {
      return Response.json({ text: "The Learning Assistant is available to learner accounts." }, { status: 403 });
    }
    const dailyLimit = Math.max(1, Number(process.env.AI_MAX_DAILY_INTERACTIONS || 25));
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const usage = await supabase.from("ai_interactions").select("id", { count: "exact", head: true }).eq("student_id", user.id).gte("created_at", since);
    if ((usage.count ?? 0) >= dailyLimit) {
      return Response.json({ text: "You have reached today’s AI practice limit. Continue with your mission notes or ask your tutor." }, { status: 429 });
    }
    const context = await resolveAssistantContext(supabase, user.id, body.missionSlug);
    const result = await askLearningAssistant(body, context);
    const message = result.safetyFlagged
      ? "[REDACTED: restricted personal information]"
      : body.message.replace(/\s+/g, " ").trim().slice(0, 1600);
    const logged = await supabase.from("ai_interactions").insert({
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
    if (logged.error) {
      return Response.json({ text: "The assistant could not save this learning interaction. Please try again." }, { status: 503 });
    }
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
