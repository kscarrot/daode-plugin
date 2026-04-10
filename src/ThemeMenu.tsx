import type { ThemePreference } from './lib/theme'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from './lib/useTheme'
import { uiHorizontalLtr } from './lib/writingModeStyles'

const taijiSrc = `${import.meta.env.BASE_URL}icons/taiji.svg`
const gearSrc = `${import.meta.env.BASE_URL}icons/gear.svg`

/** public 静态 SVG + mask，继承父级 `text-*`（如图标颜色） */
function GearIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={['inline-block shrink-0 bg-current', className].filter(Boolean).join(' ')}
      style={{
        maskImage: `url('${gearSrc}')`,
        WebkitMaskImage: `url('${gearSrc}')`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

export function ThemeMenu() {
  const [open, setOpen] = useState(false)
  const { setting, setSetting, resolvedTheme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)

  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!open)
      return
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node))
        setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (p: ThemePreference) => {
    setSetting(p)
  }

  const themeTiles = [
    {
      value: 'system' as const,
      label: '跟随系统',
      className:
        'border-neutral-400/80 bg-gradient-to-br from-neutral-300 to-neutral-500',
    },
    {
      value: 'light' as const,
      label: '亮色',
      className: 'border-neutral-300 bg-white',
    },
    {
      value: 'dark' as const,
      label: '暗色',
      className: 'border-neutral-700 bg-black',
    },
  ] satisfies ReadonlyArray<{
    value: ThemePreference
    label: string
    className: string
  }>

  return (
    <div ref={wrapRef} className="relative" style={uiHorizontalLtr}>
      <button
        type="button"
        className="flex size-9 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-neutral-700 shadow-sm hover:bg-neutral-200"
        aria-label="外观设置"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(o => !o)}
      >
        <GearIcon className="size-5" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="主题"
          className="absolute right-0 bottom-full z-50 mb-2 w-fit min-w-44 rounded-lg border border-neutral-200 bg-neutral-50 p-3 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-center">
            <div
              className={`rounded-full bg-neutral-100 p-1.5 transition-transform duration-500 ease-out ${isDark ? 'rotate-180' : 'rotate-0'}`}
            >
              <img src={taijiSrc} alt="" width={40} height={40} className="block" />
            </div>
          </div>
          <div
            className="flex justify-center gap-2"
            role="radiogroup"
            aria-label="配色"
          >
            {themeTiles.map(({ value, label, className: swatch }) => {
              const active = setting === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={label}
                  aria-label={label}
                  className={[
                    'group relative size-10 shrink-0 rounded-md border-2 shadow-sm outline-none transition-[box-shadow,transform] focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50',
                    swatch,
                    active
                      ? 'ring-2 ring-neutral-600 ring-offset-2 ring-offset-neutral-50'
                      : 'hover:scale-105 hover:brightness-95',
                  ].join(' ')}
                  onClick={() => choose(value)}
                >
                  <span
                    className="pointer-events-none absolute top-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 rounded-md bg-neutral-800 px-2 py-1 text-center text-[10px] leading-tight font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
