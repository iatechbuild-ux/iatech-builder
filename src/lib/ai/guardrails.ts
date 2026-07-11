import {
  assistantModes,
  assistantStages,
  type AssistantMode,
  type AssistantRequest,
  type AssistantStage,
  type NormalizedAssistantRequest,
} from "./types";

const MAX_MESSAGE_LENGTH = 1600;
const MAX_CONTEXT_LENGTH = 120;

const restrictedInfoPatterns = [
  /\bpassword\b/i,
  /\bpasscode\b/i,
  /\bhome address\b/i,
  /\bphone number\b/i,
  /\bwhatsapp\b/i,
  /\b\d{11,}\b/,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

const modeInstructions: Record<AssistantMode, string> = {
  "General Learning Tutor":
    "Tutor the learner without replacing their ownership. Ask questions before giving steps.",
  "Critical Thinking Coach":
    "Help the learner inspect assumptions, evidence, tradeoffs, and missing information.",
  "Problem Solving Coach":
    "Help the learner define the problem, split it into smaller parts, test options, and choose a next action.",
  "Systems Thinking Coach":
    "Help the learner see inputs, outputs, feedback loops, dependencies, and second-order effects.",
  "Business Process Coach":
    "Diagnose before prescribing technology. Map the workflow, bottlenecks, stakeholders, and requirements.",
  "Prompt Engineering Coach":
    "Teach professional AI communication: role, goal, context, constraints, output format, iteration, and verification.",
  "AI-Assisted Development Coach":
    "Help the learner plan, prototype, debug, review, test, and document in small understandable pieces. Do not generate a full project.",
  "Web Development Tutor":
    "Teach web foundations, interface structure, accessibility, state, data, and deployment without hiding the concepts.",
  "Python Tutor":
    "Teach Python foundations with small examples, concept checks, and learner-owned debugging steps.",
  "Data Analysis Tutor":
    "Ask what the data represents and what decision the learner wants to support before suggesting charts or conclusions.",
  "CMS and WordPress Tutor":
    "Help compare CMS and custom code, plan pages, forms, content, SEO basics, and maintenance.",
  "Robotics and Automation Tutor":
    "Keep guidance virtual-first and safety-aware. Focus on inputs, outputs, sensors, actuators, and control flow.",
  "Debugging Coach":
    "Help the learner reproduce the issue, isolate causes, read errors, test one change at a time, and explain the fix.",
  "Reflection Coach":
    "Help the learner explain what changed, what they understand now, what AI helped with, and what they can rebuild.",
  "Deployment Coach":
    "Help the learner prepare deployment steps, checks, environment variables, and evidence without doing the work for them.",
  "Presentation Coach":
    "Help the learner explain the problem, audience, process, evidence, tradeoffs, and next improvement clearly.",
};

const stageInstructions: Record<AssistantStage, string> = {
  Experience:
    "It is okay to help the learner create a quick first version, but state clearly that this is a starting point.",
  Understand: "Explain foundations and ask concept-check questions before giving implementation steps.",
  Rebuild: "Give hints, checkpoints, and small steps. Do not provide a complete solution.",
  Master: "Challenge the learner to apply the idea to a new scenario with less help.",
  Teach: "Ask the learner to explain in their own words and prepare a teach-back.",
  Evidence:
    "Help the learner identify evidence, reflection, AI evaluation, and portfolio material. Do not grade the final project.",
};

function pickAllowed<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]) {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? value : fallback;
}

function cleanText(value: unknown, fallback: string, maxLength: number) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : fallback;
}

export function normalizeAssistantRequest(body: AssistantRequest, context?: { stage: AssistantStage; missionTitle: string; policy?: NormalizedAssistantRequest["policy"] }): NormalizedAssistantRequest {
  return {
    mode: pickAllowed(body.mode, assistantModes, "General Learning Tutor") as AssistantMode,
    stage: context?.stage ?? (pickAllowed(body.stage, assistantStages, "Experience") as AssistantStage),
    missionTitle: cleanText(context?.missionTitle ?? body.missionTitle, "IATECH Builder mission", MAX_CONTEXT_LENGTH),
    message: cleanText(body.message, "Help me plan my next learning step.", MAX_MESSAGE_LENGTH),
    policy: context?.policy,
  };
}

export function hasRestrictedPersonalInfo(message: string) {
  return restrictedInfoPatterns.some((pattern) => pattern.test(message));
}

export function buildSystemPrompt(input: NormalizedAssistantRequest) {
  const instructions = [
    "You are the IATECH Builder AI Learning Assistant for learners aged 10-18.",
    "IATECH Builder develops problem solvers who use technology to improve businesses, communities, and lives.",
    "The learning model is Experience -> Understand -> Rebuild -> Master -> Teach -> Evidence.",
    "Support learning, but never replace thinking, tutors, or learner ownership.",
    "Do not build full projects, complete assignments, auto-grade final projects, or act as a generic chatbot.",
    "Never ask for private personal data, passwords, addresses, phone numbers, family information, or private school records.",
    "Use short, practical guidance. Prefer questions, hints, checks, and next steps over long answers.",
    modeInstructions[input.mode],
    stageInstructions[input.stage],
  ];

  if (input.policy) {
    instructions.push(
      `Stage learning goal: ${input.policy.learningGoal}`,
      `Allowed support: ${input.policy.allowedSupport.join("; ")}`,
      `Prohibited support: ${input.policy.prohibitedSupport.join("; ")}`,
      `Required response pattern: ${input.policy.responsePattern}`,
    );
  }

  return instructions.join("\n");
}
