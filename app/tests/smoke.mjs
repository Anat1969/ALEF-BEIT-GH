// Delivery gate. Build at the root base (as on Vercel) and preview it:
//   VERCEL=1 npm run build && npx vite preview --port 4173
//   NODE_PATH=$(npm root -g) node tests/smoke.mjs
// BASE=https://alef-beit-gh.vercel.app/ runs the same checks against the live site.
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const { chromium } = createRequire(import.meta.url)('playwright')

// ai-menu.js comes from a local copy (AppOfApp-GH public/ai-menu.js), so the
// test does not depend on reaching vercel.app.
const AI_MENU = readFileSync(new URL('./fixtures/ai-menu.js', import.meta.url), 'utf8')
const routeMenu = (target) => target.route('**/ai-menu.js', (r) => r.fulfill({ contentType: 'text/javascript', body: AI_MENU }))

const BASE = process.env.BASE || 'http://localhost:4173/'
const SHOTS = process.env.SHOTS || 'tests/screenshots'
let failed = 0
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failed++ }

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'he-IL' })
await routeMenu(ctx)
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(BASE)
await page.waitForSelector('header')
ok(await page.locator('header >> text=22 אותיות').isVisible(), 'top bar visible on the home page')
ok(page.url().endsWith('#home'), 'first visit opens the home page')
for (const part of ['01 · חזון', '02 · מטרה', '03 · שיטה', 'שש עדשות על אותו מידע', 'מה כבר קיים במערכת', '22 האותיות לפי ערך', 'בעיה', 'פתרון', 'תובנה', 'א׳ היא היציאה אל הים']) {
  ok(await page.getByText(part, { exact: true }).first().isVisible(), `home page shows "${part}"`)
}
ok(await page.locator('.now-card .now-title').isVisible(), 'home page shows the current daily skill')
ok(await page.getByText('ספר יצירה', { exact: false }).first().isVisible(), 'home page names its source of inspiration')
ok((await page.locator('.rt-mark').count()) > 5, 'distilled text uses highlights')
ok((await page.locator('.rt-num').count()) > 0, 'numbers are set in mono')
const weights = await page.evaluate(() => ['.home-title', '.section-title', '.pillar-title'].map((sel) => getComputedStyle(document.querySelector(sel)).fontWeight))
ok(weights.every((w) => Number(w) >= 400 && Number(w) <= 500), `headings weigh 400 to 500 (${weights})`)
ok((await page.locator('.ring-tile').count()) === 22, '3D ring holds all 22 letters')
ok((await page.locator('.map-tile').count()) === 22, 'content map holds all 22 letters')
await page.waitForFunction(() => customElements.get('ai-menu'), null, { timeout: 15000 }).catch(() => {})
ok(await page.locator('ai-menu .logo').isVisible().catch(() => false), 'A&I logo button in the top bar')
ok(!(await page.locator('header >> text=העתקת קישור').first().isVisible().catch(() => false)), 'no loose development buttons in the bar')
ok(!(await page.locator('header button', { hasText: 'זהב' }).first().isVisible().catch(() => false)), 'color modes are not loose buttons in the bar')
await page.screenshot({ path: `${SHOTS}/home.png`, fullPage: true })

// Home tool cards and ring tiles navigate
await page.locator('.tool-card', { hasText: 'גלריה' }).click()
ok(page.url().endsWith('#gallery'), 'home tool card opens its screen')
await page.goto(BASE + '#home')
await page.locator('.map-tile.tier-3').last().click()
ok(page.url().endsWith('#letter/400'), 'content map opens a hundreds letter (#letter/400)')
await page.locator('main button', { hasText: 'הבאה' }).first().click()
ok(page.url().endsWith('#letter/1'), 'next after ת wraps to א')
await page.locator('main button', { hasText: 'הקודמת' }).first().click()
await page.waitForTimeout(150)
ok(page.url().endsWith('#letter/400') && (await page.locator('main').innerText()).length > 200, 'previous from א goes to ת and renders')
await page.goto(BASE + '#letter/10')
await page.locator('main button', { hasText: 'הבאה' }).first().click()
await page.waitForTimeout(150)
ok(page.url().endsWith('#letter/20') && !(await page.getByText('אות לא נמצאה').isVisible()), 'next after י goes to כ (20), not a missing letter')

const tabs = ['בית', 'לוח בקרה', 'אות בודדת', 'גלריה', 'קשרים', 'מטריצה', 'סדר יום']
const hashes = ['#home', '#dashboard', '#letter/1', '#gallery', '#network', '#matrix', '#workflow']
for (let i = 0; i < tabs.length; i++) {
  await page.click(`nav button:has-text("${tabs[i]}")`)
  await page.waitForTimeout(250)
  const want = hashes[i] === '#letter/1' ? /#letter\/\d+$/ : new RegExp(`${hashes[i]}$`)
  ok(want.test(page.url()), `tab "${tabs[i]}" puts ${hashes[i].replace('/1', '/<id>')} in the URL`)
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
ok(page.url().endsWith('#home'), 'app name links to the home page')

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
await page.goto(BASE + '#home')
await page.waitForTimeout(1500)
const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors')
ok(installabilityErrors.length === 0, `installable from Chrome (${JSON.stringify(installabilityErrors)})`)

// Mobile: no horizontal scroll on any tab
const mctx = await browser.newContext({ viewport: { width: 375, height: 760 } })
await routeMenu(mctx)
const mobile = await mctx.newPage()
for (const h of hashes) {
  await mobile.goto(BASE + h)
  await mobile.waitForSelector('main')
  await mobile.waitForTimeout(300)
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  ok(overflow <= 0, `mobile ${h}: no horizontal scroll (${overflow}px)`)
}
await mobile.goto(BASE + '#home')
await mobile.waitForTimeout(500)
await mobile.screenshot({ path: `${SHOTS}/mobile-home.png` })

// Reduced motion hides the background video
const rm = await browser.newContext({ reducedMotion: 'reduce' })
await routeMenu(rm)
const rmp = await rm.newPage()
await rmp.goto(BASE)
await rmp.waitForSelector('header')
ok(!(await rmp.locator('video').isVisible()), 'reduced motion: background video hidden')
ok(await rmp.evaluate(() => getComputedStyle(document.querySelector('.letter-ring')).animationName === 'none'), 'reduced motion: ring does not spin')
ok((await rmp.locator('.ring-tile').count()) === 22, 'reduced motion: all content still shown')

ok(errors.length === 0, `no page errors (${errors.join(' | ')})`)
await browser.close()
console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
