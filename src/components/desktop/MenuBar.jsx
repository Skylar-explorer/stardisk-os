import { useState, useEffect, useRef } from 'react'
import { useWindowStore } from '../../stores/windowStore'

const MENU_ITEMS = [
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'resources', label: 'Resources' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'music', label: 'Music' },
  { id: 'movies', label: 'Movies' },
]

export default function MenuBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [menuVisible, setMenuVisible] = useState(true)
  const hideTimer = useRef(null)
  const { windows, openWindow, focusWindow } = useWindowStore()

  // Check if any open window is maximized
  const hasMaximized = windows.some((w) => w.isOpen && w.isMaximized)

  // When no window is maximized, always show MenuBar
  useEffect(() => {
    if (!hasMaximized) {
      setMenuVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [hasMaximized])

  // Real-time clock + date
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: '2-digit',
          day: '2-digit',
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handle = (e) => {
      if (!e.target.closest('.skylaros-menu')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  // Active window: highest zIndex among open windows
  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized)
  const activeWindow =
    openWindows.length > 0
      ? openWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      : null

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  const handleOpen = (id) => {
    openWindow(id)
    focusWindow(id)
    setMenuOpen(false)
  }

  const showMenu = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setMenuVisible(true)
  }

  const hideMenu = () => {
    if (!hasMaximized) return
    hideTimer.current = setTimeout(() => setMenuVisible(false), 400)
  }

  return (
    <>
      {/* Hover trigger strip at very top */}
      <div
        className="fixed top-0 left-0 right-0 h-2 z-[200]"
        onMouseEnter={showMenu}
      />
      {/* MenuBar that slides in/out */}
      <div
        className={`fixed top-0 left-0 right-0 z-[201] transition-transform duration-200 ease-out ${
          menuVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
      >
        <div className="h-7 bg-retro-surface-light border-b border-[#d0c8c0] flex items-center px-3 text-sm text-[#f0e4d0] select-none">
          {/* System Menu */}
          <div className="skylaros-menu relative">
            <button
              onClick={handleMenuToggle}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                menuOpen
                  ? 'bg-[#e8e0d4] text-retro-accent'
                  : 'hover:bg-[#e8e0d4] hover:text-retro-accent'
              }`}
            >
              <span className="text-retro-accent">★</span>
              <span className="text-[13px] font-semibold tracking-wide">
                SkylarOS
              </span>
            </button>

            {menuOpen && (
              <div className="absolute top-full left-0 mt-0.5 w-44 bg-[#4a3a2a] border-2 border-[#c0b8b0] border-r-[#121018] border-b-[#121018] rounded-[4px] shadow-lg py-1 z-[200]">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleOpen(item.id)}
                    className="w-full text-left px-3 py-[5px] text-[13px] text-[#f0e4d0] hover:bg-[#e8e0d4] hover:text-retro-accent transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Window Title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-[13px] text-[#b09878] truncate max-w-[200px]">
            {activeWindow ? activeWindow.title : 'SkylarOS Desktop'}
          </div>

          {/* Date + Clock */}
          <div className="ml-auto flex items-center gap-2 text-[13px] text-[#f0e4d0]">
            <span className="text-[#b09878] font-mono">{date}</span>
            <span className="font-mono tracking-wider">{time}</span>
          </div>
        </div>
      </div>
    </>
  )
}
