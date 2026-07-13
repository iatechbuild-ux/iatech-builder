"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, Send } from "lucide-react";
import { saveStageEvidenceAction, type EvidenceSaveState } from "../../never-count-twice/actions";
import type { EvidenceRequirement } from "@/lib/domain/mission-engine";

const initialState: EvidenceSaveState = { status: "idle", message: "" };

export function EvidenceWorkspace({ missionSlug, progressId, requirements }: { missionSlug: string; progressId: string; requirements: EvidenceRequirement[] }) {
  const storageKey = `iatech-evidence:${progressId}`;
  const [state, formAction, pending] = useActionState(saveStageEvidenceAction, initialState);
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(requirements.map((item) => [item.id, item.response])));
  const [localSaved, setLocalSaved] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setValues((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    hydrated.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(values));
    setLocalSaved(true);
    const timer = window.setTimeout(() => setLocalSaved(false), 1400);
    return () => window.clearTimeout(timer);
  }, [storageKey, values]);

  return (
    <form action={formAction} className="evidence-workspace-form">
      <input name="missionSlug" type="hidden" value={missionSlug} />
      <input name="progressId" type="hidden" value={progressId} />
      {requirements.map((requirement, index) => (
        <label className="evidence-prompt" htmlFor={`evidence-${requirement.id}`} key={requirement.id}>
          <span className="evidence-prompt-number">{index + 1}</span>
          <span><strong>{requirement.title}</strong>{requirement.description ? <small>{requirement.description}</small> : null}</span>
          <input name="requirementId" type="hidden" value={requirement.id} />
          <textarea
            id={`evidence-${requirement.id}`}
            name={`evidence_${requirement.id}`}
            onChange={(event) => setValues((current) => ({ ...current, [requirement.id]: event.target.value }))}
            placeholder="Write what you tried, noticed, or changed…"
            required={requirement.required}
            value={values[requirement.id] ?? ""}
          />
        </label>
      ))}
      <div className="evidence-save-bar">
        <span aria-live="polite">{pending ? "Saving…" : state.status === "error" ? state.message : localSaved ? "Saved on this device" : state.status === "success" ? <><Check aria-hidden="true" size={16} /> Saved to your account</> : "Your words save on this device as you type."}</span>
        <div>
          <button className="btn secondary" disabled={pending} name="intent" type="submit" value="save">Save now</button>
          <button className="btn primary" disabled={pending} name="intent" type="submit" value="submit">Send to my tutor <Send aria-hidden="true" size={17} /></button>
        </div>
      </div>
    </form>
  );
}
