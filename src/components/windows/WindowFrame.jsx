import { useRef, useEffect, useCallback } from 'react'
import { useWindowStore } from '../../stores/windowStore'

export default function WindowFrame({ win, children }) {
  const { closeWindow, minimizeWindow, focusWindow, updatePosition } = useWindowStore()
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const frameRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-btns') || e.target.closest('.win-btn')) return
    isDragging.current = true
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y }
    focusWindow(win.id)
  }, [win.x, win.y, win.id, focusWindow])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      updatePosition(win.id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y)
    }
    const handleMouseUp = () => {
      isDragging.current = false
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [win.id, updatePosition])

  if (win.isMinimized) {
    return (
      <div
        ref={frameRef}
        className="absolute"
        style={{ left: win.x, top: win.y, width: win.width, zIndex: win.zIndex }}
      >
        {/* Minimized title bar only */}
        <div
          className="h-[22px] bg-gradient-to-r from-retro-bg/70 to-[rgba(240,213,224,0.6)] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center px-1 relative rounded-[3px] cursor-move select-none"
          onMouseDown={handleMouseDown}
          onClick={() => focusWindow(win.id)}
        >
          <span className="flex-1 text-center text-[12px] tracking-wider text-retro-text">{win.title}</span>
          <div className="window-btns flex gap-1 absolute right-1">
            <button
              className="win-btn w-3 h-2.5 bg-white/60 border border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[7px] text-retro-text leading-none hover:bg-white/80"
              onClick={() => minimizeWindow(win.id)}
            >
              □
            </button>
            <button
              className="win-btn w-3 h-2.5 bg-white/60 border border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[7px] text-retro-text leading-none hover:bg-white/80"
              onClick={() => closeWindow(win.id)}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={frameRef}
      className="absolute"
      style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className="bg-retro-panel/88 backdrop-blur-md border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] shadow-[0_4px_20px_rgba(58,109,181,0.15)] rounded-[3px] h-full flex flex-col">
        {/* Title Bar */}
        <div
          className="h-[22px] bg-gradient-to-r from-retro-bg/70 to-[rgba(240,213,224,0.6)] border-b border-[rgba(58,109,181,0.25)] flex items-center px-1 relative rounded-t-[3px] cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <span className="flex-1 text-center text-[12px] tracking-wider text-retro-text">{win.title}</span>
          <div className="window-btns flex gap-1 absolute right-1">
            <button
              className="win-btn w-3 h-2.5 bg-white/60 border border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[7px] text-retro-text leading-none hover:bg-white/80"
              onClick={() => minimizeWindow(win.id)}
            >
              ─
            </button>
            <button
              className="win-btn w-3 h-2.5 bg-white/60 border border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[7px] text-retro-text leading-none hover:bg-white/80"
              onClick={() => closeWindow(win.id)}
            >
              □
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}
