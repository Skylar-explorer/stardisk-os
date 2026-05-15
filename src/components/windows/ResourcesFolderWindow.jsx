import resources from '../../data/resources.json'

const FOLDER_COLORS = {
  'X': '#1da1f2',
  '播客': '#f59e0b',
  '公众号': '#10b981',
  'YouTube': '#ef4444',
}

const FILE_ICON_BG = {
  'X': '#2a3038',
  '播客': '#383020',
  '公众号': '#283830',
  'YouTube': '#382828',
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
  const base = import.meta.env.BASE_URL || '/'
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

  const wrapperClass = clickable
    ? 'cursor-pointer hover:opacity-80 transition-opacity'
    : 'cursor-default'

  const content = (
    <div className={`flex flex-col items-center gap-1.5 ${wrapperClass}`}>
      <div className="w-full relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={file.title}
            className={`w-full object-cover rounded-[4px] border border-[#e8e0d4] ${isVideo ? 'aspect-video' : 'aspect-square'}`}
            onError={(e) => {
              e.target.style.display = 'none'
              const fallback = e.target.nextElementSibling
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={`${thumbnail ? 'hidden' : 'flex'} w-full ${isVideo ? 'aspect-video' : 'aspect-square'} rounded-[4px] items-center justify-center text-[18px] font-bold text-retro-muted border border-[#e8e0d4]`}
          style={{ background: bg }}
        >
          {file.title.charAt(0).toUpperCase()}
        </div>
      </div>
      <span className="text-[10px] text-retro-text text-center leading-tight max-w-full truncate px-0.5">
        {file.title}
      </span>
    </div>
  )

  if (clickable) {
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    )
  }

  return content
}

export default function ResourcesFolderWindow({ category }) {
  const currentFiles = resources.filter((r) => r.category === category)
  const isVideo = category === 'YouTube'

  return (
    <div className="h-full flex flex-col bg-retro-surface">
      {/* Toolbar */}
      <div className="bg-retro-surface-light border-b-2 border-[#d0c8c0] px-2 py-1.5 flex items-center gap-1.5 select-none">
        <div className="flex-1 flex items-center gap-1 bg-[#121018] border-2 border-[#d0c8c0] border-l-[#e8e0d4] border-t-[#e8e0d4] rounded px-2 py-[3px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
          <span className="text-[10px] text-[#b09878]">📁</span>
          <span className="text-[11px] text-[#f0e4d0] truncate font-mono">
            Resources &gt; {category}
          </span>
        </div>
        <div className="text-[10px] text-[#b09878]">
          {currentFiles.length} 项
        </div>
      </div>

      {/* Files grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-6 gap-x-3 gap-y-4">
          {currentFiles.map((file) => (
            <FileCard key={file.id} file={file} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
