// Delivery gate: run against `npm run build && npx vite preview --port 4173`.
// NODE_PATH=$(npm root -g) node tests/smoke.mjs
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')

const BASE = process.env.BASE || 'http://localhost:4173/ALEF-BEIT-GH/'
const SHOTS = process.env.SHOTS || 'tests/screenshots'
let failed = 0
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failed++ }

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'he-IL' })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(BASE)
await page.waitForSelector('header')
ok(await page.locator('header >> text=22 אותיות').isVisible(), 'top bar visible on the landing page')
ok(await page.locator('text=כניסה למערכת').isVisible(), 'landing page shows the enter button')
await page.waitForFunction(() => customElements.get('ai-menu'), null, { timeout: 15000 }).catch(() => {})
ok(await page.locator('ai-menu .logo').isVisible().catch(() => false), 'A&I logo button in the top bar')
ok(!(await page.locator('header >> text=העתקת קישור').first().isVisible().catch(() => false)), 'no loose development buttons in the bar')
ok(!(await page.locator('header button', { hasText: 'זהב' }).first().isVisible().catch(() => false)), 'color modes are not loose buttons in the bar')
await page.screenshot({ path: `${SHOTS}/landing.png` })

await page.click('text=כניסה למערכת')
const tabs = ['לוח בקרה', 'אות בודדת', 'גלריה', 'קשרים', 'מטריצה', 'סדר יום']
const hashes = ['#dashboard', '#letter/1', '#gallery', '#network', '#matrix', '#workflow']
for (let i = 0; i < tabs.length; i++) {
  await page.click(`nav button:has-text("${tabs[i]}")`)
  await page.waitForTimeout(250)
  ok(page.url().endsWith(hashes[i]), `tab "${tabs[i]}" puts ${hashes[i]} in the URL`)
  ok(await page.locator('header').isVisible(), `top bar stays on "${tabs[i]}"`)
  await page.screenshot({ path: `${SHOTS}/tab-${i}.png` })
}

// Workflow progress survives a refresh
await page.locator('main button[aria-label^="סימון"]').first().click()
await page.waitForTimeout(200)
const before = await page.locator('text=/\\d+\\/22 הושלמו/').first().textContent()
await page.reload()
await page.waitForSelector('main')
const after = await page.locator('text=/\\d+\\/22 הושלמו/').first().textContent()
ok(before === after && !before.startsWith('0/'), `workflow progress kept after refresh (${before} -> ${after})`)

// Deep link opens the right letter
await page.goto(`${BASE}#letter/5`)
await page.waitForSelector('main')
ok(page.url().endsWith('#letter/5'), 'deep link #letter/5 opens and stays on that letter')

// Every letter-card section renders, and switching letters keeps the card working
const sections = ['סקירה', 'מימדים', 'שפה', 'קשרים', 'מיומנות', 'מודל מרחבי', 'אדריכלות', 'מאמר']
for (const label of sections) {
  await page.locator('main button', { hasText: new RegExp(`^${label}$`) }).first().click()
  await page.waitForTimeout(150)
  ok((await page.locator('main').innerText()).length > 200, `letter section "${label}" renders content`)
}
await page.locator('main button', { hasText: 'הבאה' }).first().click()
await page.waitForTimeout(200)
ok(page.url().endsWith('#letter/6'), 'next letter from the article section moves to #letter/6')
ok((await page.locator('main').innerText()).length > 200, 'card still renders after switching letters')

// App name links home
await page.click('header a[aria-label*="דף הבית"]')
ok(page.url().endsWith('#dashboard'), 'app name links to the home page')

// Color mode lives in the logo menu
await page.locator('ai-menu .logo').click().catch(() => {})
const blue = page.locator('ai-menu').getByText('תצוגה: כחול')
ok(await blue.isVisible().catch(() => false), 'logo menu offers the display modes')
await blue.click().catch(() => {})
await page.waitForTimeout(300)
ok(await page.evaluate(() => document.documentElement.classList.contains('color-blue')), 'choosing a display mode applies it')

// Square controls
const rounded = await page.evaluate(() => [...document.querySelectorAll('main button, nav button')]
  .filter((b) => parseFloat(getComputedStyle(b).borderTopLeftRadius) > 0).length)
ok(rounded === 0, `all buttons are square (${rounded} rounded)`)

// Installability
const cdp = await ctx.newCDPSession(page)
await page.goto(BASE + '#dashboard')
await page.waitForTimeout(1500)
const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors')
ok(installabilityErrors.length === 0, `installable from Chrome (${JSON.stringify(installabilityErrors)})`)

// Mobile: no horizontal scroll on any tab
const mobile = await browser.newPage({ viewport: { width: 375, height: 760 } })
for (const h of hashes) {
  await mobile.goto(BASE + h)
  await mobile.waitForSelector('main')
  await mobile.waitForTimeout(300)
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  ok(overflow <= 0, `mobile ${h}: no horizontal scroll (${overflow}px)`)
}
await mobile.goto(BASE + '#dashboard')
await mobile.screenshot({ path: `${SHOTS}/mobile-dashboard.png` })

// Reduced motion hides the background video
const rm = await browser.newContext({ reducedMotion: 'reduce' })
const rmp = await rm.newPage()
await rmp.goto(BASE)
await rmp.waitForSelector('header')
ok(!(await rmp.locator('video').isVisible()), 'reduced motion: background video hidden')

ok(errors.length === 0, `no page errors (${errors.join(' | ')})`)
await browser.close()
console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
