import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navGroups = [
  {
    label: "Student",
    links: [
      ["Dashboard", "/student/dashboard"],
      ["Assessment", "/student/assessment"],
      ["Mission", "/missions/never-count-twice"],
      ["Lesson", "/missions/never-count-twice/lesson"],
      ["Workspace", "/student/workspace"],
      ["AI assistant", "/student/assistant"],
      ["Data Lab", "/student/data-lab"],
      ["CMS Planner", "/student/cms-planner"],
      ["Automation Lab", "/student/automation-lab"],
      ["Submission", "/student/submission"],
      ["Portfolio", "/student/portfolio"],
    ],
  },
  {
    label: "Tutor",
    links: [
      ["Dashboard", "/tutor/dashboard"],
      ["Lesson guide", "/tutor/lesson-guide"],
      ["Review", "/tutor/review"],
    ],
  },
  {
    label: "Parent/Admin",
    links: [
      ["Parent", "/parent/dashboard"],
      ["Admin", "/admin/dashboard"],
    ],
  },
];

export const metadata: Metadata = {
  title: "IATECH Builder",
  description: "Mission-based learning platform scaffold for IATECH Consult.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar" aria-label="Main navigation">
            <Link className="brand" href="/">
              <span className="brand-mark">IB</span>
              <span>
                <strong>IATECH Builder</strong>
                <small>Build skills. Solve problems.</small>
              </span>
            </Link>
            {navGroups.map((group) => (
              <nav className="nav-group" key={group.label} aria-label={group.label}>
                <p>{group.label}</p>
                {group.links.map(([label, href]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
          </aside>
          <div className="mobile-bar">
            <Link className="brand compact" href="/">
              <span className="brand-mark">IB</span>
              <strong>IATECH Builder</strong>
            </Link>
            <Link className="mobile-action" href="/student/dashboard">
              Continue
            </Link>
          </div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
