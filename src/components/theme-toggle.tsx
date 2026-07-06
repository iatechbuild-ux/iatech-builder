"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  // On the client, the no-flash script in layout.tsx has already resolved the
  // theme onto <html data-theme>, so read that first to avoid a label/aria flicker.
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme;
    if (attr === "dark" || attr === "light") {
      return attr;
    }
  }

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("iatech-theme");
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("iatech-theme", theme);
  }, [theme]);

  const currentTheme = theme ?? "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <button
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={currentTheme === "dark"}
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      suppressHydrationWarning
      type="button"
    >
      {compact ? currentTheme : `${currentTheme} mode`}
    </button>
  );
}
