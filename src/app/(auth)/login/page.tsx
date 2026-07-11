import Link from "next/link";

import { signInAction } from "../actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    notice?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params?.next || "";

  return (
    <div className="page narrow-page">
      <section className="panel">
        <span className="chip teal">Secure access</span>
        <h1 className="page-title">Log in to IATECH Builder</h1>
        <p className="page-lead">
          Pick up your missions, reviews, and progress where you left off.
        </p>

        {params?.error ? <p className="notice">{params.error}</p> : null}
        {params?.notice ? <p className="notice">{params.notice}</p> : null}

        <form action={signInAction} className="form-grid" style={{ marginTop: 22 }}>
          <input name="next" type="hidden" value={next} />
          <label className="field">
            <span>Email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          <button className="btn primary" type="submit">
            Log in
          </button>
        </form>

        <div className="actions">
          <Link className="btn secondary" href="/signup">
            Create an account
          </Link>
          <Link className="btn secondary" href="/forgot-password">
            Reset password
          </Link>
          <Link className="btn secondary" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
