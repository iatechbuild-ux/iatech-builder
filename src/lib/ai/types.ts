export const assistantModes = [
  "General Learning Tutor",
  "Critical Thinking Coach",
  "Problem Solving Coach",
  "Systems Thinking Coach",
  "Business Process Coach",
  "Prompt Engineering Coach",
  "AI-Assisted Development Coach",
  "Web Development Tutor",
  "Python Tutor",
  "Data Analysis Tutor",
  "CMS and WordPress Tutor",
  "Robotics and Automation Tutor",
  "Debugging Coach",
  "Reflection Coach",
  "Deployment Coach",
  "Presentation Coach",
] as const;

export const assistantStages = [
  "Experience",
  "Understand",
  "Rebuild",
  "Master",
  "Teach",
  "Evidence",
] as const;

export type AssistantMode = (typeof assistantModes)[number];
export type AssistantStage = (typeof assistantStages)[number];

export type AssistantRequest = {
  mode?: string;
  stage?: string;
  message?: string;
  missionTitle?: string;
  missionSlug?: string;
};

export type AssistantStagePolicy = {
  learningGoal: string;
  allowedSupport: string[];
  prohibitedSupport: string[];
  responsePattern: string;
};

export type AssistantContext = {
  stage: AssistantStage;
  missionTitle: string;
  missionId?: string;
  stageKey?: string;
  policy?: AssistantStagePolicy;
};

export type NormalizedAssistantRequest = {
  mode: AssistantMode;
  stage: AssistantStage;
  message: string;
  missionTitle: string;
  policy?: AssistantStagePolicy;
};

export type AssistantResponse = {
  provider: string;
  model?: string;
  text: string;
  safetyFlagged?: boolean;
  fallback?: boolean;
};

export type AssistantProvider = {
  name: string;
  generate(input: NormalizedAssistantRequest): Promise<AssistantResponse>;
};
