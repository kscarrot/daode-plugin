import type { ResolvedTheme } from './theme'

import { useSyncExternalStore } from 'react'

function subscribeSystem(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSystemSnapshot(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** 系统当前配色倾向（与 localStorage 无关） */
export function useSystemTheme(): ResolvedTheme {
  return useSyncExternalStore(subscribeSystem, getSystemSnapshot, () => 'light')
}
