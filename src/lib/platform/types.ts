import type { LearningStageLabel, LearnerPathwayLabel } from "@/lib/domain/types";
import type { Mission } from "@/lib/domain/ui-models";

export type CapabilityProgress = { name: string; score: number; evidenceCount: number };
export type EarnedBadge = { id: string; name: string; description: string; awardedAt: string };
export type PortfolioRecord = {
  id: string;
  title: string;
  problem: string;
  summary: string;
  skills: string[];
  artifactUrl: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
};

export type StudentDashboardData = {
  firstName: string;
  initials: string;
  pathway: LearnerPathwayLabel;
  activeMission: Mission | null;
  nextAction: { label: string; href: string; detail: string };
  capabilities: CapabilityProgress[];
  badges: EarnedBadge[];
  portfolio: PortfolioRecord[];
  aiIndependenceScore: number;
};

export type SubmissionDraft = {
  id: string;
  missionId: string;
  missionSlug: string;
  missionTitle: string;
  missionTier: "build" | "ship";
  status: string;
  title: string;
  artifactNote: string;
  artifactUrl: string;
  githubUrl: string;
  liveUrl: string;
  reflection: string;
  teachBack: string;
  aiPrompt: string;
  aiOutput: string;
  aiUseful: string;
  aiWrong: string;
  aiIndependenceScore: number;
  evidence: Array<{ id: string; title: string; kind: string; url: string | null }>;
  revisions: Array<{ id: string; round: number; note: string; createdAt: string }>;
};

export type ReviewQueueItem = {
  id: string;
  studentName: string;
  missionTitle: string;
  tier: string;
  status: string;
  round: number;
  submittedAt: string | null;
  aiWrong: string;
  aiIndependenceScore: number;
};

export type RubricDimension = { code: string; label: string; description: string; weight: number };
export type SubmissionReview = SubmissionDraft & {
  studentName: string;
  aiInteractions: Array<{ id: string; stage: LearningStageLabel; mode: string; message: string; response: string; createdAt: string }>;
  rubric: RubricDimension[];
};
