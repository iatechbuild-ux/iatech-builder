import Link from "next/link";

import { updatePasswordAction } from "../actions";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <div className="page narrow-page">
      <section className="panel">
        <span className="chip teal">New password</span>
        <h1 className="page-title">Choose a new password</h1>
        <p className="page-lead">
          Use the reset link from your email first, then set a password with at least 8 characters.
        </p>

        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

        <form action={updatePasswordAction} className="form-grid" style={{ marginTop: 22 }}>
          <label className="field">
            <span>New password</span>
            <input autoComplete="new-password" minLength={8} name="password" required type="password" />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <input autoComplete="new-password" minLength={8} name="confirmPassword" required type="password" />
          </label>
          <button className="btn primary" type="submit">
            Update password
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
