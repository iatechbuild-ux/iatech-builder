import { cache } from "react";

import {
  capabilities as fallbackCapabilities,
  learningLabs as fallbackLearningLabs,
  missions as fallbackMissions,
} from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  capabilityLabelByCode,
  isLearnerPathway,
  isLearningStageKey,
  isMissionStatus,
  isMissionTier,
  learningStageLabelByKey,
  learningStageKeys,
  missionStatusLabelByKey,
  missionTierLabelByKey,
  pathwayLabelByKey,
  type CapabilityName,
  type CapabilityNode,
  type CompetencyLevel,
  type CompetencyNode,
  type LearnerPathway,
  type MissionNode,
  type MissionStageNode,
  type MissionStatus,
  type MissionTier,
  type SkillDomainNode,
  type SkillNode,
} from "./types";
import type { Capability, LearningLab, Mission, MissionStage } from "./ui-models";

type CapabilityRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  position: number | null;
};

type SkillDomainRow = {
  id: string;
  capability_id: string | null;
  code: string;
  name: string;
  description: string | null;
  position: number | null;
};

type SkillRow = {
  id: string;
  domain_id: string;
  code: string;
  name: string;
  description: string | null;
  position: number | null;
};

type CompetencyRow = {
  id: string;
  skill_id: string;
  code: string;
  name: string;
  description: string | null;
  mastery_level: number;
};

type MissionRow = {
  id: string;
  slug: string;
  title: string;
  problem_statement: string;
  target_users: string | null;
  tier: string;
  status: string;
  recommended_pathway: string | null;
};

type MissionStageRow = {
  id: string;
  mission_id: string;
  stage: string;
  position: number;
  title: string;
  objective: string;
  learner_action: string | null;
  tutor_guidance: string | null;
  assistant_guidance: string | null;
  evidence_prompt: string | null;
};

type MissionSkillRow = {
  mission_id: string;
  skill_id: string;
};

type MissionPrerequisiteRow = {
  mission_id: string;
  required_competency_id: string;
};

const labRouteByDomainCode: Record<string, Pick<LearningLab, "slug" | "title" | "promise" | "scenario" | "primaryAction" | "activities" | "evidence" | "prompt">> = {
  "data-analysis": {
    slug: "data-lab",
    title: "Data Lab",
    promise: "Turn messy records into a decision someone can use.",
    scenario: "A market seller wants to know which products sell fastest before restocking.",
    primaryAction: "Build a sales insight",
    activities: ["Collect rows", "Clean missing values", "Choose a chart", "Explain the decision"],
    evidence: ["Dataset notes", "Chart screenshot", "Insight summary", "Assumption check"],
    prompt:
      "Here is my sales dataset context. Help me find patterns, missing data, useful charts, and questions I should ask before making a conclusion.",
  },
  "cms-no-code": {
    slug: "cms-planner",
    title: "CMS Planner",
    promise: "Choose CMS or custom code based on the real website need.",
    scenario: "A training centre needs a website with programme pages, enquiry forms, and easy updates.",
    primaryAction: "Plan the site",
    activities: ["Map pages", "Choose CMS vs custom code", "Plan forms", "Check SEO basics"],
    evidence: ["Site map", "Tool choice rationale", "Form plan", "Maintenance checklist"],
    prompt:
      "Act as a website strategist. Recommend website structure, pages, forms, basic SEO, and whether CMS or custom code is better for this business.",
  },
  "automation-robotics": {
    slug: "automation-lab",
    title: "Automation Lab",
    promise: "Design automation logic virtually before touching hardware.",
    scenario: "A school wants a smart dustbin concept that signals when it is full.",
    primaryAction: "Map the automation logic",
    activities: ["Identify inputs", "Identify outputs", "Draw control flow", "List failure cases"],
    evidence: ["Input-output map", "Flowchart", "Simulation notes", "Safety reflection"],
    prompt:
      "Help me design the automation logic for a smart dustbin. Identify inputs, outputs, sensors, actuators, and step-by-step control flow.",
  },
};

function toCapabilityName(code: string, fallback: string): CapabilityName {
  if (code in capabilityLabelByCode) {
    return capabilityLabelByCode[code as keyof typeof capabilityLabelByCode];
  }

  if (fallback === "Think" || fallback === "Understand" || fallback === "Build" || fallback === "Improve" || fallback === "Lead") {
    return fallback;
  }

  return "Build";
}

function toCapabilityFrameworkFallback(): CapabilityNode[] {
  return fallbackCapabilities.map((capability, capabilityIndex) => ({
    id: capability.name.toLowerCase(),
    code: capability.name.toLowerCase(),
    name: capability.name,
    description: capability.description,
    position: capabilityIndex + 1,
    domains: capability.domains.map((domain, domainIndex) => ({
      id: `${capability.name.toLowerCase()}-${domainIndex}`,
      capabilityId: capability.name.toLowerCase(),
      code: domain.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: domain,
      description: "",
      position: domainIndex + 1,
      skills: [],
    })),
  }));
}

function mapCapabilityRows(rows: CapabilityRow[], domainRows: SkillDomainRow[], skillRows: SkillRow[], competencyRows: CompetencyRow[]) {
  const competenciesBySkill = new Map<string, CompetencyNode[]>();
  const skillsByDomain = new Map<string, SkillNode[]>();
  const domainsByCapability = new Map<string, SkillDomainNode[]>();

  for (const competency of competencyRows) {
    const node: CompetencyNode = {
      id: competency.id,
      skillId: competency.skill_id,
      code: competency.code,
      name: competency.name,
      description: competency.description ?? "",
      masteryLevel: Math.min(4, Math.max(1, competency.mastery_level)) as CompetencyLevel,
    };
    competenciesBySkill.set(competency.skill_id, [...(competenciesBySkill.get(competency.skill_id) ?? []), node]);
  }

  for (const skill of skillRows) {
    const node: SkillNode = {
      id: skill.id,
      domainId: skill.domain_id,
      code: skill.code,
      name: skill.name,
      description: skill.description ?? "",
      position: skill.position ?? 0,
      competencies: competenciesBySkill.get(skill.id) ?? [],
    };
    skillsByDomain.set(skill.domain_id, [...(skillsByDomain.get(skill.domain_id) ?? []), node]);
  }

  for (const domain of domainRows) {
    const node: SkillDomainNode = {
      id: domain.id,
      capabilityId: domain.capability_id,
      code: domain.code,
      name: domain.name,
      description: domain.description ?? "",
      position: domain.position ?? 0,
      skills: skillsByDomain.get(domain.id) ?? [],
    };

    if (domain.capability_id) {
      domainsByCapability.set(domain.capability_id, [...(domainsByCapability.get(domain.capability_id) ?? []), node]);
    }
  }

  return rows.map((capability) => ({
    id: capability.id,
    code: capability.code,
    name: capability.name,
    description: capability.description ?? "",
    position: capability.position ?? 0,
    domains: domainsByCapability.get(capability.id) ?? [],
  }));
}

export const getCapabilityFramework = cache(async (): Promise<CapabilityNode[]> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return toCapabilityFrameworkFallback();
  }

  const [capabilitiesResult, domainsResult, skillsResult, competenciesResult] = await Promise.all([
    supabase.from("capabilities").select("id, code, name, description, position").order("position"),
    supabase.from("skill_domains").select("id, capability_id, code, name, description, position").order("position"),
    supabase.from("skills").select("id, domain_id, code, name, description, position").order("position"),
    supabase.from("competencies").select("id, skill_id, code, name, description, mastery_level").order("mastery_level"),
  ]);

  if (capabilitiesResult.error || domainsResult.error || skillsResult.error || competenciesResult.error || !capabilitiesResult.data?.length) {
    return toCapabilityFrameworkFallback();
  }

  return mapCapabilityRows(
    capabilitiesResult.data as CapabilityRow[],
    (domainsResult.data ?? []) as SkillDomainRow[],
    (skillsResult.data ?? []) as SkillRow[],
    (competenciesResult.data ?? []) as CompetencyRow[],
  );
});

export async function getCapabilityCards(): Promise<Capability[]> {
  const framework = await getCapabilityFramework();

  return framework.map((capability) => ({
    name: toCapabilityName(capability.code, capability.name),
    description: capability.description,
    domains: capability.domains.map((domain) => domain.name),
  }));
}

export async function getLearningLabs(): Promise<LearningLab[]> {
  const framework = await getCapabilityFramework();
  const labs = framework.flatMap((capability) =>
    capability.domains.flatMap((domain) => {
      const route = labRouteByDomainCode[domain.code];

      if (!route) {
        return [];
      }

      return [
        {
          ...route,
          domainCode: domain.code,
          domain: domain.name,
          capability: toCapabilityName(capability.code, capability.name),
        },
      ];
    }),
  );

  return labs.length ? labs : fallbackLearningLabs.map((lab) => ({
    ...lab,
    domainCode: lab.slug === "data-lab" ? "data-analysis" : lab.slug === "cms-planner" ? "cms-no-code" : "automation-robotics",
  }));
}

function fallbackMissionCatalog(): Mission[] {
  return fallbackMissions.map((mission) => ({
    ...mission,
    capabilityTags: mission.capabilityTags
      .filter((tag): tag is CapabilityName => tag === "Think" || tag === "Understand" || tag === "Build" || tag === "Improve" || tag === "Lead"),
  }));
}

function getMissionStage(stages: MissionStageNode[], key: string) {
  return stages.find((stage) => stage.stage === key);
}

function mapStageToUi(stage: MissionStageNode, index: number): MissionStage | null {
  const stageLabel = learningStageLabelByKey[stage.stage];
  return {
    stage: stageLabel as MissionStage["stage"],
    title: stage.title,
    instructions: stage.learnerAction || stage.objective,
    evidence: stage.evidencePrompt,
    status: index === 0 ? "current" : "locked",
  };
}

function missionProgress(stages: MissionStage[]) {
  if (!stages.length) {
    return 0;
  }

  const doneCount = stages.filter((stage) => stage.status === "done").length;
  const currentCount = stages.some((stage) => stage.status === "current") ? 0.5 : 0;

  return Math.round(((doneCount + currentCount) / stages.length) * 100);
}

function mapMissionRowsToUi(
  missionRows: MissionRow[],
  stageRows: MissionStageRow[],
  missionSkillRows: MissionSkillRow[],
  missionPrerequisiteRows: MissionPrerequisiteRow[],
  framework: CapabilityNode[],
): Mission[] {
  const capabilitiesByDomainId = new Map<string, CapabilityNode>();
  const skillsById = new Map<string, SkillNode>();
  const competenciesById = new Map<string, CompetencyNode>();

  for (const capability of framework) {
    for (const domain of capability.domains) {
      capabilitiesByDomainId.set(domain.id, capability);

      for (const skill of domain.skills) {
        skillsById.set(skill.id, skill);

        for (const competency of skill.competencies) {
          competenciesById.set(competency.id, competency);
        }
      }
    }
  }

  return missionRows.map((row) => {
    const tier: MissionTier = isMissionTier(row.tier) ? row.tier : "build";
    const status: MissionStatus = isMissionStatus(row.status) ? row.status : "draft";
    const pathway: LearnerPathway = row.recommended_pathway && isLearnerPathway(row.recommended_pathway) ? row.recommended_pathway : "explorer";
    const stages = stageRows
      .filter((stage) => stage.mission_id === row.id && isLearningStageKey(stage.stage))
      .map((stage) => ({
        id: stage.id,
        stage: stage.stage as MissionStageNode["stage"],
        position: stage.position,
        title: stage.title,
        objective: stage.objective,
        learnerAction: stage.learner_action ?? "",
        tutorGuidance: stage.tutor_guidance ?? "",
        assistantGuidance: stage.assistant_guidance ?? "",
        evidencePrompt: stage.evidence_prompt ?? "",
      }))
      .sort((a, b) => a.position - b.position);
    const uiStages = stages.map(mapStageToUi).filter((stage): stage is MissionStage => Boolean(stage));
    const skillIds = missionSkillRows.filter((skill) => skill.mission_id === row.id).map((skill) => skill.skill_id);
    const skills = skillIds.map((skillId) => skillsById.get(skillId)).filter((skill): skill is SkillNode => Boolean(skill));
    const capabilityTags = Array.from(
      new Map(
        skills
          .map((skill) => capabilitiesByDomainId.get(skill.domainId))
          .filter((capability): capability is CapabilityNode => Boolean(capability))
          .map((capability) => [capability.code, toCapabilityName(capability.code, capability.name)]),
      ).values(),
    );
    const competencies = missionPrerequisiteRows
      .filter((prerequisite) => prerequisite.mission_id === row.id)
      .map((prerequisite) => competenciesById.get(prerequisite.required_competency_id))
      .filter((competency): competency is CompetencyNode => Boolean(competency));
    const experience = getMissionStage(stages, "experience");
    const understand = getMissionStage(stages, "understand");
    const rebuild = getMissionStage(stages, "rebuild");
    const master = getMissionStage(stages, "master");
    const teach = getMissionStage(stages, "teach");
    const evidence = getMissionStage(stages, "evidence");

    return {
      id: row.slug,
      title: row.title,
      slug: row.slug,
      problem: row.problem_statement,
      audience: row.target_users ?? "Real user",
      tier: missionTierLabelByKey[tier],
      pathway: pathwayLabelByKey[pathway],
      progress: missionProgress(uiStages),
      status: status === "archived" ? "Review" : missionStatusLabelByKey[status],
      currentStage: uiStages[0]?.stage ?? "Experience",
      badge: competencies[0]?.name ?? skills[0]?.name ?? "Future Builder",
      capabilityTags,
      skillTags: skills.map((skill) => skill.name),
      competencies: competencies.map((competency) => competency.name),
      aiSprint: experience?.assistantGuidance || experience?.learnerAction || "Use AI to explore first, then question assumptions.",
      foundationLesson: understand?.objective ?? "Understand the foundation before rebuilding.",
      rebuildTask: rebuild?.learnerAction || rebuild?.objective || "Rebuild with increasing independence.",
      masteryChallenge: master?.learnerAction || master?.objective || "Apply the skill to a new problem.",
      teachActivity: teach?.learnerAction || teach?.objective || "Explain the work clearly to another person.",
      evidenceRequirements: (evidence?.evidencePrompt || stages.map((stage) => stage.evidencePrompt).filter(Boolean).join(", "))
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      stages: uiStages,
    };
  });
}

export const getMissionCatalog = cache(async (): Promise<Mission[]> => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackMissionCatalog();
  }

  const [missionResult, stageResult, missionSkillResult, prerequisiteResult, framework] = await Promise.all([
    supabase
      .from("missions")
      .select("id, slug, title, problem_statement, target_users, tier, status, recommended_pathway")
      .eq("status", "active")
      .order("created_at"),
    supabase
      .from("mission_stages")
      .select("id, mission_id, stage, position, title, objective, learner_action, tutor_guidance, assistant_guidance, evidence_prompt")
      .order("position"),
    supabase.from("mission_skills").select("mission_id, skill_id"),
    supabase.from("mission_prerequisites").select("mission_id, required_competency_id"),
    getCapabilityFramework(),
  ]);

  if (missionResult.error || stageResult.error || missionSkillResult.error || prerequisiteResult.error || !missionResult.data?.length) {
    return fallbackMissionCatalog();
  }

  const missions = mapMissionRowsToUi(
    missionResult.data as MissionRow[],
    (stageResult.data ?? []) as MissionStageRow[],
    (missionSkillResult.data ?? []) as MissionSkillRow[],
    (prerequisiteResult.data ?? []) as MissionPrerequisiteRow[],
    framework,
  );

  return missions.length ? missions : fallbackMissionCatalog();
});

export async function getMissionBySlug(slug: string): Promise<Mission | null> {
  const missions = await getMissionCatalog();
  return missions.find((mission) => mission.slug === slug) ?? null;
}

export type MissionLesson = {
  title: string;
  objective: string;
  body: string;
  tutorGuidance: string;
};

export async function getMissionLesson(slug: string, stage = "understand"): Promise<MissionLesson | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const mission = await supabase.from("missions").select("id").eq("slug", slug).maybeSingle();
  if (!mission.data) return null;
  const stageResult = await supabase.from("mission_stages").select("id, objective, tutor_guidance").eq("mission_id", mission.data.id).eq("stage", stage).maybeSingle();
  if (!stageResult.data) return null;
  const lesson = await supabase.from("lessons").select("title, body_md").eq("mission_stage_id", stageResult.data.id).order("position").limit(1).maybeSingle();
  if (!lesson.data) return null;
  return { title: lesson.data.title, objective: stageResult.data.objective, body: lesson.data.body_md, tutorGuidance: stageResult.data.tutor_guidance ?? "Ask questions, listen for understanding, and avoid completing the work for the learner." };
}

export function nextMissionStageSlug(currentStage: string) {
  const normalizedStage = currentStage.toLowerCase();
  const index = learningStageKeys.findIndex((stage) => stage === normalizedStage);

  if (index < 0) {
    return "experience";
  }

  return learningStageKeys[Math.min(index + 1, learningStageKeys.length - 1)];
}
