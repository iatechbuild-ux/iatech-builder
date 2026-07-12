import type { EmailPayload, EmailTemplateKey, RenderedEmail } from "./types";

const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function absoluteUrl(path: string) {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function frame(preview: string, heading: string, body: string, action?: { label: string; href: string }) {
  const actionHtml = action
    ? `<p style="margin:28px 0"><a href="${escapeHtml(action.href)}" style="background:#153f3a;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;font-weight:700;display:inline-block">${escapeHtml(action.label)}</a></p>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(preview)}</title></head><body style="margin:0;background:#f4f6f5;color:#17211f;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${escapeHtml(preview)}</div><main style="max-width:600px;margin:0 auto;padding:32px 16px"><div style="background:#fff;border:1px solid #dce3e1;border-radius:8px;overflow:hidden"><div style="height:6px;background:#e66a45"></div><div style="padding:28px"><p style="margin:0 0 22px;color:#153f3a;font-size:13px;font-weight:800;letter-spacing:.08em">IATECH BUILDER</p><h1 style="font-size:26px;line-height:1.25;margin:0 0 18px">${escapeHtml(heading)}</h1>${body}${actionHtml}<p style="margin:28px 0 0;color:#66736f;font-size:13px;line-height:1.6">IATECH Builder helps learners think, build, reflect, and produce evidence of real capability.</p></div></div></main></body></html>`;
}

export function renderEmail(template: EmailTemplateKey, payload: EmailPayload): RenderedEmail {
  const name = String(payload.name || "there");
  switch (template) {
    case "welcome": {
      const subject = "Welcome to IATECH Builder";
      const dashboardPath = String(payload.dashboardPath || "/student/dashboard");
      return { subject, text: `Welcome, ${name}. Your builder journey is ready. Open your dashboard: ${absoluteUrl(dashboardPath)}`, html: frame(subject, `Welcome, ${name}`, "<p>Your workspace is ready. Start with the next mission action and build evidence as you move from experience to mastery.</p>", { label: "Open your dashboard", href: absoluteUrl(dashboardPath) }) };
    }
    case "submission_received": {
      const mission = String(payload.mission || "a learner mission");
      const subject = `Project ready for review: ${mission}`;
      return { subject, text: `${name} submitted ${mission}. Review it at ${absoluteUrl("/tutor/dashboard")}`, html: frame(subject, "A project is ready for review", `<p><strong>${escapeHtml(name)}</strong> submitted evidence for <strong>${escapeHtml(mission)}</strong>.</p><p>Review the work, score the rubric, and give the learner a clear next step.</p>`, { label: "Open review queue", href: absoluteUrl("/tutor/dashboard") }) };
    }
    case "review_available": {
      const mission = String(payload.mission || "your project");
      const approved = payload.decision === "approved";
      const subject = approved ? `Project approved: ${mission}` : `Revision requested: ${mission}`;
      const detail = approved ? "Your tutor approved this project. Its evidence is now part of your capability record." : "Your tutor left feedback and a next step. Read it before rebuilding your evidence.";
      return { subject, text: `${detail} Open your dashboard: ${absoluteUrl("/student/dashboard")}`, html: frame(subject, approved ? "Your project was approved" : "Your tutor left a next step", `<p>${escapeHtml(detail)}</p>`, { label: approved ? "View your progress" : "Read tutor feedback", href: absoluteUrl("/student/dashboard") }) };
    }
    case "weekly_parent_summary": {
      const learner = String(payload.learner || "your learner");
      const subject = `${learner}'s IATECH Builder progress`;
      const progress = String(payload.progress || "Learning activity is underway.");
      return { subject, text: `${progress} View the private parent summary: ${absoluteUrl("/parent/dashboard")}`, html: frame(subject, `${learner}'s weekly progress`, `<p>${escapeHtml(progress)}</p><p>This summary intentionally excludes private reflections and AI conversations.</p>`, { label: "View parent summary", href: absoluteUrl("/parent/dashboard") }) };
    }
    case "learning_reminder": {
      const mission = String(payload.mission || "your active mission");
      const subject = `Your next builder action: ${mission}`;
      return { subject, text: `Continue ${mission}. Your saved work is waiting at ${absoluteUrl("/student/dashboard")}`, html: frame(subject, "Your next action is waiting", `<p>Continue <strong>${escapeHtml(mission)}</strong>. A short focused session is enough to move the work forward.</p>`, { label: "Continue building", href: absoluteUrl("/student/dashboard") }) };
    }
  }
}
