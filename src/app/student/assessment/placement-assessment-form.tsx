"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { completePlacementAction } from "./actions";

type Question = { title: string; options: readonly (readonly [number, string])[] };

export function PlacementAssessmentForm({ questions }: { questions: readonly Question[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const question = questions[step];
  const selected = answers[step];
  const isLast = step === questions.length - 1;

  return (
    <form action={completePlacementAction} className="placement-form">
      <div className="placement-progress" aria-label={`Question ${step + 1} of ${questions.length}`}>
        <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="placement-count" aria-live="polite">Question {step + 1} of {questions.length}</p>

      {Object.entries(answers).map(([index, value]) => (
        <input key={index} name={`q${Number(index) + 1}`} type="hidden" value={value} />
      ))}

      <fieldset className="placement-question">
        <legend>{question.title}</legend>
        <div className="placement-options">
          {question.options.map(([value, label]) => (
            <label className="placement-option" key={label}>
              <input
                checked={selected === value}
                name="current-answer"
                onChange={() => setAnswers((current) => ({ ...current, [step]: value }))}
                type="radio"
                value={value}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="placement-actions">
        <button className="btn secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)} type="button">
          <ArrowLeft aria-hidden="true" size={18} /> Back
        </button>
        {isLast ? (
          <button className="btn primary" disabled={selected === undefined} type="submit">See my starting level</button>
        ) : (
          <button className="btn primary" disabled={selected === undefined} onClick={() => setStep((current) => current + 1)} type="button">
            Next question <ArrowRight aria-hidden="true" size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
