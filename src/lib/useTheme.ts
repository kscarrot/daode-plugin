import type { ResolvedTheme, ThemePreference } from './theme'

import { useEffect, useMemo, useState } from 'react'
import {
  applyResolvedTheme,
  readThemePreference,

  resolveTheme,
  THEME_STORAGE_KEY,

} from './theme'
import { useSystemTheme } from './useSystemTheme'

export function useTheme(): {
  setting: ThemePreference
  setSetting: (v: ThemePreference) => void
  resolvedTheme: ResolvedTheme
} {
  const [setting, setSetting] = useState<ThemePreference>(readThemePreference)
  const systemTheme = useSystemTheme()

  const resolvedTheme = useMemo(
    () => resolveTheme(setting, systemTheme),
    [setting, systemTheme],
  )

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, setting)
    }
    catch {
      /* ignore */
    }
    applyResolvedTheme(resolvedTheme)
  }, [setting, resolvedTheme])

  return { setting, setSetting, resolvedTheme }
}
