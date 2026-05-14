export type ThemeMode = "dark" | "light";

export const themeStorageKey = "hardware-stats-theme";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

export function resolveInitialTheme(storedValue: unknown, systemPrefersDark: boolean): ThemeMode {
  if (isThemeMode(storedValue)) {
    return storedValue;
  }

  return systemPrefersDark ? "dark" : "light";
}

export function getNextTheme(theme: ThemeMode): ThemeMode {
  return theme === "dark" ? "light" : "dark";
}
