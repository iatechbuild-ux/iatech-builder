import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { getStudentMissionProgress } from "@/lib/domain";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TeachingLessonPlayer, type LessonBlock } from "./teaching-lesson-player";

type LessonPageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<{ lesson?: string }> };

export default async function DataDrivenLessonPage({ params, searchParams }: LessonPageProps) {
  const [{ slug }, query, supabase] = await Promise.all([params, searchParams, createSupabaseServerClient()]);
  if (!supabase) notFound();
  const [missionResult, progress] = await Promise.all([
    supabase.from("missions").select("id,title").eq("slug", slug).maybeSingle(),
    getStudentMissionProgress(slug),
  ]);
  const mission = missionResult.data;
  if (!mission) notFound();
  const activeStage = progress?.currentStage;
  const stageId = activeStage?.missionStageId;
  const lessonsResult = stageId
    ? await supabase.from("lessons").select("id,title,body_md,estimated_minutes,position").eq("mission_stage_id", stageId).order("position")
    : { data: [] };
  const lessons = lessonsResult.data ?? [];
  const requestedIndex = Number.parseInt(query?.lesson ?? "1", 10) - 1;
  const index = Number.isFinite(requestedIndex) ? Math.min(Math.max(requestedIndex, 0), Math.max(lessons.length - 1, 0)) : 0;
  const lesson = lessons[index];
  const { data: blocksData } = lesson
    ? await supabase.from("lesson_blocks").select("id,block_type,title,body_md,options,position").eq("lesson_id", lesson.id).order("position")
    : { data: [] };
  const blocks = (blocksData ?? []) as LessonBlock[];
  const { data: authData } = await supabase.auth.getUser();
  const blockIds = blocks.map((block) => block.id);
  const { data: completedData } = authData.user && blockIds.length
    ? await supabase.from("student_lesson_block_progress").select("block_id").eq("student_id", authData.user.id).eq("passed", true).in("block_id", blockIds)
    : { data: [] };
  const completedIds = (completedData ?? []).map((row) => row.block_id);

  return (
    <div className="page lesson-player-page">
      <section>
        <Link className="mission-back-link" href={`/missions/${slug}`}><ArrowLeft aria-hidden="true" size={17} /> Mission path</Link>
        <header className="lesson-player-header">
          <div><span className="eyebrow">{activeStage?.stage ?? "Mission"} lesson</span><h1>{lesson?.title ?? activeStage?.title ?? mission.title}</h1></div>
          {lesson?.estimated_minutes ? <span><Clock3 aria-hidden="true" size={17} /> About {lesson.estimated_minutes} min</span> : null}
        </header>

        {blocks.length ? <TeachingLessonPlayer blocks={blocks} completedIds={completedIds} missionSlug={slug} /> : lesson ? (
          <article className="lesson-focus-card">
            <div className="lesson-focus-icon" aria-hidden="true"><BookOpen size={25} /></div>
            <div className="lesson-body"><p>{lesson.body_md}</p></div>
          </article>
        ) : (
          <div className="lesson-focus-card"><div className="lesson-focus-icon" aria-hidden="true"><BookOpen size={25} /></div><div><h2>Learn with your tutor</h2><p>This step has no reading yet. Use the mission instructions and ask your tutor for the activity.</p></div></div>
        )}

        {!blocks.length ? <nav className="lesson-navigation" aria-label="Lesson navigation">
          {index > 0 ? <Link className="btn secondary" href={`/missions/${slug}/lesson?lesson=${index}`}>Previous</Link> : <span />}
          {index < lessons.length - 1
            ? <Link className="btn primary" href={`/missions/${slug}/lesson?lesson=${index + 2}`}>Next lesson <ArrowRight aria-hidden="true" size={18} /></Link>
            : <Link className="btn primary" href={`/missions/${slug}/workspace`}>Try it yourself <ArrowRight aria-hidden="true" size={18} /></Link>}
        </nav> : null}
      </section>
    </div>
  );
}
