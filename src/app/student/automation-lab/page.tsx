import { LearningLabPage } from "@/components/learning-lab-page";
import { notFound } from "next/navigation";
import { getLearningLabs } from "@/lib/domain";

export default async function AutomationLabPage() {
  const lab = (await getLearningLabs()).find((item) => item.slug === "automation-lab");
  if (!lab) notFound();
  return <LearningLabPage lab={lab} />;
}
