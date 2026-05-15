import { useState } from 'react'
import resources from '../../data/resources.json'

const base = import.meta.env.BASE_URL

const FOLDER_IMAGES = {
  'X': 'images/resources/folder-x.png',
  '播客': 'images/resources/folder-podcast.png',
  '公众号': 'images/resources/folder-wechat.png',
  'YouTube': 'images/resources/folder-youtube.png',
}

const FILE_ICON_BG = {
  'X': '#2a3530',
  '播客': '#4a3a2a',
  '公众号': '#2a3028',
  'YouTube': '#302020',
}

function extractXUsername(url) {
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/^\//, '').split('/')[0]
    if (path && (u.hostname === 'x.com' || u.hostname === 'twitter.com')) {
      return path
    }
  } catch {}
  return null
}

function extractYouTubeVideoId(url) {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') {
      return u.pathname.replace(/^\//, '').split('/')[0]
    }
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v')
    }
  } catch {}
  return null
}

function resolveImage(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}

function getThumbnail(file) {
  if (file.image) return resolveImage(file.image)

  if (file.category === 'X') {
    const username = extractXUsername(file.url)
    if (username) return `https://unavatar.io/x/${username}`
  }

  if (file.category === 'YouTube') {
    const videoId = extractYouTubeVideoId(file.url)
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  return null
}

function isClickable(file) {
  return file.url && file.url !== '#'
}

function FileCard({ file, category }) {
  const thumbnail = getThumbnail(file)
  const bg = FILE_ICON_BG[category] || '#2a2826'
  const clickable = isClickable(file)
  const isVideo = category === 'YouTube'

  const thumbMax = isVideo ? 'max-w-[120px]' : 'max-w-[72px]'
  const labelMax = isVideo ? 'max-w-[120px]' : 'max-w-[80px]'

  const content = (
    <div className={`flex flex-col items-center gap-1 ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}`}>
      <div className={`w-full ${thumbMax} mx-auto relative`}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={file.title}
            className={`w-full object-cover rounded-[4px] border border-[#d0c8c0] ${isVideo ? 'aspect-video' : 'aspect-square'}`}
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.nextElementSibling
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`${thumbnail ? 'hidden' : 'flex'} w-full ${isVideo ? 'aspect-video' : 'aspect-square'} rounded-[4px] items-center justify-center text-[16px] font-bold text-retro-muted border border-[#d0c8c0]`}
          style={{ background: bg }}
        >
          {file.title.charAt(0).toUpperCase()}
        </div>
      </div>
      <span className={`text-[12px] text-retro-text text-center leading-tight ${labelMax} truncate px-0.5 font-medium`}>
        {file.title}
      </span>
    </div>
  )

  if (clickable) {
    return (
      <a href={file.url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return content
}

function FolderIcon({ category }) {
  const src = FOLDER_IMAGES[category]

  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div className="w-16 h-16 flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
        <img
          src={base + src}
          alt={category}
          className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
          draggable={false}
        />
      </div>
    </div>
  )
}

export default function ResourcesWindow() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [...new Set(resources.map((r) => r.category))]

  const handleOpenFolder = (cat) => {
    setActiveCategory(cat)
  }

  const handleBack = () => {
    setActiveCategory(null)
  }

  const currentFiles = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : []

  return (
    <div className="h-full flex flex-col bg-retro-surface">
      {/* Toolbar */}
      <div className="bg-retro-surface-light border-b-2 border-[#d0c8c0] px-2 py-1.5 flex items-center gap-1.5 select-none">
        <button
          onClick={handleBack}
          disabled={!activeCategory}
          className="w-7 h-6 flex items-center justify-center text-[13px] rounded border-2 border-[#d0c8c0] border-r-[#121018] border-b-[#121018] bg-[#d8d0c8] disabled:opacity-30 active:border-r-[#d0c8c0] active:border-b-[#d0c8c0] active:border-l-[#121018] active:border-t-[#121018]"
        >
          ←
        </button>
        <div className="flex-1 flex items-center gap-1 bg-[#121018] border-2 border-[#d0c8c0] border-l-[#e8e0d4] border-t-[#e8e0d4] rounded px-2 py-[3px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
          <span className="text-[11px] text-[#b09878]">📁</span>
          <span className="text-[13px] text-[#f0e4d0] truncate font-mono">
            {activeCategory ? `Resources > ${activeCategory}` : 'Resources'}
          </span>
        </div>
        <div className="text-[12px] text-[#b09878] font-medium">
          {activeCategory ? `${currentFiles.length} 项` : `${categories.length} 个文件夹`}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {!activeCategory ? (
          <div>
            <div className="text-[13px] text-retro-muted mb-5">双击文件夹打开</div>
            <div className="flex items-center gap-10">
              {categories.map((cat) => {
                const count = resources.filter((r) => r.category === cat).length
                return (
                  <div
                    key={cat}
                    onDoubleClick={() => handleOpenFolder(cat)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                  >
                    <FolderIcon category={cat} />
                    <div className="text-[13px] text-retro-text text-center leading-tight font-semibold max-w-[64px] truncate">
                      {cat}
                    </div>
                    <div className="text-[11px] text-retro-muted font-medium">{count} 项</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-x-6 gap-y-6">
            {currentFiles.map((file) => (
              <FileCard key={file.id} file={file} category={activeCategory} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
