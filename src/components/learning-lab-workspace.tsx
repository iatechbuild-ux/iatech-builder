"use client";

import { useActionState, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { initialLabState, saveLabDraftAction } from "@/app/student/lab-actions";
import type { LearningLab } from "@/lib/domain/ui-models";

export function LearningLabWorkspace({ lab }: { lab: LearningLab }) {
  const [state, action, pending] = useActionState(saveLabDraftAction, initialLabState);
  const [reflection, setReflection] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const storageKey = `iatech-lab-${lab.domainCode}`;
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { const value = JSON.parse(saved) as { reflection?: string; evidenceNote?: string }; setReflection(value.reflection ?? ""); setEvidenceNote(value.evidenceNote ?? ""); } catch { localStorage.removeItem(storageKey); }
    }
  }, [storageKey]);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify({ reflection, evidenceNote })); }, [storageKey, reflection, evidenceNote]);
  useEffect(() => { if (state.status === "saved") localStorage.removeItem(storageKey); }, [state.status, storageKey]);
  return <form action={action} className="form-grid"><input name="domain_code" type="hidden" value={lab.domainCode} />{lab.activities.map((activity) => <label className="option-card" key={activity}><span>{activity}</span><input name="activity" type="checkbox" value={activity} /></label>)}<label className="field"><span>What did you notice?</span><textarea name="reflection" onChange={(event) => setReflection(event.target.value)} value={reflection} /></label><label className="field"><span>Evidence note</span><textarea name="evidence_note" onChange={(event) => setEvidenceNote(event.target.value)} value={evidenceNote} /></label>{state.message ? <p className={`form-message ${state.status}`} role="status">{state.message}</p> : null}<button className="btn primary" disabled={pending} type="submit"><Save aria-hidden="true" size={18} /> Save lab progress</button></form>;
}
