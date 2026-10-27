// Renders public/icon.svg to the PNG sizes Chrome needs for installation.
// Run once after changing the icon: node scripts/build-icons.mjs
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

// Playwright is preinstalled globally in the build environment, not a project dependency.
const { chromium } = createRequire(import.meta.url)('playwright')

const svg = readFileSync(new URL('../public/icon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch()
const page = await browser.newPage()
for (const [size, pad, name] of [[192, 0, 'icon-192.png'], [512, 0, 'icon-512.png'], [512, 0.1, 'icon-maskable-512.png']]) {
  await page.setViewportSize({ width: size, height: size })
  const inner = Math.round(size * (1 - pad * 2))
  await page.setContent(`<body style="margin:0;background:#0A0E1A;display:grid;place-items:center;width:${size}px;height:${size}px">
    <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</div></body>`)
  await page.screenshot({ path: new URL(`../public/${name}`, import.meta.url).pathname })
}
await browser.close()
