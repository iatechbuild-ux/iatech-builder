"use client";

import { useActionState, useEffect, useState } from "react";
import { Save, Send, Upload } from "lucide-react";

import { initialSubmissionState, saveSubmissionAction } from "@/app/student/submission/actions";
import type { SubmissionDraft } from "@/lib/platform";

type DraftValues = Pick<SubmissionDraft, "title" | "artifactNote" | "artifactUrl" | "githubUrl" | "liveUrl" | "reflection" | "teachBack" | "aiPrompt" | "aiOutput" | "aiUseful" | "aiWrong" | "aiIndependenceScore"> & { aiUsed: boolean };

export function SubmissionForm({ draft }: { draft: SubmissionDraft }) {
  const storageKey = `iatech-submission-${draft.id}`;
  const [state, formAction, pending] = useActionState(saveSubmissionAction, initialSubmissionState);
  const [online, setOnline] = useState(true);
  const [values, setValues] = useState<DraftValues>({
    title: draft.title,
    artifactNote: draft.artifactNote,
    artifactUrl: draft.artifactUrl,
    githubUrl: draft.githubUrl,
    liveUrl: draft.liveUrl,
    reflection: draft.reflection,
    teachBack: draft.teachBack,
    aiPrompt: draft.aiPrompt,
    aiOutput: draft.aiOutput,
    aiUseful: draft.aiUseful,
    aiWrong: draft.aiWrong,
    aiIndependenceScore: draft.aiIndependenceScore,
    aiUsed: Boolean(draft.aiPrompt || draft.aiOutput),
  });

  useEffect(() => {
    setOnline(navigator.onLine);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setValues((current) => ({ ...current, ...(JSON.parse(saved) as Partial<DraftValues>) })); } catch { localStorage.removeItem(storageKey); }
    }
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(values));
  }, [storageKey, values]);

  useEffect(() => {
    if (state.status === "saved" || state.status === "submitted") localStorage.removeItem(storageKey);
  }, [state.status, storageKey]);

  function set<K extends keyof DraftValues>(key: K, value: DraftValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form action={formAction} className="form-grid">
      <input name="submission_id" type="hidden" value={draft.id} />
      {online ? null : (
        <div className="notice" role="status">
          You're offline. Your text is safe on this device — reconnect before uploading a file or sending to your tutor.
        </div>
      )}
      {state.message ? <p className={`form-message ${state.status}`} role="status">{state.message}</p> : null}

      <label className="field"><span>Project title</span><input name="title" value={values.title} onChange={(event) => set("title", event.target.value)} maxLength={120} /></label>
      <label className="field"><span>What did you build?</span><textarea name="artifact_note" value={values.artifactNote} onChange={(event) => set("artifactNote", event.target.value)} maxLength={2000} placeholder="Describe what works and who it helps." /></label>
      <label className="field"><span>Working artifact link (optional)</span><input name="artifact_url" type="url" value={values.artifactUrl} onChange={(event) => set("artifactUrl", event.target.value)} inputMode="url" /></label>
      <div className="two-column compact-grid">
        <label className="field"><span>Code link {draft.missionTier === "ship" ? "(required)" : "(optional)"}</span><input name="github_url" type="url" value={values.githubUrl} onChange={(event) => set("githubUrl", event.target.value)} inputMode="url" /></label>
        <label className="field"><span>Live link {draft.missionTier === "ship" ? "(required)" : "(optional)"}</span><input name="live_url" type="url" value={values.liveUrl} onChange={(event) => set("liveUrl", event.target.value)} inputMode="url" /></label>
      </div>
      <label className="upload-zone">
        <Upload aria-hidden="true" size={24} />
        <strong>Add screenshot or PDF</strong>
        <span className="meta">PNG, JPG, WebP, or PDF. Maximum 5 MB.</span>
        <input accept="image/png,image/jpeg,image/webp,application/pdf" name="evidence_file" type="file" disabled={!online} />
      </label>

      {draft.evidence.length ? (
        <section>
          <h2>Saved evidence</h2>
          <div className="chip-row">
            {draft.evidence.map((item) =>
              item.url ? (
                <a className="chip teal" href={item.url} key={item.id} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ) : (
                <span className="chip teal" key={item.id}>{item.title}</span>
              ),
            )}
          </div>
        </section>
      ) : null}

      <label className="field"><span>Reflection</span><textarea name="reflection" value={values.reflection} onChange={(event) => set("reflection", event.target.value)} maxLength={4000} placeholder="What worked, what failed, and what would you improve?" /></label>
      <label className="field"><span>Teach-back</span><textarea name="teach_back" value={values.teachBack} onChange={(event) => set("teachBack", event.target.value)} maxLength={4000} placeholder="Explain the important idea in your own words." /></label>

      <section className="panel ai-panel">
        <label className={`option-card${values.aiUsed ? " selected" : ""}`}><span>I used AI while working on this mission</span><input checked={values.aiUsed} name="ai_used" onChange={(event) => set("aiUsed", event.target.checked)} type="checkbox" /></label>
        {values.aiUsed ? <div className="form-grid" style={{ marginTop: 16 }}>
          <label className="field"><span>Prompt used</span><textarea name="ai_prompt" value={values.aiPrompt} onChange={(event) => set("aiPrompt", event.target.value)} maxLength={4000} /></label>
          <label className="field"><span>AI response</span><textarea name="ai_output" value={values.aiOutput} onChange={(event) => set("aiOutput", event.target.value)} maxLength={8000} /></label>
          <label className="field"><span>What was useful?</span><textarea name="ai_useful" value={values.aiUseful} onChange={(event) => set("aiUseful", event.target.value)} maxLength={2000} /></label>
          <label className="field"><span>What was wrong, missing, or assumed?</span><textarea name="ai_wrong" value={values.aiWrong} onChange={(event) => set("aiWrong", event.target.value)} maxLength={2000} /></label>
          <label className="field">
            <span>
              How independent were you? {values.aiIndependenceScore} –{" "}
              {["AI did most of it", "AI helped a lot", "AI helped a little", "I worked independently"][values.aiIndependenceScore - 1] ?? "AI helped a lot"}
            </span>
            <input max="4" min="1" name="ai_independence_score" onChange={(event) => set("aiIndependenceScore", Number(event.target.value))} step="1" type="range" value={values.aiIndependenceScore} />
          </label>
        </div> : <input name="ai_independence_score" type="hidden" value="1" />}
      </section>

      {draft.revisions.length ? <section className="panel warning-panel"><h2>Revision history</h2>{draft.revisions.map((revision) => <div key={revision.id}><strong>Round {revision.round}</strong><p>{revision.note}</p></div>)}</section> : null}

      <div className="actions sticky-actions">
        <button className="btn secondary" disabled={pending || !online} name="intent" type="submit" value="save"><Save aria-hidden="true" size={18} /> Save draft</button>
        <button className="btn primary" disabled={pending || !online} name="intent" type="submit" value="submit"><Send aria-hidden="true" size={18} /> Send to tutor</button>
      </div>
    </form>
  );
}
