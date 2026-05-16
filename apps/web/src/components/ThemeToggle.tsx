"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-foreground hover:text-primary transition-colors text-left w-full rounded-md hover:bg-surface-hover">
        <div className="w-6 h-6" />
        <span>Theme</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-foreground hover:text-primary transition-colors text-left w-full rounded-md hover:bg-surface-hover"
    >
      {isDark ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
      <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
