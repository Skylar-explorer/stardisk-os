import { useState } from 'react'
import { useWindowStore } from '../../stores/windowStore'

const base = import.meta.env.BASE_URL

const icons = [
  { id: 'about', label: 'About Me', src: 'images/icons/About_Me.png' },
  { id: 'terminal', label: 'Terminal', src: 'images/icons/Terminal.png' },
  { id: 'music', label: 'Music', src: 'images/icons/Music.png' },
  { id: 'projects', label: 'Projects', src: 'images/icons/Projects.png' },
  { id: 'resources', label: 'Resources', src: 'images/icons/Resources.png' },
  { id: 'movies', label: 'Movies', src: 'images/icons/Movies.png' },
  { id: 'haha', label: 'Haha', src: 'images/icons/Haha.png' },
  { id: 'puppy', label: 'Puppy', src: 'images/icons/Puppy.png' },
]

export default function DesktopIcons() {
  const { openWindow, focusWindow } = useWindowStore()
  const [selectedId, setSelectedId] = useState(null)

  const handleDoubleClick = (id) => {
    openWindow(id)
    focusWindow(id)
  }

  return (
    <div className="absolute left-10 top-12 grid grid-cols-2 gap-x-14 gap-y-3">
      {icons.map((item) => (
        <div
          key={item.id}
          className="flex flex-col items-center cursor-pointer text-center group select-none"
          onClick={() => setSelectedId(item.id)}
          onDoubleClick={() => handleDoubleClick(item.id)}
        >
          <div className="w-20 h-20 flex items-center justify-center transition-transform duration-150 group-hover:scale-105"
          >
            <img
              src={base + item.src}
              alt={item.label}
              className={`w-[72px] h-[72px] object-contain transition-all duration-150 ${
                selectedId === item.id
                  ? 'scale-95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.12)]'
                  : 'drop-shadow-[0_3px_5px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_5px_10px_rgba(0,0,0,0.22)]'
              }`}
              draggable={false}
            />
          </div>
          <div
            className={`mt-0 text-[13px] leading-tight px-1.5 py-0.5 rounded transition-colors ${
              selectedId === item.id
                ? 'bg-retro-blue text-white'
                : 'text-retro-text [text-shadow:0_1px_2px_rgba(255,255,255,0.7)]'
            }`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
