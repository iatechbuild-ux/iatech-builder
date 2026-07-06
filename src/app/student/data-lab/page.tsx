import { LearningLabPage } from "@/components/learning-lab-page";
import { learningLabs } from "@/lib/mock-data";

export default function DataLabPage() {
  const lab = learningLabs.find((item) => item.slug === "data-lab") ?? learningLabs[0];
  return <LearningLabPage lab={lab} />;
}
