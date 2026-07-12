"use client";

import { useState } from "react";

const modeGroups: Array<[string, string[]]> = [
  ["Thinking", ["General Learning Tutor", "Critical Thinking Coach", "Problem Solving Coach", "Systems Thinking Coach", "Business Process Coach"]],
  ["Building", ["Web Development Tutor", "Python Tutor", "AI-Assisted Development Coach", "Prompt Engineering Coach", "Debugging Coach", "Deployment Coach"]],
  ["Data and CMS", ["Data Analysis Tutor", "CMS and WordPress Tutor", "Robotics and Automation Tutor"]],
  ["Support", ["Reflection Coach", "Presentation Coach"]],
];

const providerLabels: Record<string, string> = {
  openrouter: "Online help",
  local: "Offline practice mode",
  "local-error": "Offline practice mode",
};

export function AiAssistantPanel({ missionSlug, missionTitle, stage }: { missionSlug: string; missionTitle: string; stage: string }) {
  const [mode, setMode] = useState(modeGroups[0][1][0]);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [provider, setProvider] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAssistant() {
    setLoading(true);
    setAnswer("");
    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          message,
          missionSlug,
          missionTitle,
        }),
      });
      const data = await response.json();
      setProvider(data.provider || "unknown");
      setAnswer(data.text || "The assistant could not respond. Try a smaller question.");
    } catch {
      setProvider("local-error");
      setAnswer("The assistant is unavailable. Try again, or continue with your tutor prompt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel ai-panel">
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <span className="chip purple">AI Learning Assistant</span>
        <span className="meta">
          {provider ? providerLabels[provider] ?? "Online help" : "Stage-aware help for your mission"}
        </span>
      </div>

      <div className="two-column compact-grid" style={{ marginTop: 18 }}>
        <label className="field">
          <span>Assistant mode</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            {modeGroups.map(([group, items]) => (
              <optgroup key={group} label={group}>
                {items.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="field">
          <span>Learning stage</span>
          <strong>{stage}</strong>
          <small className="meta">Set by your mission progress</small>
        </div>
      </div>

      <label className="field" style={{ marginTop: 16 }}>
        <span>Ask for help</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Say what you tried and where you got stuck. Example: my stock counter works, but I need help rebuilding it so I understand the loop."
        />
      </label>

      <p className="safety">
        Do not enter passwords, addresses, phone numbers, family information, or private school records.
      </p>

      <button className="btn ai" type="button" onClick={askAssistant} disabled={loading}>
        {loading ? "Thinking..." : "Ask assistant"}
      </button>

      {answer ? <pre className="assistant-output">{answer}</pre> : null}
    </section>
  );
}
