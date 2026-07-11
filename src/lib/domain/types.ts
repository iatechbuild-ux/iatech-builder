export const capabilityCodes = ["think", "understand", "build", "improve", "lead"] as const;
export const learnerPathways = ["explorer", "builder", "innovator"] as const;
export const missionTiers = ["build", "ship"] as const;
export const missionStatuses = ["draft", "active", "archived"] as const;
export const learningStageKeys = ["experience", "understand", "rebuild", "master", "teach", "evidence"] as const;

export type CapabilityCode = (typeof capabilityCodes)[number];
export type LearnerPathway = (typeof learnerPathways)[number];
export type MissionTier = (typeof missionTiers)[number];
export type MissionStatus = (typeof missionStatuses)[number];
export type LearningStageKey = (typeof learningStageKeys)[number];
export const missionStageProgressStatuses = ["locked", "available", "in_progress", "submitted", "revision_requested", "completed"] as const;
export type MissionStageProgressStatus = (typeof missionStageProgressStatuses)[number];

export type CapabilityName = "Think" | "Understand" | "Build" | "Improve" | "Lead";
export type LearnerPathwayLabel = "Explorer" | "Builder" | "Innovator";
export type MissionTierLabel = "Build" | "Ship";
export type MissionStatusLabel = "Published" | "Draft" | "Archived";
export type LearningStageLabel = "Experience" | "Understand" | "Rebuild" | "Master" | "Teach" | "Evidence";

export type CompetencyLevel = 1 | 2 | 3 | 4;

export type CapabilityNode = {
  id: string;
  code: string;
  name: string;
  description: string;
  position: number;
  domains: SkillDomainNode[];
};

export type SkillDomainNode = {
  id: string;
  capabilityId: string | null;
  code: string;
  name: string;
  description: string;
  position: number;
  skills: SkillNode[];
};

export type SkillNode = {
  id: string;
  domainId: string;
  code: string;
  name: string;
  description: string;
  position: number;
  competencies: CompetencyNode[];
};

export type CompetencyNode = {
  id: string;
  skillId: string;
  code: string;
  name: string;
  description: string;
  masteryLevel: CompetencyLevel;
};

export type MissionStageNode = {
  id: string;
  stage: LearningStageKey;
  position: number;
  title: string;
  objective: string;
  learnerAction: string;
  tutorGuidance: string;
  assistantGuidance: string;
  evidencePrompt: string;
};

export type MissionNode = {
  id: string;
  slug: string;
  title: string;
  problemStatement: string;
  targetUsers: string;
  tier: MissionTier;
  status: MissionStatus;
  recommendedPathway: LearnerPathway | null;
  capabilities: CapabilityNode[];
  skills: SkillNode[];
  competencies: CompetencyNode[];
  stages: MissionStageNode[];
};

export const capabilityLabelByCode: Record<CapabilityCode, CapabilityName> = {
  think: "Think",
  understand: "Understand",
  build: "Build",
  improve: "Improve",
  lead: "Lead",
};

export const pathwayLabelByKey: Record<LearnerPathway, LearnerPathwayLabel> = {
  explorer: "Explorer",
  builder: "Builder",
  innovator: "Innovator",
};

export const missionTierLabelByKey: Record<MissionTier, MissionTierLabel> = {
  build: "Build",
  ship: "Ship",
};

export const missionStatusLabelByKey: Record<MissionStatus, MissionStatusLabel> = {
  active: "Published",
  draft: "Draft",
  archived: "Archived",
};

export const learningStageLabelByKey: Record<LearningStageKey, LearningStageLabel> = {
  experience: "Experience",
  understand: "Understand",
  rebuild: "Rebuild",
  master: "Master",
  teach: "Teach",
  evidence: "Evidence",
};

export function isLearningStageKey(value: string): value is LearningStageKey {
  return learningStageKeys.includes(value as LearningStageKey);
}

export function isMissionTier(value: string): value is MissionTier {
  return missionTiers.includes(value as MissionTier);
}

export function isMissionStatus(value: string): value is MissionStatus {
  return missionStatuses.includes(value as MissionStatus);
}

export function isLearnerPathway(value: string): value is LearnerPathway {
  return learnerPathways.includes(value as LearnerPathway);
}
