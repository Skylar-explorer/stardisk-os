import { useState, useEffect } from 'react'

export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setFadeOut(true)
            setTimeout(() => {
              setVisible(false)
              onComplete?.()
            }, 600)
          }, 300)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => clearInterval(timer)
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#dce073] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo Circle */}
      <div className="relative mb-8">
        {/* Outer spinning ring */}
        <div
          className="w-24 h-24 rounded-full border-4 border-retro-blue/20 border-t-retro-blue animate-spin"
          style={{ animationDuration: '1.2s' }}
        />
        {/* Inner circle with text */}
        <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border-2 border-retro-blue/30"
        >
          <span className="text-2xl font-bold text-retro-blue tracking-wider"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            ★
          </span>
        </div>
      </div>

      {/* Brand */}
      <div className="text-center mb-6"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        <div className="text-2xl text-retro-text tracking-[4px] mb-1"
        >
          STARDISK
        </div>
        <div className="text-sm text-retro-muted tracking-[6px]"
        >
          OS v1.0
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-white/40 rounded-full overflow-hidden border border-retro-blue/20"
      >
        <div
          className="h-full bg-gradient-to-r from-retro-blue to-retro-blue-light rounded-full transition-all duration-200"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Status text */}
      <div className="mt-3 text-[11px] text-retro-muted tracking-wider"
        style={{ fontFamily: "'VT323', monospace" }}
      >
        {progress < 30 && 'Initializing...'}
        {progress >= 30 && progress < 60 && 'Loading modules...'}
        {progress >= 60 && progress < 90 && 'Mounting desktop...'}
        {progress >= 90 && 'Ready'}
      </div>
    </div>
  )
}
