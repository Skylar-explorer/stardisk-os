import { useState, useEffect } from 'react'
import { useWindowStore } from '../../stores/windowStore'
import { useMusicStore } from '../../stores/musicStore'

const WINDOW_ICONS = {
  about: '👤',
  terminal: '💻',
  music: '🎵',
  projects: '📁',
  resources: '📚',
  movies: '🎬',
  haha: '😄',
  puppy: '🐶',
}

function formatTime(s) {
  if (!s || isNaN(s)) return '00:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export default function StatusBar() {
  const { windows, focusWindow, restoreWindow } = useWindowStore()
  const {
    playlist, currentIndex, isPlaying, progress, duration,
    volume, muted, toggleMute, setVolume,
  } = useMusicStore()

  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Network status
  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  // All open windows for taskbar
  const openWindows = windows.filter((w) => w.isOpen)
  const activeWindow =
    openWindows.length > 0
      ? openWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      : null

  const handleTaskbarClick = (win) => {
    if (win.isMinimized) restoreWindow(win.id)
    focusWindow(win.id)
  }

  const currentTrack = playlist[currentIndex]

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-retro-surface-light border-t border-[#d0c8c0] flex items-center px-2 gap-2 z-[100] select-none">
      {/* Left: Mini brand */}
      <div className="text-[11px] text-[#b09878] tracking-wider px-1 shrink-0">
        SkylarOS
      </div>

      <div className="w-px h-5 bg-[#d0c8c0] shrink-0" />

      {/* Center: Taskbar */}
      <div className="flex gap-1 flex-1 overflow-hidden">
        {openWindows.map((win) => {
          const isActive = activeWindow?.id === win.id
          return (
            <button
              key={win.id}
              onClick={() => handleTaskbarClick(win)}
              className={`h-[22px] px-2 flex items-center gap-1 text-[11px] rounded-[3px] border-2 transition-all shrink-0 ${
                isActive
                  ? 'border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] bg-[#d8d0c8] text-retro-accent'
                  : 'border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] bg-[#e8e0d4] text-retro-text hover:bg-[#d8d0c8]'
              }`}
            >
              <span>{WINDOW_ICONS[win.id] || '•'}</span>
              <span className="truncate max-w-[80px]">{win.title}</span>
              {win.isMinimized && (
                <span className="text-[9px] text-retro-muted ml-0.5">_</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right: Network + Music + Volume */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Network */}
        <div
          className={`flex items-center gap-1 text-[11px] ${
            isOnline ? 'text-[#5aaa7a]' : 'text-[#ff6b6b]'
          }`}
        >
          <span>{isOnline ? '🌐' : '⚠️'}</span>
          <span className="hidden sm:inline">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="w-px h-4 bg-[#d0c8c0]" />

        {/* Music progress */}
        {currentTrack && (
          <>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={
                  isPlaying ? 'text-retro-accent' : 'text-[#b09878]'
                }
              >
                {isPlaying ? '▶' : '⏸'}
              </span>
              <span className="text-[#b09878] truncate max-w-[90px]">
                {currentTrack.title}
              </span>
              <span className="text-[10px] text-[#b09878] font-mono">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
            <div className="w-px h-4 bg-[#d0c8c0]" />
          </>
        )}

        {/* Volume */}
        <div className="group flex items-center gap-1 px-1 py-0.5 rounded hover:bg-[#e8e0d4]/40 relative">
          <button onClick={toggleMute} className="text-[11px]">
            {muted
              ? '🔇'
              : volume < 0.3
                ? '🔈'
                : volume < 0.7
                  ? '🔉'
                  : '🔊'}
          </button>
          <div className="w-0 overflow-hidden group-hover:w-14 transition-all duration-200">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-12 h-1 accent-retro-accent cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-[#b09878] w-5 text-right">
            {Math.round((muted ? 0 : volume) * 100)}
          </span>
        </div>
      </div>
    </div>
  )
}
