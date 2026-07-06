import { LearningLabPage } from "@/components/learning-lab-page";
import { learningLabs } from "@/lib/mock-data";

export default function AutomationLabPage() {
  const lab = learningLabs.find((item) => item.slug === "automation-lab") ?? learningLabs[0];
  return <LearningLabPage lab={lab} />;
}
