/**
 * Chrome 扩展 manifest 的 icons 对 SVG 支持不稳定，从 SVG 栅格化为 PNG。
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgPath = join(root, 'public/icons/taiji.svg')
const svg = readFileSync(svgPath)

const sizes = [16, 32, 48, 128]
for (const size of sizes) {
  const out = join(root, 'public/icons', `icon-${size}.png`)
  await sharp(svg, { density: 300 })
    .resize(size, size, { fit: 'contain', background: { r: 250, g: 250, b: 249, alpha: 1 } })
    .png()
    .toFile(out)
  console.info(out)
}
