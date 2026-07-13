"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { ArrowRight, Check, Lightbulb, LoaderCircle, RotateCcw } from "lucide-react";
import { completeLessonBlockAction, submitLessonCheckAction, type CheckResult } from "./actions";

export type LessonBlock = { id: string; block_type: string; title: string; body_md: string; options: string[]; position: number };
const initialCheck: CheckResult = { status: "idle", message: "" };
const labels: Record<string, string> = { story: "Why this matters", concept: "Learn", worked_example: "Watch", practice: "Try", check: "Quick check", build_step: "Build", reflection: "Look back" };

export function TeachingLessonPlayer({ blocks, completedIds, missionSlug }: { blocks: LessonBlock[]; completedIds: string[]; missionSlug: string }) {
  const openIndex = blocks.findIndex((block) => !completedIds.includes(block.id));
  const [index, setIndex] = useState(openIndex === -1 ? Math.max(0, blocks.length - 1) : openIndex);
  const [locallyComplete, setLocallyComplete] = useState(new Set(completedIds));
  const [isMoving, startMoving] = useTransition();
  const block = blocks[index];
  const isCheck = block?.block_type === "check";
  const [check, checkAction, checking] = useActionState(submitLessonCheckAction, initialCheck);
  const checkPassed = isCheck && (locallyComplete.has(block.id) || check.status === "correct");
  const canContinue = !isCheck || checkPassed;
  const progress = useMemo(() => Math.round(((index + 1) / blocks.length) * 100), [index, blocks.length]);

  useEffect(() => {
    if (check.status === "correct" && block) setLocallyComplete((current) => new Set(current).add(block.id));
  }, [check.status, block]);

  function next() {
    if (!block || !canContinue) return;
    startMoving(async () => {
      if (!isCheck && !locallyComplete.has(block.id)) {
        await completeLessonBlockAction(block.id);
        setLocallyComplete((current) => new Set(current).add(block.id));
      }
      if (index < blocks.length - 1) setIndex((current) => current + 1);
      else window.location.assign(`/missions/${missionSlug}/workspace`);
    });
  }

  if (!block) return null;
  const finalBlock = index === blocks.length - 1;

  return (
    <div className="teaching-engine">
      <div className="teaching-progress" aria-label={`Learning step ${index + 1} of ${blocks.length}`}>
        <div><span>Step {index + 1} of {blocks.length}</span><strong>{progress}%</strong></div>
        <div className="teaching-progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <article className={`teaching-card teaching-card-${block.block_type}`}>
        <span className="teaching-kind"><Lightbulb aria-hidden="true" size={16} /> {labels[block.block_type] ?? "Learn"}</span>
        <h2>{block.title}</h2>
        <p className="teaching-copy">{block.body_md}</p>
        {isCheck ? (
          <form action={checkAction} className="teaching-check">
            <input name="blockId" type="hidden" value={block.id} />
            <fieldset disabled={checking || checkPassed}>
              <legend className="sr-only">Choose one answer</legend>
              {block.options.map((option) => <label key={option}><input name="answer" type="radio" value={option} /><span>{option}</span></label>)}
            </fieldset>
            {!checkPassed ? <button className="btn primary" disabled={checking} type="submit">{checking ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Checking…</> : "Check my answer"}</button> : null}
            {check.status !== "idle" ? <p className={`check-feedback ${check.status}`} aria-live="polite">{check.status === "correct" ? <Check aria-hidden="true" size={18} /> : <RotateCcw aria-hidden="true" size={18} />}{check.message}</p> : null}
          </form>
        ) : null}
      </article>
      <div className="teaching-actions">
        {index > 0 ? <button className="btn secondary" disabled={isMoving} onClick={() => setIndex((current) => current - 1)} type="button">Back</button> : <span />}
        <button className="btn primary" disabled={!canContinue || isMoving} onClick={next} type="button">{isMoving ? <><LoaderCircle className="spin" aria-hidden="true" size={18} /> Saving…</> : <>{finalBlock ? "Open my workspace" : "Continue"} <ArrowRight aria-hidden="true" size={18} /></>}</button>
      </div>
    </div>
  );
}
