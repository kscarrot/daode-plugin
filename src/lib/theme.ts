export type ThemePreference = 'system' | 'light' | 'dark'

export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'daodejing:theme'

export function readThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system')
      return v
  }
  catch {
    /* ignore */
  }
  return 'system'
}

export function resolveTheme(
  setting: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  if (setting === 'system')
    return systemTheme
  return setting
}

/** 与 React 无关：写入 html 的 light/dark class + color-scheme */
export function applyResolvedTheme(resolved: ResolvedTheme): void {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

/** 首屏在 React hydrate 前调用，避免闪烁 */
export function syncRootThemeBeforeReact(): void {
  const pref = readThemePreference()
  const system: ResolvedTheme = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light'
  applyResolvedTheme(resolveTheme(pref, system))
}
