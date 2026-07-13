import type { Metadata } from "next";
import { AppNavigation, type NavigationGroup } from "@/components/app-navigation";
import { PwaRegister } from "@/components/pwa-register";
import type { AppRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/session";
import "./globals.css";

const roleNavGroups: Record<AppRole, NavigationGroup[]> = {
  student: [
    {
      label: "Student",
      links: [
        ["Learn", "/student/dashboard"],
        ["Practice", "/student/workspace"],
        ["Portfolio", "/student/portfolio"],
        ["Help", "/student/assistant"],
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

const publicNavGroups: NavigationGroup[] = [
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
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
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
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <div className="app-shell">
          <AppNavigation groups={navGroups} user={user ? { fullName: user.fullName, role: user.role } : null} />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <PwaRegister />
        </div>
      </body>
    </html>
  );
}
