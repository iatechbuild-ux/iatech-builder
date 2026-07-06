import { LearningLabPage } from "@/components/learning-lab-page";
import { learningLabs } from "@/lib/mock-data";

export default function CmsPlannerPage() {
  const lab = learningLabs.find((item) => item.slug === "cms-planner") ?? learningLabs[0];
  return <LearningLabPage lab={lab} />;
}
