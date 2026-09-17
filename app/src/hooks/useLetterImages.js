import { useState, useCallback, useEffect } from 'react'

/*
 * Image storage — GitHub / static hosting.
 *
 * Public, permanent images live in the repo under:
 *   app/public/letter-images/<folder>/<id>.<ext>
 * and are indexed by app/public/letter-images/manifest.json.
 * They are served by GitHub Pages and shown to everyone, in every frame.
 *
 * When the user drops/selects an image in the app it is saved to
 * localStorage so she sees it instantly (a personal preview) and a
 * correctly-named file is offered for download, so it can be committed
 * to the repo to publish it for everyone.
 */

const FOLDERS = ['letters', 'article-hero', 'arch']
const BASE = import.meta.env.BASE_URL // e.g. "/ALEF-BEIT-GH/"
const LOCAL_KEY = 'local-letter-images-v2'

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { letters: {}, 'article-hero': {}, arch: {} }
    const parsed = JSON.parse(raw)
    return {
      letters: parsed.letters || {},
      'article-hero': parsed['article-hero'] || {},
      arch: parsed.arch || {},
    }
  } catch {
    return { letters: {}, 'article-hero': {}, arch: {} }
  }
}

function writeLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Could not save local image (storage full?):', err)
  }
}

function extensionFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:image\/([\w+]+)/)
  if (!match) return 'png'
  const ext = match[1].toLowerCase()
  if (ext === 'jpeg') return 'jpg'
  if (ext === 'svg+xml') return 'svg'
  return ext
}

// Offer the dropped image as a correctly-named file, ready to commit to the
// repo (app/public/letter-images/<folder>/<id>.<ext>) to publish it for all.
function offerDownload(folder, id, dataUrl) {
  try {
    const ext = extensionFromDataUrl(dataUrl)
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${folder}__${id}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (err) {
    console.error('Could not offer image download:', err)
  }
}

export function useLetterImages() {
  const [manifest, setManifest] = useState({ letters: {}, 'article-hero': {}, arch: {} })
  const [local, setLocal] = useState(readLocal)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${BASE}letter-images/manifest.json`, { cache: 'no-cache' })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (cancelled) return
        if (data) {
          setManifest({
            letters: data.letters || {},
            'article-hero': data['article-hero'] || {},
            arch: data.arch || {},
          })
        }
        setReady(true)
      })
      .catch(() => { if (!cancelled) setReady(true) })
    return () => { cancelled = true }
  }, [])

  // Public URL for a committed repo image, or null.
  const publicUrl = useCallback((folder, id) => {
    const file = manifest[folder]?.[id] || manifest[folder]?.[String(id)]
    return file ? `${BASE}letter-images/${folder}/${file}` : null
  }, [manifest])

  // Resolve an image for a folder: local preview wins, then the public repo image.
  const resolve = useCallback((folder, id) => {
    return local[folder]?.[id] || local[folder]?.[String(id)] || publicUrl(folder, id)
  }, [local, publicUrl])

  const save = useCallback((folder, id, dataUrl) => {
    setLocal(prev => {
      const next = { ...prev, [folder]: { ...prev[folder], [String(id)]: dataUrl } }
      writeLocal(next)
      return next
    })
    offerDownload(folder, id, dataUrl)
  }, [])

  const remove = useCallback((folder, id) => {
    setLocal(prev => {
      const folderMap = { ...prev[folder] }
      delete folderMap[String(id)]
      delete folderMap[id]
      const next = { ...prev, [folder]: folderMap }
      writeLocal(next)
      return next
    })
  }, [])

  // --- Public API (unchanged signatures so components keep working) ---

  const getImage = useCallback((id) => resolve('letters', id), [resolve])
  const saveImage = useCallback((id, dataUrl) => save('letters', id, dataUrl), [save])
  const removeImage = useCallback((id) => remove('letters', id), [remove])

  const getHeroImage = useCallback((id) => resolve('article-hero', id), [resolve])
  const saveHeroImage = useCallback((id, dataUrl) => save('article-hero', id, dataUrl), [save])
  const removeHeroImage = useCallback((id) => remove('article-hero', id), [remove])

  const getArchImage = useCallback((id) => resolve('arch', id), [resolve])
  const saveArchImage = useCallback((id, dataUrl) => save('arch', id, dataUrl), [save])
  const removeArchImage = useCallback((id) => remove('arch', id), [remove])

  const getAnyImage = useCallback((id) => {
    return getImage(id) || getHeroImage(id) || getArchImage(id)
  }, [getImage, getHeroImage, getArchImage])

  return {
    getImage, saveImage, removeImage,
    getHeroImage, saveHeroImage, removeHeroImage,
    getArchImage, saveArchImage, removeArchImage,
    getAnyImage,
    ready,
  }
}
