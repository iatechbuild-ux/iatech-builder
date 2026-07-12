import Link from "next/link";

import { signUpAction } from "../actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const roles = [
  ["student", "Student"],
  ["tutor", "Tutor"],
  ["parent", "Parent"],
] as const;

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <div className="page narrow-page">
      <section className="panel">
        <span className="chip teal">Join the pilot</span>
        <h1 className="page-title">Create an IATECH Builder account</h1>
        <p className="page-lead">
          Accounts are role-based. Admin accounts should be created by platform administrators.
        </p>

        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

        <form action={signUpAction} className="form-grid" style={{ marginTop: 22 }}>
          <label className="field">
            <span>Full name</span>
            <input autoComplete="name" name="fullName" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input autoComplete="new-password" minLength={8} name="password" required type="password" />
          </label>
          <label className="field">
            <span>Role</span>
            <select defaultValue="student" name="role">
              {roles.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <small className="meta">Tutor and parent accounts are verified by an administrator before they can access learners.</small>
          </label>
          <button className="btn primary" type="submit">
            Create account
          </button>
        </form>

        <div className="actions">
          <Link className="btn secondary" href="/login">
            Log in instead
          </Link>
          <Link className="btn secondary" href="/">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
