import type { Chapter } from './lib/pickChapter'
import { useCallback, useEffect, useState } from 'react'
import { loadChapters } from './lib/loadChapters'
import { getChapterForNewTabPage, selectChapterById } from './lib/pickChapter'
import { punctToIdeographicSpace } from './lib/punctToIdeographicSpace'

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadChapters()
      .then((list) => {
        if (cancelled)
          return
        setChapters(list)
        setChapter(getChapterForNewTabPage(list))
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : '加载失败')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSelectChapter = useCallback(
    (id: number) => {
      if (!chapters.length)
        return
      const next = selectChapterById(chapters, id)
      if (next)
        setChapter(next)
    },
    [chapters],
  )

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-center text-stone-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-500">
        <p>加载中…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <main className="vertical-rl-page">
        <article className="vertical-rl-page-body text-stone-800">
          {punctToIdeographicSpace(chapter.content)}
        </article>
      </main>
      <nav
        className="chapter-index-grid fixed bottom-4 left-4"
        aria-label="八十一章索引，点击跳转"
      >
        {Array.from({ length: 81 }, (_, i) => {
          const id = i + 1
          const active = id === chapter.id
          return (
            <button
              key={id}
              type="button"
              className={`chapter-index-cell${active ? ' chapter-index-cell--active' : ''}`}
              aria-label={`第${id}章`}
              aria-current={active ? 'true' : undefined}
              onClick={() => handleSelectChapter(id)}
            />
          )
        })}
      </nav>
    </div>
  )
}
