"use client";

import { useState } from "react";

const modes = [
  "General Learning Tutor",
  "Critical Thinking Coach",
  "Problem Solving Coach",
  "Systems Thinking Coach",
  "Business Process Coach",
  "Prompt Engineering Coach",
  "AI-Assisted Development Coach",
  "Web Development Tutor",
  "Python Tutor",
  "Data Analysis Tutor",
  "CMS and WordPress Tutor",
  "Robotics and Automation Tutor",
  "Debugging Coach",
  "Reflection Coach",
  "Deployment Coach",
  "Presentation Coach",
];

export function AiAssistantPanel({ missionSlug, missionTitle, stage }: { missionSlug: string; missionTitle: string; stage: string }) {
  const [mode, setMode] = useState(modes[0]);
  const [message, setMessage] = useState(
    "I have a first stock counter idea, but I need help rebuilding it so I understand the loop.",
  );
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
          {provider ? `Provider: ${provider}` : "OpenRouter when configured; local fallback otherwise"}
        </span>
      </div>

      <div className="two-column compact-grid" style={{ marginTop: 18 }}>
        <label className="field">
          <span>Assistant mode</span>
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            {modes.map((item) => (
              <option key={item}>{item}</option>
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
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
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
