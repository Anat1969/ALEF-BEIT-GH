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
for (const part of ['01 · חזון', '02 · מטרה', '03 · שיטה', 'שבע עדשות על אותו מידע', 'אות אחת: כוח, ידע ומעשה', 'מה כבר קיים במערכת', '22 האותיות לפי ערך', 'בעיה', 'פתרון', 'תובנה', 'א׳ היא היציאה אל הים']) {
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
ok((await page.locator('video').count()) === 0, 'no background video')
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
const lum = bg.match(/\d+/g).slice(0, 3).map(Number).reduce((a, b) => a + b, 0) / 3
ok(lum > 200, `background is light (${bg})`)
ok((await page.locator('.demo .layer').count()) === 3, 'home shows the three layers on a real letter')
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

const tabs = ['בית', 'לוח בקרה', 'אות בודדת', 'גלריה', 'הסדר', 'קשרים', 'פואטיקה', 'סדר יום']
const hashes = ['#home', '#dashboard', '#letter/1', '#gallery', '#sequence', '#relations', '#poetics/1', '#workflow']
for (let i = 0; i < tabs.length; i++) {
  await page.click(`nav button:has-text("${tabs[i]}")`)
  await page.waitForTimeout(250)
  const want = hashes[i].endsWith('/1') ? new RegExp(`${hashes[i].replace('/1', '')}\\/\\d+$`) : new RegExp(`${hashes[i]}$`)
  ok(want.test(page.url()), `tab "${tabs[i]}" puts ${hashes[i].replace('/1', '/<id>')} in the URL`)
  ok(await page.locator('header').isVisible(), `top bar stays on "${tabs[i]}"`)
  await page.screenshot({ path: `${SHOTS}/tab-${i}.png` })
}

// Workflow: every hour has thought, deed and note; progress and journal survive a refresh
ok((await page.locator('.day-row').count()) === 22, 'daily schedule has 22 hours')
ok((await page.locator('.day-row').first().locator('.day-steps .label').allTextContents()).join(',') === 'מחשבה,מעשה,רושמים', 'each hour: thought, deed, note')
await page.locator('main button[aria-label^="סימון"]').first().click()
await page.locator('.day-row').first().locator('.day-open, textarea').first().click()
await page.locator('.day-row').first().locator('textarea').fill('שלוש נשימות, וכוונה אחת')
await page.waitForTimeout(200)
await page.reload()
await page.waitForSelector('.day-row')
ok(await page.locator('.day-row').first().locator('.day-check.is-on').isVisible(), 'progress kept after refresh')
const kept = await page.evaluate(() => Object.values(JSON.parse(localStorage.getItem(`journal-${new Date().toLocaleDateString('en-CA')}`) || '{}')).join(''))
ok(kept === 'שלוש נשימות, וכוונה אחת', 'journal line kept after refresh')

// Sequence: the journey, the stairs and the order facts
await page.goto(BASE + '#sequence')
await page.waitForSelector('.journey-step')
ok((await page.locator('.journey-step').count()) === 11, 'sequence: 11 steps of the Shabbat 104a journey')
ok((await page.locator('.stair').count()) === 3, 'sequence: units, tens, hundreds')
ok(await page.getByText('באמצע: "כל"').isVisible(), 'sequence: the middle letters spell כל')

// Poetics: a poem whose lines open with the letter, and a post, both copyable
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'])
for (const ch of ['א', 'נ', 'ת']) {
  await page.goto(BASE + '#poetics')
  await page.locator('.poet-letter', { hasText: ch }).click()
  await page.waitForTimeout(100)
  const lines = await page.locator('.poem-line').allTextContents()
  ok(lines.length === 4 && lines.every((l) => l.startsWith(ch)), `poem of ${ch}: 4 lines, each opens with ${ch}`)
  ok((await page.locator('.post-line').count()) >= 3, `post of ${ch} is there`)
}
await page.getByRole('button', { name: 'העתקת השיר' }).click()
const clip = await page.evaluate(() => navigator.clipboard.readText())
ok(clip.split('\n').length === 4 && clip.startsWith('ת'), 'copy poem puts the poem on the clipboard')

// Relationships: every system has rule, meaning and action, and picking a letter shows its partners
await page.goto(BASE + '#matrix')
await page.waitForSelector('main')
ok(page.url().endsWith('#relations'), 'old #matrix link opens the merged relationships screen')
const systems = await page.locator('.system-tab').count()
ok(systems === 5, `5 relationship systems (${systems})`)
for (let i = 0; i < systems; i++) {
  await page.locator('.system-tab').nth(i).click()
  await page.waitForTimeout(100)
  const layers = await page.locator('main .layers .layer').count()
  ok(layers === 3, `system ${i + 1}: rule, meaning and action (${layers})`)
}
await page.locator('.system-tab').first().click()
await page.locator('.rel-tile', { hasText: 'ב' }).first().click()
await page.waitForTimeout(100)
ok(await page.locator('.pair-panel').getByText('שין', { exact: false }).first().isVisible(), 'atbash: picking ב shows its mirror ש')
ok(await page.getByText('התובנה שמאחורי הבחירה').isVisible(), 'atbash explains why the order is reversed')
ok((await page.locator('.group-insight').count()) === 11, 'every mirror pair has its insight')

// Deep link opens the right letter
await page.goto(`${BASE}#letter/5`)
await page.waitForSelector('main')
ok(page.url().endsWith('#letter/5'), 'deep link #letter/5 opens and stays on that letter')
for (const layer of ['1 · ידע · עובדות', '2 · הבנה · פרשנות', '3 · יישום · פעולה', 'במקום שלה בסדר']) {
  ok(await page.getByText(layer, { exact: true }).isVisible(), `letter card opens on "${layer}"`)
}
ok(await page.locator('.power-name').isVisible(), 'letter card opens on the force of the letter')
ok(await page.locator('.power .meaning-solution').isVisible() && await page.locator('.power .meaning-problem').isVisible(), 'the force has a positive and a negative direction')
ok((await page.locator('.seq-row .seq-letter').count()) === 3, 'the card shows the letter before and after')
ok(!(await page.getByText('לא ידוע', { exact: false }).count()), 'no "unknown" wording in the card')
ok(await page.locator('.fact-source').first().isVisible(), 'letter card cites a source')

// Every letter-card section renders, and switching letters keeps the card working
const sections = ['הכוח, ידע ויישום', 'סקירה', 'קשרים', 'שפה', 'מיומנות', 'מודל מרחבי', 'אדריכלות', 'מחקר חושי', 'מאמר']
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
const night = page.locator('ai-menu').getByText('תצוגה: כהה')
ok(await night.isVisible().catch(() => false), 'logo menu offers the display modes')
await night.click().catch(() => {})
await page.waitForTimeout(300)
ok(await page.evaluate(() => document.documentElement.classList.contains('theme-night')), 'choosing the dark mode applies it')
await page.locator('ai-menu .logo').click().catch(() => {})
await page.locator('ai-menu').getByText('תצוגה: בהיר').click().catch(() => {})
await page.waitForTimeout(300)
ok(await page.evaluate(() => !document.documentElement.classList.contains('theme-night')), 'switching back to light works')

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

// Reduced motion stops the ring
const rm = await browser.newContext({ reducedMotion: 'reduce' })
await routeMenu(rm)
const rmp = await rm.newPage()
await rmp.goto(BASE)
await rmp.waitForSelector('header')
ok(await rmp.evaluate(() => getComputedStyle(document.querySelector('.letter-ring')).animationName === 'none'), 'reduced motion: ring does not spin')
ok((await rmp.locator('.ring-tile').count()) === 22, 'reduced motion: all content still shown')

ok(errors.length === 0, `no page errors (${errors.join(' | ')})`)
await browser.close()
console.log(failed ? `\n${failed} failed` : '\nall passed')
process.exit(failed ? 1 : 0)
