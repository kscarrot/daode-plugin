import type { Chapter } from './lib/pickChapter'
import { useCallback, useEffect, useState } from 'react'
import { loadChapters } from './lib/loadChapters'
import { getChapterForNewTabPage, selectChapterById } from './lib/pickChapter'
import { punctToIdeographicSpace } from './lib/punctToIdeographicSpace'
import { articleVerticalRl, uiHorizontalLtr } from './lib/writingModeStyles'
import { ThemeMenu } from './ThemeMenu'

const chapterIndexBtnBase
  = 'size-2 shrink-0 cursor-pointer appearance-none rounded-[1px] border-0 p-0 outline-none transition-[color,box-shadow] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-600'

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
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 text-center text-neutral-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-500">
        <p>加载中…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <main className="box-border flex min-h-dvh flex-row-reverse items-center justify-center gap-8 p-[max(1rem,2.5vw)] text-neutral-900">
        <article
          className="max-h-[calc(100dvh-5rem)] min-h-[calc(100dvh-5rem)] min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain whitespace-pre-wrap bg-transparent text-lg leading-[1.9] tracking-wide text-neutral-800 scrollbar-gutter-stable sm:text-xl sm:leading-loose"
          style={articleVerticalRl}
        >
          {punctToIdeographicSpace(chapter.content)}
        </article>
      </main>
      <nav
        className="fixed bottom-4 left-4 z-30 grid w-fit grid-cols-9 gap-[3px]"
        style={uiHorizontalLtr}
        aria-label="八十一章索引，点击跳转"
      >
        {Array.from({ length: 81 }, (_, i) => {
          const id = i + 1
          const active = id === chapter.id
          return (
            <button
              key={id}
              type="button"
              className={`${chapterIndexBtnBase} ${active ? 'bg-neutral-800 ring-1 ring-neutral-600 hover:bg-neutral-700' : 'bg-neutral-300 hover:bg-neutral-400 hover:ring-1 hover:ring-neutral-600'}`}
              aria-label={`第${id}章`}
              aria-current={active ? 'true' : undefined}
              onClick={() => handleSelectChapter(id)}
            />
          )
        })}
      </nav>
      <div className="fixed right-4 bottom-4 z-30" style={uiHorizontalLtr}>
        <ThemeMenu />
      </div>
    </div>
  )
}
