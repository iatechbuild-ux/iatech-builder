import Link from "next/link";
import { notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type LessonPageProps = { params: Promise<{ slug: string }> };

export default async function DataDrivenLessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();
  const mission = await supabase.from("missions").select("id,title").eq("slug", slug).maybeSingle();
  if (!mission.data) notFound();
  const stages = await supabase.from("mission_stages").select("id,title,position").eq("mission_id", mission.data.id).order("position");
  const stageIds = (stages.data ?? []).map((stage) => stage.id);
  const lessons = stageIds.length ? await supabase.from("lessons").select("id,mission_stage_id,title,body_md,estimated_minutes,position").in("mission_stage_id", stageIds).order("position") : { data: [] };
  return <div className="page narrow-page"><section><Link className="btn secondary" href={`/missions/${slug}`}>← Back to mission</Link><h1 className="page-title">{mission.data.title}: lessons</h1>{(lessons.data ?? []).length ? <div className="form-grid">{(lessons.data ?? []).map((lesson) => <article className="panel" key={lesson.id}><h2>{lesson.title}</h2><p className="meta">About {lesson.estimated_minutes} minutes</p><p>{lesson.body_md}</p></article>)}</div> : <div className="empty-state"><h2>No lesson published yet</h2><p>Your tutor can still guide the mission stages while curriculum content is prepared.</p></div>}</section></div>;
}
