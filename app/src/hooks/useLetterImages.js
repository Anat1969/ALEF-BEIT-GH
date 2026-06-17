import { useState, useCallback, useEffect } from 'react'
import { supabase, BUCKET, getPublicUrl } from '../lib/supabase'

const FOLDERS = ['letters', 'article-hero', 'arch']

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}

function extensionFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:image\/(\w+)/)
  if (!match) return 'png'
  const ext = match[1]
  return ext === 'jpeg' ? 'jpg' : ext
}

async function uploadImage(folder, id, dataUrl) {
  const ext = extensionFromDataUrl(dataUrl)
  const path = `${folder}/${id}.${ext}`
  const blob = await dataUrlToBlob(dataUrl)

  const { data: existing } = await supabase.storage.from(BUCKET).list(folder, { search: `${id}.` })
  if (existing?.length) {
    const old = existing.filter(f => f.name.startsWith(`${id}.`)).map(f => `${folder}/${f.name}`)
    if (old.length) await supabase.storage.from(BUCKET).remove(old)
  }

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    upsert: true,
  })
  if (error) {
    console.error(`Failed to upload ${path}:`, error)
    return null
  }
  return getPublicUrl(path) + '?t=' + Date.now()
}

async function deleteImage(folder, id) {
  const { data: files } = await supabase.storage.from(BUCKET).list(folder, { search: `${id}.` })
  if (files?.length) {
    const toRemove = files.filter(f => f.name.startsWith(`${id}.`)).map(f => `${folder}/${f.name}`)
    if (toRemove.length) await supabase.storage.from(BUCKET).remove(toRemove)
  }
}

export function useLetterImages() {
  const [images, setImages] = useState({})
  const [heroImages, setHeroImages] = useState({})
  const [archImages, setArchImages] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadFolder(folder) {
    const { data: files, error } = await supabase.storage.from(BUCKET).list(folder, { limit: 100 })
    if (error) { console.error(`Failed to list ${folder}:`, error); return {} }
    const map = {}
    for (const file of (files || [])) {
      const id = file.name.split('.')[0]
      map[id] = getPublicUrl(`${folder}/${file.name}`)
    }
    return map
  }

  async function loadAll() {
    try {
      const [letters, heroes, archs] = await Promise.all([
        loadFolder('letters'),
        loadFolder('article-hero'),
        loadFolder('arch'),
      ])
      setImages(letters)
      setHeroImages(heroes)
      setArchImages(archs)
    } catch (err) {
      console.error('Failed to load images:', err)
    } finally {
      setReady(true)
    }
  }

  const saveImage = useCallback(async (letterId, dataUrl) => {
    const url = await uploadImage('letters', letterId, dataUrl)
    if (url) setImages(prev => ({ ...prev, [letterId]: url }))
  }, [])

  const removeImage = useCallback(async (letterId) => {
    await deleteImage('letters', letterId)
    setImages(prev => { const next = { ...prev }; delete next[letterId]; return next })
  }, [])

  const getImage = useCallback((letterId) => {
    return images[letterId] || images[String(letterId)] || null
  }, [images])

  const saveHeroImage = useCallback(async (letterId, dataUrl) => {
    const url = await uploadImage('article-hero', letterId, dataUrl)
    if (url) setHeroImages(prev => ({ ...prev, [letterId]: url }))
  }, [])

  const removeHeroImage = useCallback(async (letterId) => {
    await deleteImage('article-hero', letterId)
    setHeroImages(prev => { const next = { ...prev }; delete next[letterId]; return next })
  }, [])

  const getHeroImage = useCallback((letterId) => {
    return heroImages[letterId] || heroImages[String(letterId)] || null
  }, [heroImages])

  const saveArchImage = useCallback(async (letterId, dataUrl) => {
    const url = await uploadImage('arch', letterId, dataUrl)
    if (url) setArchImages(prev => ({ ...prev, [letterId]: url }))
  }, [])

  const removeArchImage = useCallback(async (letterId) => {
    await deleteImage('arch', letterId)
    setArchImages(prev => { const next = { ...prev }; delete next[letterId]; return next })
  }, [])

  const getArchImage = useCallback((letterId) => {
    return archImages[letterId] || archImages[String(letterId)] || null
  }, [archImages])

  const getAnyImage = useCallback((letterId) => {
    return getImage(letterId) || getHeroImage(letterId) || getArchImage(letterId)
  }, [getImage, getHeroImage, getArchImage])

  return {
    images, getImage, saveImage, removeImage,
    getHeroImage, saveHeroImage, removeHeroImage,
    getArchImage, saveArchImage, removeArchImage,
    getAnyImage,
    ready,
  }
}
