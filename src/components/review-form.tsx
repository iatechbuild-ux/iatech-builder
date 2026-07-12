"use client";

import { useActionState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { initialReviewState, reviewSubmissionAction } from "@/app/tutor/review/actions";
import type { RubricDimension } from "@/lib/platform";

export function ReviewForm({ submissionId, rubric }: { submissionId: string; rubric: RubricDimension[] }) {
  const [state, action, pending] = useActionState(reviewSubmissionAction, initialReviewState);
  return (
    <form action={action} className="form-grid">
      <input name="submission_id" type="hidden" value={submissionId} />
      {state.message ? <p className={`form-message ${state.status}`} role="status">{state.message}</p> : null}
      <p className="meta">Scores: 0 absent · 1 prompted · 2 with guidance · 3 independent · 4 leads others</p>
      <div className="rubric">
        {rubric.map((dimension) => <fieldset className={`rubric-input ${dimension.code === "ai_evaluation" ? "ai-row" : ""}`} key={dimension.code}>
          <input name="dimension" type="hidden" value={dimension.code} />
          <legend>{dimension.label} <span className="meta">{dimension.weight}%</span></legend>
          <p className="meta">{dimension.description}</p>
          <div className="score-options" aria-label={`${dimension.label} score`}>
            {[0, 1, 2, 3, 4].map((score) => <label key={score}><input defaultChecked={score === 2} name={`score_${dimension.code}`} type="radio" value={score} /><span>{score}</span></label>)}
          </div>
          <label className="field"><span>Dimension feedback</span><textarea name={`comment_${dimension.code}`} maxLength={1000} rows={2} /></label>
        </fieldset>)}
      </div>
      <label className="field"><span>Feedback summary</span><textarea maxLength={4000} name="summary" required placeholder="Name what the learner demonstrated and the most important improvement." /></label>
      <label className="field"><span>Specific next step for a revision</span><textarea maxLength={2000} name="next_step" placeholder="Required only when requesting revision." /></label>
      <div className="actions sticky-actions">
        <button className="btn secondary" disabled={pending} name="decision" type="submit" value="revision_requested"><RotateCcw aria-hidden="true" size={18} /> Request revision</button>
        <button className="btn primary" disabled={pending} name="decision" type="submit" value="approved"><CheckCircle2 aria-hidden="true" size={18} /> Approve project</button>
      </div>
    </form>
  );
}
