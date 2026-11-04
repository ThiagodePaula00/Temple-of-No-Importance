"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

type ToggleThemeProviderProps = {
  children: React.ReactNode;
};

type ToggleThemeProps = {
  className: string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ToggleThemeProvider({ children }: ToggleThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ToggleTheme({ className }: ToggleThemeProps) {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ToggleTheme must be rendered inside ToggleThemeProvider");
  }

  const { theme, toggleTheme } = themeContext;
  const nextThemeLabel =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const ThemeIcon = theme === "dark" ? SunIcon : MoonIcon;

  return (
    <button
      aria-label={nextThemeLabel}
      className={className}
      onClick={toggleTheme}
      title={nextThemeLabel}
      type="button"
    >
      <ThemeIcon aria-hidden="true" />
      <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>
    </button>
  );
}