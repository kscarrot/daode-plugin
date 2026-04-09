import type { Chapter } from './pickChapter'

export async function loadChapters(): Promise<Chapter[]> {
  const url = new URL('chapters.json', window.location.href)
  const res = await fetch(url)
  if (!res.ok)
    throw new Error(`无法加载章节数据：HTTP ${res.status}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data))
    throw new Error('章节数据格式无效')
  return data as Chapter[]
}
