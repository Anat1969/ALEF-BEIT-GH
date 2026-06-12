import { useState, useCallback, useEffect } from 'react'

const DB_NAME = 'letter-images-db'
const STORE_NAME = 'images'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function dbGet(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

async function dbPut(key, value) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(value, key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function dbDelete(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function dbGetAll() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const result = {}
    const request = store.openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        result[cursor.key] = cursor.value
        cursor.continue()
      } else {
        resolve(result)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

export function useLetterImages() {
  const [images, setImages] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    dbGetAll().then(all => {
      setImages(all)
      setReady(true)
    }).catch(() => setReady(true))
  }, [])

  const saveImage = useCallback((letterId, dataUrl) => {
    setImages(prev => ({ ...prev, [letterId]: dataUrl }))
    dbPut(String(letterId), dataUrl).catch(console.error)
  }, [])

  const removeImage = useCallback((letterId) => {
    setImages(prev => {
      const next = { ...prev }
      delete next[letterId]
      return next
    })
    dbDelete(String(letterId)).catch(console.error)
  }, [])

  const getImage = useCallback((letterId) => {
    return images[letterId] || images[String(letterId)] || null
  }, [images])

  return { images, getImage, saveImage, removeImage, ready }
}
