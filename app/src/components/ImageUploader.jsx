import { useState, useRef, useCallback, useEffect } from 'react'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ currentImage, onSave, onRemove }) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)
  const dropRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const dataUrl = await fileToDataUrl(file)
    onSave(dataUrl)
  }, [onSave])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
  }, [])

  useEffect(() => {
    const el = dropRef.current
    if (!el) return

    const onPaste = async (e) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) handleFile(file)
          return
        }
      }
    }

    el.addEventListener('paste', onPaste)
    return () => el.removeEventListener('paste', onPaste)
  }, [handleFile])

  if (currentImage) {
    return (
      <div className="relative w-full rounded-lg overflow-hidden border border-border dark:border-dark-border group">
        <img
          src={currentImage}
          alt="תמונת אות"
          className="w-full object-contain max-h-[500px]"
        />
        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 bg-accent dark:bg-accent-light text-white text-sm rounded-lg shadow-lg hover:opacity-90"
          >
            החלף
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-1.5 bg-danger text-white text-sm rounded-lg shadow-lg hover:opacity-90"
          >
            הסר
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
      </div>
    )
  }

  return (
    <div
      ref={dropRef}
      tabIndex={0}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => fileRef.current?.click()}
      className={`
        w-full aspect-[4/3] rounded-lg border-2 border-dashed cursor-pointer
        flex flex-col items-center justify-center gap-3 transition-all duration-200 outline-none
        focus:ring-2 focus:ring-accent/50 dark:focus:ring-accent-light/50
        ${dragging
          ? 'border-accent dark:border-accent-light bg-accent/10 dark:bg-accent-light/10 scale-[1.01]'
          : 'border-border dark:border-dark-border bg-surface dark:bg-dark-bg hover:border-accent/50 dark:hover:border-accent-light/50 hover:bg-accent/5 dark:hover:bg-accent-light/5'
        }
      `}
    >
      <div className="text-5xl text-text-tertiary dark:text-gray-600">
        {dragging ? '📥' : '🖼️'}
      </div>
      <div className="text-center px-4">
        <p className="text-base font-medium text-text-secondary dark:text-gray-400">
          {dragging ? 'שחררי כאן...' : 'גררי תמונה לכאן'}
        </p>
        <p className="text-sm text-text-tertiary dark:text-gray-500 mt-1">
          או לחצי לבחירת קובץ | Ctrl+V להדבקה
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
      />
    </div>
  )
}
