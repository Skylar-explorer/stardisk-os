import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import movies from '../../data/movies.json'
import CDPlayer from './CDPlayer'

function Disc({ onClick, title, isRemoved }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[68px] cursor-pointer group"
      onClick={onClick}
    >
      <AnimatePresence>
        {!isRemoved && (
          <motion.div
            className="relative"
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeIn' }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-12 h-12 rounded-full relative"
              style={{
                background: `
                  radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5) 0%, transparent 40%),
                  conic-gradient(
                    from 0deg,
                    #e8e8e8, #c0c8d0, #a0c0d8, #d8c0d8,
                    #c0c8d0, #e8e8e8, #c0d0e0, #e8c0c0,
                    #c0c8d0, #e8e8e8, #a0d0c0, #e8e8e8
                  )
                `,
                boxShadow: '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.5)',
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8ecf0] border border-[#b8c0c8]"
                style={{ width: 14, height: 14 }}
              />
            </div>
            {/* Hover ring */}
            <div className="absolute inset-0 rounded-full border-2 border-retro-blue/0 group-hover:border-retro-blue/40 transition-colors duration-200 -m-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {isRemoved && (
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-[8px] text-gray-300">□</span>
        </motion.div>
      )}

      <span className="text-[8px] text-retro-muted text-center leading-tight truncate w-full px-0.5">
        {title}
      </span>
    </div>
  )
}

function MonthTab({ label, active, onClick, position }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-1.5 text-[10px] tracking-[2px] font-bold transition-all duration-200 -mb-px"
      style={{
        zIndex: active ? 10 : 5 - position,
        color: active ? '#3a6db5' : '#8aa0b8',
        background: active
          ? '#f0ece4'
          : 'linear-gradient(180deg, #e0dcd4 0%, #d4d0c8 100%)',
        borderTop: '2px solid rgba(255,255,255,0.6)',
        borderLeft: '1px solid rgba(255,255,255,0.4)',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        borderBottom: active ? 'none' : '1px solid rgba(0,0,0,0.06)',
        borderRadius: '4px 4px 0 0',
        boxShadow: active
          ? '0 -2px 6px rgba(58,109,181,0.08)'
          : 'inset 0 -2px 4px rgba(0,0,0,0.03)',
        transform: active ? 'translateY(-1px)' : 'none',
      }}
    >
      {label}
    </button>
  )
}

export default function MovieListWindow() {
  const [activeMonth, setActiveMonth] = useState('2026-03')
  const [activeMovie, setActiveMovie] = useState(null)
  const [phase, setPhase] = useState('idle') // idle | selecting | inserting | playing
  const [removedId, setRemovedId] = useState(null)

  const grouped = useMemo(() => {
    return movies.reduce((acc, m) => {
      if (!acc[m.month]) acc[m.month] = []
      acc[m.month].push(m)
      return acc
    }, {})
  }, [])

  const months = useMemo(() => Object.keys(grouped).sort(), [grouped])
  const currentMovies = grouped[activeMonth] || []

  const startSequence = useCallback((movie) => {
    setRemovedId(movie.id)
    setActiveMovie(movie)
    setPhase('selecting')

    setTimeout(() => setPhase('inserting'), 200)
    setTimeout(() => setPhase('playing'), 900)
  }, [])

  const handleDiscClick = useCallback((movie) => {
    if (phase === 'selecting' || phase === 'inserting') return

    // Reset previous
    if (phase === 'playing') {
      setPhase('idle')
      setActiveMovie(null)
      setRemovedId(null)
      // Small delay before starting new
      setTimeout(() => startSequence(movie), 50)
      return
    }

    startSequence(movie)
  }, [phase, startSequence])

  const monthLabel = (m) => m === '2026-03' ? 'MARCH' : 'APRIL'

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Folder area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Tab bar */}
        <div className="flex items-end px-3 pt-2 gap-1 shrink-0"
          style={{ borderBottom: '2px solid #d8d4cc' }}
        >
          {months.map((m, i) => (
            <MonthTab
              key={m}
              label={monthLabel(m)}
              active={activeMonth === m}
              onClick={() => {
                setActiveMonth(m)
                setPhase('idle')
                setActiveMovie(null)
                setRemovedId(null)
              }}
              position={i}
            />
          ))}
        </div>

        {/* Folder page */}
        <div
          className="flex-1 overflow-auto relative"
          style={{
            background: '#f0ece4',
            backgroundImage: `
              linear-gradient(rgba(180,170,150,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(180,170,150,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        >
          {/* Page inner shadow for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.04)',
            }}
          />

          {/* Disc grid */}
          <div className="relative p-4 flex flex-wrap justify-center gap-x-4 gap-y-5">
            {currentMovies.map((movie) => (
              <Disc
                key={movie.id}
                title={movie.title}
                isRemoved={removedId === movie.id}
                onClick={() => handleDiscClick(movie)}
              />
            ))}

            {/* Empty slots to maintain grid feel if few discs */}
            {Array.from({ length: Math.max(0, 6 - currentMovies.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="w-[68px] flex flex-col items-center gap-1 opacity-30">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300" />
                <span className="text-[8px] text-gray-300">—</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CD Player */}
      <CDPlayer movie={activeMovie} phase={phase} />
    </div>
  )
}
