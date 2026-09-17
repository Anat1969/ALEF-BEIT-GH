// Scans public/letter-images/<folder>/ and regenerates manifest.json.
// Run after adding or removing image files:  node scripts/build-image-manifest.mjs
import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, parse } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public', 'letter-images')
const FOLDERS = ['letters', 'article-hero', 'arch']
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif'])

const manifest = {}
for (const folder of FOLDERS) {
  const dir = join(ROOT, folder)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const map = {}
  for (const file of readdirSync(dir)) {
    const { name, ext } = parse(file)
    if (!IMAGE_EXT.has(ext.toLowerCase())) continue
    // File name (without extension) is the letter id, e.g. "5.png" -> id "5"
    map[name] = file
  }
  manifest[folder] = map
}

writeFileSync(join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log('Wrote manifest.json:')
console.log(JSON.stringify(manifest, null, 2))
