import type { CSSProperties } from 'react'

/** 正文：竖排右起、自上而下；flex 在竖排书写下居中块与行间内容（视口内上下左右均衡） */
export const articleVerticalRl: CSSProperties = {
  writingMode: 'vertical-rl',
  textOrientation: 'mixed',
  display: 'flex',
  justifyContent: 'safe center',
  alignItems: 'safe center',
}

/** 浮层/控件：显式恢复横排 + LTR，避免继承竖排 */
export const uiHorizontalLtr: CSSProperties = {
  writingMode: 'horizontal-tb',
  direction: 'ltr',
}
