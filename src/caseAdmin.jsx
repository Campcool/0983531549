import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowLeft, Download, ImagePlus, LockKeyhole, RotateCcw, ShieldCheck, Upload } from 'lucide-react'
import './style.css'
import './handoff-fixes.css'

const accessCodeHash = '75abf1771c0d9038e45203aa603758410f2418fd29b3fe0c25534009c579bb8e'

async function hashAccessCode(value) {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const maxSide = 1600
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
      const width = Math.round(image.width * scale)
      const height = Math.round(image.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('壓縮失敗'))
            return
          }
          resolve({
            name: file.name.replace(/\.[^.]+$/, '.jpg'),
            originalSize: file.size,
            compressedSize: blob.size,
            url: URL.createObjectURL(blob),
          })
        },
        'image/jpeg',
        0.82,
      )
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('照片讀取失敗'))
    }

    image.src = objectUrl
  })
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function CaseAdminApp() {
  const [code, setCode] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [albumName, setAlbumName] = useState('')
  const [category, setCategory] = useState('一般清潔')
  const [photos, setPhotos] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const totalSaved = useMemo(
    () => photos.reduce((sum, photo) => sum + Math.max(0, photo.originalSize - photo.compressedSize), 0),
    [photos],
  )

  async function unlock(event) {
    event.preventDefault()
    const codeHash = await hashAccessCode(code.trim())
    if (codeHash === accessCodeHash) {
      setUnlocked(true)
      setError('')
      return
    }
    setError('密碼不正確')
  }

  async function handleFiles(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setIsProcessing(true)
    setError('')
    try {
      const settledPhotos = await Promise.allSettled(files.map((file) => compressImage(file)))
      const nextPhotos = settledPhotos
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)

      if (nextPhotos.length) {
        setPhotos((current) => [...current, ...nextPhotos])
      }

      const failedCount = settledPhotos.length - nextPhotos.length
      if (failedCount > 0) {
        setError(`${failedCount} 張照片讀取或壓縮失敗，請重新選擇。`)
      }
    } catch {
      setError('照片處理失敗，請重新選擇。')
    } finally {
      setIsProcessing(false)
      event.target.value = ''
    }
  }

  function clearAlbum() {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url))
    setPhotos([])
    setAlbumName('')
  }

  if (!unlocked) {
    return (
      <div className="admin-shell">
        <form className="admin-login-card" onSubmit={unlock}>
          <img src={`${import.meta.env.BASE_URL}brand/logo-mark-transparent.png`} alt="潔淨坊" width="220" height="220" />
          <div>
            <p className="eyebrow">Case Admin</p>
            <h1>照片壓縮工具</h1>
            <p>輸入管理密碼後使用內部工具。</p>
          </div>
          <label>
            <span>管理密碼</span>
            <input
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button line-primary" type="submit">
            <LockKeyhole size={19} aria-hidden="true" />
            進入工具
          </button>
          <a className="text-admin-link" href={`${import.meta.env.BASE_URL}cases/`}>
            <ArrowLeft size={17} aria-hidden="true" />
            回案例頁
          </a>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-shell admin-workspace">
      <main className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="eyebrow">Internal Tool</p>
            <h1>照片壓縮下載工具</h1>
            <p>目前只提供照片壓縮與下載，不會發布到案例頁。</p>
          </div>
          <a className="button secondary" href={`${import.meta.env.BASE_URL}cases/`}>
            <ArrowLeft size={19} aria-hidden="true" />
            回案例頁
          </a>
        </div>

        <section className="upload-form-grid">
          <label>
            <span>相簿名稱</span>
            <input
              value={albumName}
              onChange={(event) => setAlbumName(event.target.value)}
              placeholder="例如：退租清運 2026-09"
            />
          </label>
          <label>
            <span>清潔分類</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>一般清潔</option>
              <option>裝潢清潔</option>
              <option>重點清潔</option>
              <option>特殊清潔</option>
            </select>
          </label>
        </section>

        <label className="upload-dropzone">
          <Upload size={30} aria-hidden="true" />
          <strong>{isProcessing ? '照片壓縮中' : '選擇照片'}</strong>
          <span>手機可一次選多張，系統會轉成網站用 JPG。</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={isProcessing} />
        </label>
        {error && <p className="form-error">{error}</p>}

        <section className="upload-summary" aria-label="相簿狀態">
          <div>
            <ShieldCheck size={20} aria-hidden="true" />
            <span>{albumName || '尚未命名相簿'}</span>
          </div>
          <div>{category}</div>
          <div>{photos.length} 張照片</div>
          <div>已減少 {formatBytes(totalSaved)}</div>
        </section>

        <div className="admin-actions">
          <button className="button secondary" type="button" onClick={clearAlbum}>
            <RotateCcw size={19} aria-hidden="true" />
            清空重選
          </button>
        </div>

        <section className="admin-photo-grid" aria-label="已壓縮照片">
          {photos.length === 0 ? (
            <div className="empty-upload">
              <ImagePlus size={30} aria-hidden="true" />
              <p>尚未選擇照片。</p>
            </div>
          ) : (
            photos.map((photo, index) => (
              <article className="admin-photo-card" key={`${photo.url}-${index}`}>
                <img src={photo.url} alt={`已壓縮照片 ${index + 1}`} />
                <div>
                  <strong>{String(index + 1).padStart(2, '0')} {photo.name}</strong>
                  <span>{formatBytes(photo.originalSize)} → {formatBytes(photo.compressedSize)}</span>
                  <a href={photo.url} download={`${albumName || 'jiejingfang'}-${String(index + 1).padStart(2, '0')}.jpg`}>
                    <Download size={16} aria-hidden="true" />
                    下載
                  </a>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaseAdminApp />
  </React.StrictMode>,
)
