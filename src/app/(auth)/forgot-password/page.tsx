import Link from "next/link";

import { requestPasswordResetAction } from "../actions";

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <div className="page narrow-page">
      <section className="panel">
        <span className="chip teal">Account recovery</span>
        <h1 className="page-title">Reset your password</h1>
        <p className="page-lead">
          Enter the email you use for IATECH Builder. We will send password reset instructions if it matches an account.
        </p>

        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

        <form action={requestPasswordResetAction} className="form-grid" style={{ marginTop: 22 }}>
          <label className="field">
            <span>Email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <button className="btn primary" type="submit">
            Send reset link
          </button>
        </form>

        <div className="actions">
          <Link className="btn secondary" href="/login">
            Back to login
          </Link>
        </div>
      </section>
    </div>
  );
}
