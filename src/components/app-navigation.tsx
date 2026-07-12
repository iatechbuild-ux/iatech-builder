"use client";

import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export type NavigationGroup = {
  label: string;
  links: Array<[string, string]>;
};

type NavigationUser = {
  fullName: string;
  role: string;
} | null;

function isActivePath(pathname: string, href: string) {
  return pathname === href;
}

function NavigationLinks({ groups, pathname, onNavigate }: { groups: NavigationGroup[]; pathname: string; onNavigate?: () => void }) {
  return groups.map((group) => (
    <nav className="nav-group" key={group.label} aria-label={group.label}>
      <p>{group.label}</p>
      {group.links.map(([label, href]) => {
        const active = isActivePath(pathname, href);
        return (
          <Link className={active ? "active" : undefined} href={href} key={href} aria-current={active ? "page" : undefined} onClick={onNavigate}>
            {label}
          </Link>
        );
      })}
    </nav>
  ));
}

export function AppNavigation({ groups, user }: { groups: NavigationGroup[]; user: NavigationUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("mobile-nav-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("mobile-nav-open");
    };
  }, [open]);

  return (
    <>
      <aside className="sidebar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">IB</span>
          <span className="brand-copy">
            <strong>IATECH Builder</strong>
            <small>Build skills. Solve problems.</small>
          </span>
        </Link>
        <NavigationLinks groups={groups} pathname={pathname} />
        {user ? (
          <section className="nav-group" aria-label="Account">
            <p>Account</p>
            <div className="account-card">
              <strong className="breakable-text">{user.fullName}</strong>
              <span>{user.role}</span>
            </div>
            <SignOutButton />
          </section>
        ) : null}
        <div className="theme-row">
          <ThemeToggle />
        </div>
      </aside>

      <header className="mobile-bar">
        <Link aria-label="IATECH Builder home" className="brand compact" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">IB</span>
          <strong>IATECH Builder</strong>
        </Link>
        <div className="mobile-bar-actions">
          <ThemeToggle compact />
          <button
            className="mobile-menu-button"
            type="button"
            aria-controls={panelId}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </header>

      {open ? (
        <div className="mobile-nav-layer">
          <button className="mobile-nav-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} />
          <aside className="mobile-nav-panel" id={panelId} aria-label="Mobile navigation">
            <div className="mobile-nav-heading">
              <strong>Navigate</strong>
              {user ? <span className="meta breakable-text">{user.fullName}</span> : null}
            </div>
            <NavigationLinks groups={groups} pathname={pathname} onNavigate={() => setOpen(false)} />
            {user ? (
              <section className="nav-group" aria-label="Account actions">
                <p>Account</p>
                <SignOutButton />
              </section>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  );
}
