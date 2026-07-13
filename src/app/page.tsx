import Link from "next/link";
import { Chip } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="page hero-page">
      <nav className="hero-nav" aria-label="Landing actions">
        <Link className="brand" href="/">
          <span className="brand-mark">IB</span>
          <strong>IATECH Builder</strong>
        </Link>
        <div className="actions hero-nav-actions">
          <Link className="btn secondary" href="/login">
            Log in
          </Link>
          <Link className="btn primary" href="/signup">
            Get started
          </Link>
        </div>
      </nav>

      <section className="hero-stage">
        <div className="hero-copy">
          <Chip tone="teal">Tutor-guided – ages 10–18</Chip>
          <h1>Don't just take lessons. Complete missions. Build real things.</h1>
          <p>
            Learn web development, Python, data, CMS, automation, and smart AI skills by solving
            real problems - then prove what you can understand, rebuild, master, and teach.
          </p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <Link className="btn primary hero-cta" href="/signup">
              Start your first mission
            </Link>
          </div>
        </div>

        <div className="hero-features">
          <article className="hero-feature">
            <Chip tone="teal">Real missions</Chip>
            <b>Every project starts with a real person and a real problem.</b>
            <p>From shop stock errors to school clubs and community notice boards.</p>
          </article>
          <article className="hero-feature">
            <Chip tone="purple">AI assistant</Chip>
            <b>Use AI as a collaborator - and learn to become less dependent on it.</b>
            <p>Stage-aware help supports curiosity, foundations, rebuilds, mastery, and teach-back.</p>
          </article>
          <article className="hero-feature">
            <Chip tone="coral">Ship and show</Chip>
            <b>Deploy live projects and grow a portfolio that proves it.</b>
            <p>Badges are awarded from evidence, tutor review, and improvement.</p>
          </article>
        </div>

        <div className="chip-row" style={{ justifyContent: "center" }}>
          <Chip tone="teal">Explorer</Chip>
          <Chip tone="amber">Builder</Chip>
          <Chip tone="coral">Innovator</Chip>
          <span className="muted">Your pathway matches your skill, not your age.</span>
        </div>
      </section>
    </div>
  );
}
