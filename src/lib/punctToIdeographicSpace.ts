/** 表意文字间空格（全角空），与汉字等宽 */
const IDEOGRAPHIC_SPACE = '\u3000'

/**
 * 将标点（Unicode General_Category=P*）替换为全角空白，保留换行。
 * 不改变空格与其它非标点字符。
 */
export function punctToIdeographicSpace(text: string): string {
  return text.replace(/\p{P}/gu, IDEOGRAPHIC_SPACE)
}
