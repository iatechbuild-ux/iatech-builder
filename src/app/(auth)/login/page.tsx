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
    <div className="page narrow-page auth-page">
      <section className="panel auth-panel">
        <header className="auth-intro">
          <span className="chip teal">Secure access</span>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-lead">
            Log in to continue to your missions, reviews, or learner progress.
          </p>
        </header>

        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}
        {params?.notice ? <p className="form-message" role="status">{params.notice}</p> : null}

        <form action={signInAction} className="form-grid auth-form">
          <input name="next" type="hidden" value={next} />
          <label className="field" htmlFor="login-email">
            <span>Email</span>
            <input autoComplete="email" id="login-email" name="email" required spellCheck={false} type="email" />
          </label>
          <div className="field">
            <div className="auth-field-heading">
              <label htmlFor="login-password">Password</label>
              <Link href="/forgot-password">Forgot password?</Link>
            </div>
            <input autoComplete="current-password" id="login-password" name="password" required type="password" />
          </div>
          <button className="btn primary auth-submit" type="submit">
            Log in
          </button>
        </form>

        <p className="auth-switch">
          New to IATECH Builder? <Link href="/signup">Create an account</Link>
        </p>
      </section>
    </div>
  );
}
