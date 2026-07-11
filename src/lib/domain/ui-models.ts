import type { CapabilityName, LearnerPathwayLabel, LearningStageLabel, MissionStatusLabel, MissionTierLabel } from "./types";

export type MasteryLevel = "Awareness" | "Application" | "Independence" | "Leadership";
export type StageStatus = "done" | "current" | "locked" | "submitted" | "revision_requested";

export type MissionStage = {
  stage: LearningStageLabel;
  title: string;
  instructions: string;
  evidence: string;
  status: StageStatus;
};

export type Mission = {
  id: string;
  title: string;
  slug: string;
  problem: string;
  audience: string;
  tier: MissionTierLabel;
  pathway: LearnerPathwayLabel;
  progress: number;
  status: MissionStatusLabel | "Review";
  currentStage: LearningStageLabel;
  badge: string;
  capabilityTags: CapabilityName[];
  skillTags: string[];
  competencies: string[];
  aiSprint: string;
  foundationLesson: string;
  rebuildTask: string;
  masteryChallenge: string;
  teachActivity: string;
  evidenceRequirements: string[];
  stages: MissionStage[];
};

export type Capability = {
  name: CapabilityName;
  description: string;
  domains: string[];
};

export type LearningLab = {
  slug: string;
  domainCode: string;
  title: string;
  domain: string;
  capability: CapabilityName;
  promise: string;
  scenario: string;
  primaryAction: string;
  activities: string[];
  evidence: string[];
  prompt: string;
};

export type Badge = {
  name: string;
  competency: string;
  level: MasteryLevel;
  earned: boolean;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  liveUrl: string;
  githubUrl: string;
  competencies: string[];
  capabilities: string[];
  evidenceTypes: string[];
  status: "Approved" | "In review" | "Revision requested";
  note?: string;
};

export type Submission = {
  id: string;
  studentName: string;
  missionTitle: string;
  status: "Pending review" | "Approved" | "Revision requested";
  submittedAt: string;
  aiWrong: string;
  independenceLevel: string;
};
