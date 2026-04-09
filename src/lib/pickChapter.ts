export interface Chapter {
  id: number
  content: string
}

const STORAGE_LAST_SHOWN = 'daodejing:lastShownByChapter'
const SESSION_TAB_PICK = 'daodejing:currentTabPick'

function loadLastShown(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_SHOWN)
    if (!raw)
      return {}
    return JSON.parse(raw) as Record<string, number>
  }
  catch {
    return {}
  }
}

function saveLastShown(map: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_LAST_SHOWN, JSON.stringify(map))
  }
  catch (e) {
    console.warn('[daode-plugin] localStorage write failed', e)
  }
}

export function pickLeastRecentlyShownChapter(chapters: Chapter[]): Chapter {
  const lastShown = loadLastShown()
  let minTs = Number.POSITIVE_INFINITY
  for (const c of chapters) {
    const t = lastShown[String(c.id)] ?? 0
    if (t < minTs)
      minTs = t
  }
  const pool = chapters.filter(c => (lastShown[String(c.id)] ?? 0) === minTs)
  const chosen = pool[Math.floor(Math.random() * pool.length)] ?? chapters[0]!
  lastShown[String(chosen.id)] = Date.now()
  saveLastShown(lastShown)
  return chosen
}

/**
 * One logical pick per tab load (avoids double-counting under React StrictMode remount).
 */
export function getChapterForNewTabPage(chapters: Chapter[]): Chapter {
  try {
    const raw = sessionStorage.getItem(SESSION_TAB_PICK)
    if (raw) {
      const { id } = JSON.parse(raw) as { id: number }
      const found = chapters.find(c => c.id === id)
      if (found)
        return found
    }
  }
  catch {
    /* ignore */
  }

  const chosen = pickLeastRecentlyShownChapter(chapters)
  try {
    sessionStorage.setItem(SESSION_TAB_PICK, JSON.stringify({ id: chosen.id }))
  }
  catch {
    /* ignore */
  }
  return chosen
}

/**
 * 用户手动选择章节：更新「最近展示」时间戳，并与新标签页会话状态对齐。
 */
export function selectChapterById(chapters: Chapter[], id: number): Chapter | null {
  const ch = chapters.find(c => c.id === id)
  if (!ch)
    return null
  const lastShown = loadLastShown()
  lastShown[String(id)] = Date.now()
  saveLastShown(lastShown)
  try {
    sessionStorage.setItem(SESSION_TAB_PICK, JSON.stringify({ id }))
  }
  catch {
    /* ignore */
  }
  return ch
}
