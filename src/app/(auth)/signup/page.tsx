import Link from "next/link";

import { signUpAction } from "../actions";

type SignupPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const roles = [
  ["student", "Student"],
  ["parent", "Parent"],
] as const;

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <div className="page narrow-page auth-page">
      <section className="panel auth-panel">
        <header className="auth-intro">
          <span className="chip teal">Create your account</span>
          <h1 className="page-title">Start building with IATECH</h1>
          <p className="page-lead">
            Students and parents can register here. Tutors receive access from an administrator.
          </p>
        </header>

        {params?.error ? <p className="form-message error" role="alert">{params.error}</p> : null}

        <form action={signUpAction} className="form-grid auth-form">
          <label className="field" htmlFor="signup-name">
            <span>Full name</span>
            <input autoComplete="name" id="signup-name" name="fullName" required />
          </label>
          <label className="field" htmlFor="signup-email">
            <span>Email</span>
            <input autoComplete="email" id="signup-email" name="email" required spellCheck={false} type="email" />
          </label>
          <label className="field" htmlFor="signup-password">
            <span>Password</span>
            <input aria-describedby="signup-password-hint" autoComplete="new-password" id="signup-password" minLength={8} name="password" required type="password" />
            <small className="meta" id="signup-password-hint">Use at least 8 characters.</small>
          </label>
          <label className="field" htmlFor="signup-role">
            <span>Register as</span>
            <select aria-describedby="signup-role-hint" defaultValue="student" id="signup-role" name="role">
              {roles.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <small className="meta" id="signup-role-hint">Parent accounts need an administrator to verify the family link before learner records appear.</small>
          </label>
          <button className="btn primary auth-submit" type="submit">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
}
