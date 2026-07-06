type AssistantRequest = {
  mode?: string;
  stage?: string;
  message?: string;
  missionTitle?: string;
};

const modeInstructions: Record<string, string> = {
  "AI-Assisted Development Coach":
    "Help the learner plan, prototype, debug, review, test, and document in small understandable pieces. Do not generate a full project.",
  "Prompt Engineering Coach":
    "Teach professional AI communication: role, goal, context, constraints, output format, iteration, and verification.",
  "Data Analysis Tutor":
    "Ask what the data represents and what decision the learner wants to support before suggesting charts or conclusions.",
  "CMS and WordPress Tutor":
    "Help compare CMS and custom code, plan pages, forms, content, SEO basics, and maintenance.",
  "Robotics and Automation Tutor":
    "Keep guidance virtual-first and safety-aware. Focus on inputs, outputs, sensors, actuators, and control flow.",
  "Business Process Coach":
    "Diagnose before prescribing technology. Map the workflow, bottlenecks, stakeholders, and requirements.",
};

const stageInstructions: Record<string, string> = {
  Experience: "It is okay to help create a quick first version, but explain that this is only a starting point.",
  Understand: "Explain foundations and ask concept-check questions.",
  Rebuild: "Give hints and small steps, not a complete solution.",
  Master: "Challenge the learner to apply the skill to a new scenario.",
  Teach: "Ask the learner to explain in their own words and prepare evidence.",
};

function fallbackResponse(body: AssistantRequest) {
  const mode = body.mode || "General Learning Tutor";
  const stage = body.stage || "Rebuild";
  return {
    provider: "local-fallback",
    text: [
      `Mode: ${mode}. Stage: ${stage}.`,
      "I can help you move forward, but I will not replace your thinking.",
      "First, write the problem in one sentence. Then list what you already understand, what AI suggested, and what you can rebuild yourself.",
      "For this step, try one small change, test it, and explain why it worked or failed.",
    ].join("\n\n"),
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as AssistantRequest;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(fallbackResponse(body));
  }

  const mode = body.mode || "General Learning Tutor";
  const stage = body.stage || "Rebuild";
  const missionTitle = body.missionTitle || "IATECH Builder mission";
  const message = body.message || "Help me plan my next learning step.";

  const system = [
    "You are the IATECH Builder AI Learning Assistant for learners aged 10-18.",
    "Be practical, safe, encouraging, and foundation-first.",
    "Never ask for private personal data, passwords, addresses, phone numbers, or private school records.",
    "Do not generate a full project. Help the learner think, understand, rebuild, master, and teach.",
    modeInstructions[mode] || "Tutor the learner without replacing their ownership.",
    stageInstructions[stage] || "Adapt help to the learner's current stage.",
  ].join("\n");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Mission: ${missionTitle}\nStage: ${stage}\nLearner message: ${message}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 420,
      }),
    });

    if (!response.ok) {
      return Response.json(fallbackResponse(body), { status: 200 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    return Response.json({ provider: "groq", text: text || fallbackResponse(body).text });
  } catch {
    return Response.json(fallbackResponse(body), { status: 200 });
  }
}
