import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PwaRegister } from "@/components/pwa-register";
import { SignOutButton } from "@/components/sign-out-button";
import { roleHomePath, type AppRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/session";
import "./globals.css";

type NavGroup = {
  label: string;
  links: Array<[string, string]>;
};

const roleNavGroups: Record<AppRole, NavGroup[]> = {
  student: [
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
  ],
  tutor: [
    {
      label: "Tutor",
      links: [
        ["Dashboard", "/tutor/dashboard"],
        ["Lesson guide", "/tutor/lesson-guide"],
        ["Review", "/tutor/review"],
      ],
    },
    {
      label: "Missions",
      links: [
        ["Never count twice", "/missions/never-count-twice"],
        ["Attendance tracker", "/missions/attendance-tracker"],
      ],
    },
  ],
  parent: [
    {
      label: "Parent",
      links: [["Parent", "/parent/dashboard"]],
    },
  ],
  admin: [
    {
      label: "Admin",
      links: [
        ["Admin", "/admin/dashboard"],
        ["Never count twice", "/missions/never-count-twice"],
        ["Attendance tracker", "/missions/attendance-tracker"],
      ],
    },
  ],
};

const publicNavGroups: NavGroup[] = [
  {
    label: "Access",
    links: [
      ["Home", "/"],
      ["Log in", "/login"],
      ["Create account", "/signup"],
      ["Reset password", "/forgot-password"],
    ],
  },
];

export const metadata: Metadata = {
  title: "IATECH Builder",
  description: "Mission-based learning platform scaffold for IATECH Consult.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const navGroups = user ? roleNavGroups[user.role] : publicNavGroups;
  const mobileHref = user ? roleHomePath[user.role] : "/login";
  const mobileLabel = user ? "Continue" : "Log in";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  var storedTheme = localStorage.getItem("iatech-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = storedTheme || (prefersDark ? "dark" : "light");
} catch (_) {}
            `,
          }}
        />
      </head>
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
            {user ? (
              <section className="nav-group" aria-label="Account">
                <p>Account</p>
                <div className="account-card">
                  <strong>{user.fullName}</strong>
                  <span>{user.role}</span>
                </div>
                <SignOutButton />
              </section>
            ) : null}
            <div className="theme-row">
              <ThemeToggle />
            </div>
          </aside>
          <div className="mobile-bar">
            <Link className="brand compact" href="/">
              <span className="brand-mark">IB</span>
              <strong>IATECH Builder</strong>
            </Link>
            <div className="actions" style={{ marginTop: 0 }}>
              <ThemeToggle compact />
              <Link className="mobile-action" href={mobileHref}>
                {mobileLabel}
              </Link>
            </div>
          </div>
          <main>{children}</main>
          <PwaRegister />
        </div>
      </body>
    </html>
  );
}
