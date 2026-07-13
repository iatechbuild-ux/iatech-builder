import DataDrivenLessonPage from "../../[slug]/lesson/page";

type LessonPageProps = { searchParams?: Promise<{ lesson?: string }> };

export default function NeverCountTwiceLessonPage({ searchParams }: LessonPageProps) {
  return <DataDrivenLessonPage params={Promise.resolve({ slug: "never-count-twice" })} searchParams={searchParams} />;
}
