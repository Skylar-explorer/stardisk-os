import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../../stores/windowStore'

const MIN_WIDTH = 280
const MIN_HEIGHT = 200
const EDGE_SIZE = 4

export default function WindowFrame({ win, children }) {
  const { closeWindow, minimizeWindow, restoreWindow, toggleMaximize, focusWindow, updatePosition, updateSize } = useWindowStore()
  const isDragging = useRef(false)
  const isResizing = useRef(false)
  const resizeDir = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-btns') || e.target.closest('.win-btn') || e.target.closest('.resize-edge')) return
    if (win.isMaximized) return
    if (win.isMinimized) {
      restoreWindow(win.id)
      return
    }
    setIsInteracting(true)
    isDragging.current = true
    dragOffset.current = { x: e.clientX - win.x, y: e.clientY - win.y }
    focusWindow(win.id)
  }, [win.x, win.y, win.id, win.isMaximized, win.isMinimized, focusWindow, restoreWindow])

  const startResize = useCallback((dir) => (e) => {
    e.stopPropagation()
    if (win.isMaximized) return
    setIsInteracting(true)
    isResizing.current = true
    resizeDir.current = dir
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: win.width,
      height: win.height,
      left: win.x,
      top: win.y,
    }
    focusWindow(win.id)
  }, [win.width, win.height, win.x, win.y, win.id, win.isMaximized, focusWindow])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging.current) {
        updatePosition(win.id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y)
      }
      if (isResizing.current) {
        const dir = resizeDir.current
        const start = resizeStart.current
        let newX = start.left
        let newY = start.top
        let newW = start.width
        let newH = start.height

        if (dir.includes('e')) {
          newW = Math.max(MIN_WIDTH, start.width + (e.clientX - start.x))
        }
        if (dir.includes('s')) {
          newH = Math.max(MIN_HEIGHT, start.height + (e.clientY - start.y))
        }
        if (dir.includes('w')) {
          const delta = e.clientX - start.x
          const proposedW = start.width - delta
          if (proposedW >= MIN_WIDTH) {
            newW = proposedW
            newX = start.left + delta
          } else {
            newW = MIN_WIDTH
            newX = start.left + start.width - MIN_WIDTH
          }
        }
        if (dir.includes('n')) {
          const delta = e.clientY - start.y
          const proposedH = start.height - delta
          if (proposedH >= MIN_HEIGHT) {
            newH = proposedH
            newY = start.top + delta
          } else {
            newH = MIN_HEIGHT
            newY = start.top + start.height - MIN_HEIGHT
          }
        }

        updatePosition(win.id, newX, newY)
        updateSize(win.id, newW, newH)
      }
    }
    const handleMouseUp = () => {
      isDragging.current = false
      isResizing.current = false
      resizeDir.current = null
      setIsInteracting(false)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [win.id, updatePosition, updateSize])

  return (
    <motion.div
      className="absolute"
      animate={{
        x: win.isMinimized ? win.x + win.width / 2 : win.x,
        y: win.isMinimized ? window.innerHeight - 32 : win.y,
        width: win.isMinimized ? 0 : win.width,
        height: win.isMinimized ? 0 : win.height,
        opacity: win.isMinimized ? 0 : 1,
      }}
      transition={
        isInteracting
          ? { duration: 0 }
          : { type: 'tween', ease: 'easeInOut', duration: 0.22 }
      }
      style={{ zIndex: win.zIndex, pointerEvents: win.isMinimized ? 'none' : 'auto' }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className={`bg-retro-surface border-2 border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] shadow-[0_8px_32px_rgba(0,0,0,0.45)] h-full flex flex-col relative overflow-hidden ${win.isMaximized ? '' : 'rounded-[3px]'}`}>
        {/* Title Bar */}
        <div
          className={`h-[22px] bg-retro-surface-light flex items-center px-1 relative shrink-0 cursor-move select-none ${
            win.isMinimized
              ? 'border-2 border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] rounded-[3px]'
              : win.isMaximized
                ? 'border-b border-[#d0c8c0]'
                : 'border-b border-[#d0c8c0] rounded-t-[3px]'
          }`}
          onMouseDown={handleMouseDown}
        >
          <span className={`flex-1 text-center tracking-wider text-[#f0e4d0] truncate transition-all duration-300 ${win.isMinimized ? 'text-[12px]' : 'text-[12px]'}`}>
            {win.title}
          </span>
          <div className="window-btns flex gap-1 absolute right-1">
            <button
              className={`win-btn flex items-center justify-center text-retro-text leading-none hover:bg-[#d0c8c0] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0] active:border-r-[#121018] active:border-b-[#121018] transition-all duration-300 ${
                win.isMinimized ? 'w-3 h-2.5 text-[7px]' : 'w-4 h-3 text-[8px]'
              } bg-[#e8e0d4] border border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] rounded-[1px]`}
              onClick={() => win.isMinimized ? restoreWindow(win.id) : minimizeWindow(win.id)}
              title={win.isMinimized ? 'Restore' : 'Minimize'}
            >
              ─
            </button>
            <button
              className={`win-btn flex items-center justify-center text-retro-text leading-none hover:bg-[#d0c8c0] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0] active:border-r-[#121018] active:border-b-[#121018] transition-all duration-300 ${
                win.isMinimized ? 'w-3 h-2.5 text-[7px]' : 'w-4 h-3 text-[8px]'
              } bg-[#e8e0d4] border border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] rounded-[1px]`}
              onClick={() => toggleMaximize(win.id)}
              title={win.isMaximized ? 'Restore' : 'Maximize'}
            >
              {win.isMaximized ? '❐' : '□'}
            </button>
            <button
              className={`win-btn flex items-center justify-center text-white leading-none hover:bg-[#dc2626] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0] active:border-r-[#121018] active:border-b-[#121018] transition-all duration-300 ${
                win.isMinimized ? 'w-3 h-2.5 text-[7px]' : 'w-4 h-3 text-[8px]'
              } bg-[#b91c1c] border border-l-[#c0b8b0] border-t-[#c0b8b0] border-r-[#121018] border-b-[#121018] rounded-[1px]`}
              onClick={() => closeWindow(win.id)}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content with expand/collapse animation */}
        <AnimatePresence initial={false}>
          {!win.isMinimized && (
            <motion.div
              key="content"
              className="flex-1 overflow-auto min-h-0"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resize edges - only show when not maximized and not minimized */}
        {!win.isMaximized && !win.isMinimized && (
          <>
            {/* North */}
            <div className="resize-edge absolute top-0 left-2 right-2 h-[4px] cursor-ns-resize z-10" onMouseDown={startResize('n')} />
            {/* South */}
            <div className="resize-edge absolute bottom-0 left-2 right-2 h-[4px] cursor-ns-resize z-10" onMouseDown={startResize('s')} />
            {/* West */}
            <div className="resize-edge absolute top-2 bottom-2 left-0 w-[4px] cursor-ew-resize z-10" onMouseDown={startResize('w')} />
            {/* East */}
            <div className="resize-edge absolute top-2 bottom-2 right-0 w-[4px] cursor-ew-resize z-10" onMouseDown={startResize('e')} />
            {/* North-West */}
            <div className="resize-edge absolute top-0 left-0 w-[8px] h-[8px] cursor-nwse-resize z-20" onMouseDown={startResize('nw')} />
            {/* North-East */}
            <div className="resize-edge absolute top-0 right-0 w-[8px] h-[8px] cursor-nesw-resize z-20" onMouseDown={startResize('ne')} />
            {/* South-West */}
            <div className="resize-edge absolute bottom-0 left-0 w-[8px] h-[8px] cursor-nesw-resize z-20" onMouseDown={startResize('sw')} />
            {/* South-East */}
            <div className="resize-edge absolute bottom-0 right-0 w-[8px] h-[8px] cursor-nwse-resize z-20" onMouseDown={startResize('se')} />
          </>
        )}
      </div>
    </motion.div>
  )
}
