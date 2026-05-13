import { useState } from 'react'
import resources from '../../data/resources.json'

const FOLDER_ICONS = {
  'X': '🐦',
  '播客': '🎧',
  '公众号': '📰',
  'YouTube': '📺',
}

const FOLDER_COLORS = {
  'X': '#1da1f2',
  '播客': '#f59e0b',
  '公众号': '#10b981',
  'YouTube': '#ef4444',
}

const FILE_ICONS = {
  'X': '📝',
  '播客': '🎙️',
  '公众号': '📄',
  'YouTube': '🎬',
}

export default function ResourcesWindow() {
  const [view, setView] = useState('folders')
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [...new Set(resources.map((r) => r.category))]

  const handleOpenFolder = (cat) => {
    setActiveCategory(cat)
    setView('files')
  }

  const handleBack = () => {
    setView('folders')
    setActiveCategory(null)
  }

  const currentFiles = activeCategory
    ? resources.filter((r) => r.category === activeCategory)
    : []

  return (
    <div className="h-full flex flex-col bg-[#f5f3ee]">
      {/* Toolbar */}
      <div className="bg-[#e8e4dc] border-b-2 border-[rgba(58,109,181,0.15)] px-2 py-1.5 flex items-center gap-1.5 select-none">
        <button
          onClick={handleBack}
          disabled={view === 'folders'}
          className="w-6 h-5 flex items-center justify-center text-[11px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 disabled:opacity-30 active:border-r-white/80 active:border-b-white/80 active:border-l-[rgba(58,109,181,0.25)] active:border-t-[rgba(58,109,181,0.25)]"
        >
          ←
        </button>
        <div className="flex-1 flex items-center gap-1 bg-white border-2 border-[rgba(58,109,181,0.2)] border-l-white/60 border-t-white/60 rounded px-2 py-[3px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
          <span className="text-[10px] text-retro-muted">📁</span>
          <span className="text-[11px] text-retro-text truncate font-mono">
            {view === 'folders' ? 'Resources' : `Resources > ${activeCategory}`}
          </span>
        </div>
        <div className="text-[10px] text-retro-muted">
          {view === 'folders' ? `${categories.length} 个文件夹` : `${currentFiles.length} 个文件`}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {view === 'folders' && (
          <div>
            <div className="text-[11px] text-retro-muted mb-3">双击文件夹打开</div>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = resources.filter((r) => r.category === cat).length
                return (
                  <div
                    key={cat}
                    onDoubleClick={() => handleOpenFolder(cat)}
                    className="flex flex-col items-center p-3 rounded border-2 border-transparent hover:border-[rgba(58,109,181,0.15)] hover:bg-white/40 cursor-pointer transition-all group"
                  >
                    <div
                      className="w-12 h-10 flex items-center justify-center text-[22px] rounded mb-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                      style={{ background: `${FOLDER_COLORS[cat]}18` }}
                    >
                      {FOLDER_ICONS[cat] || '📁'}
                    </div>
                    <div className="text-[11px] font-semibold text-retro-text text-center leading-tight">
                      {cat}
                    </div>
                    <div className="text-[9px] text-retro-muted mt-0.5">{count} 项</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === 'files' && (
          <div className="space-y-2">
            <div className="text-[11px] text-retro-muted mb-2">{activeCategory} 文件夹</div>
            {currentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-start gap-2.5 p-2.5 rounded border-2 border-[rgba(58,109,181,0.08)] border-r-white/60 border-b-white/60 bg-white/50 hover:bg-white/80 hover:border-[rgba(58,109,181,0.2)] transition-all group"
              >
                <span className="text-[16px] shrink-0 mt-0.5">
                  {FILE_ICONS[activeCategory] || '📄'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-semibold text-retro-text hover:text-[#3a6db5] truncate transition-colors"
                    >
                      {file.title}
                    </a>
                    <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </div>
                  <div className="text-[10px] text-retro-muted leading-relaxed mt-0.5">
                    {file.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
