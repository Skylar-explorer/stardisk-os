import { motion, AnimatePresence } from 'framer-motion'

function DiscIcon({ size = 52 }) {
  return (
    <div
      className="rounded-full shrink-0 relative"
      style={{
        width: size,
        height: size,
        background: `
          radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5) 0%, transparent 40%),
          conic-gradient(
            from 0deg,
            #e8e8e8, #c0c8d0, #a0c0d8, #d8c0d8,
            #c0c8d0, #e8e8e8, #c0d0e0, #e8c0c0,
            #c0c8d0, #e8e8e8, #a0d0c0, #e8e8e8
          )
        `,
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.25)',
      }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e0e4e8] border border-[#b0b8c0]"
        style={{ width: size * 0.28, height: size * 0.28 }}
      />
    </div>
  )
}

export default function CDPlayer({ movie, phase }) {
  const isPlaying = phase === 'playing'
  const isInserting = phase === 'inserting'

  return (
    <div className="relative shrink-0">
      {/* Flying disc insert animation */}
      <AnimatePresence>
        {isInserting && (
          <motion.div
            className="absolute left-1/2 z-20 pointer-events-none"
            style={{ marginLeft: -26 }}
            initial={{ top: -70, opacity: 1, scale: 1 }}
            animate={{ top: 12, opacity: 0, scale: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <DiscIcon size={52} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === CD PLAYER BODY === */}
      <div className="relative" style={{ height: 275 }}>
        {/* Top lid / disc tray area */}
        <div
          className="relative z-10 mx-2 rounded-t-xl"
          style={{
            height: 42,
            background: 'linear-gradient(180deg, #8898a8 0%, #6a7a8a 60%, #5a6a7a 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.15)',
          }}
        >
          {/* Tray slot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%]">
            <div
              className="h-[18px] rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <div
                className="absolute inset-x-8 inset-y-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #111 100%)',
                }}
              />
              {/* Tray LED strip */}
              <div
                className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-12 h-[1px] transition-all duration-500"
                style={{
                  background: isInserting || isPlaying ? '#5a9ad5' : '#333',
                  boxShadow: isInserting || isPlaying ? '0 0 6px #5a9ad5' : 'none',
                }}
              />
            </div>
          </div>
          {/* Lid edge highlight */}
          <div className="absolute top-0 left-2 right-2 h-px bg-white/20 rounded-full" />
        </div>

        {/* Main chassis */}
        <div
          className="relative mx-1"
          style={{
            height: 205,
            background: 'linear-gradient(180deg, #c4cdd6 0%, #a8b4c0 30%, #94a0ac 70%, #7a8694 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.2)',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            borderRight: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Side screws */}
          <div className="absolute top-3 left-2 w-1.5 h-1.5 rounded-full bg-[#6a7680] shadow-inner" />
          <div className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-[#6a7680] shadow-inner" />
          <div className="absolute bottom-3 left-2 w-1.5 h-1.5 rounded-full bg-[#6a7680] shadow-inner" />
          <div className="absolute bottom-3 right-2 w-1.5 h-1.5 rounded-full bg-[#6a7680] shadow-inner" />

          {/* Content area: Screen + Controls */}
          <div className="flex gap-3 h-full px-4 py-3">
            {/* === LCD SCREEN === */}
            <div
              className="flex-1 rounded-lg overflow-hidden relative"
              style={{
                height: 162,
                background: '#0f1a24',
                border: '3px solid #2a3a4a',
                boxShadow: `
                  inset 0 3px 8px rgba(0,0,0,0.6),
                  0 1px 0 rgba(255,255,255,0.1),
                  0 0 0 1px rgba(0,0,0,0.3)
                `,
              }}
            >
              {/* Screen inner bezel glow */}
              <div
                className="absolute inset-0 pointer-events-none z-10 rounded-lg"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(58,109,181,0.08)',
                }}
              />
              {/* Glass reflection */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.07) 0%, transparent 45%)',
                }}
              />
              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.08]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 3px)',
                }}
              />

              <AnimatePresence mode="wait">
                {!isPlaying ? (
                  <motion.div
                    key="standby"
                    className="h-full flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="text-[13px] tracking-[6px] mb-2"
                      style={{
                        color: '#4a7a5a',
                        fontFamily: "'VT323', monospace",
                        textShadow: '0 0 6px rgba(90,180,120,0.25)',
                      }}
                    >
                      STARDISK
                    </div>
                    <div
                      className="text-[10px] tracking-[4px] mb-1"
                      style={{
                        color: '#3a5a4a',
                        fontFamily: "'VT323', monospace",
                      }}
                    >
                      CD PLAYER
                    </div>
                    <div
                      className="text-[11px] tracking-[3px] mt-1"
                      style={{
                        color: isInserting ? '#5aaa7a' : '#3a5a4a',
                        fontFamily: "'VT323', monospace",
                        textShadow: isInserting ? '0 0 6px rgba(90,200,120,0.5)' : 'none',
                      }}
                    >
                      {isInserting ? '◈ READING DISC ◈' : '◈ INSERT DISC ◈'}
                    </div>
                    {/* Standby pulse dot */}
                    <div
                      className="w-2 h-2 rounded-full mt-4 animate-pulse"
                      style={{
                        background: isInserting ? '#5aca7a' : '#2a4a3a',
                        boxShadow: isInserting ? '0 0 8px #5aca7a, 0 0 16px rgba(90,200,120,0.3)' : 'none',
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="playing"
                    className="h-full flex gap-4 p-4 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Poster */}
                    <div
                      className="shrink-0 rounded-md overflow-hidden border-2 border-[#3a6db5]/30"
                      style={{ width: 80, height: 110 }}
                    >
                      <img
                        src={movie?.poster}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info stack */}
                    <div className="flex-1 min-w-0 flex flex-col justify-start overflow-y-auto">
                      <div
                        className="text-[18px] font-bold"
                        style={{
                          color: '#7acda0',
                          fontFamily: "'VT323', monospace",
                          textShadow: '0 0 4px rgba(90,200,140,0.5), 0 0 12px rgba(90,200,140,0.2)',
                          letterSpacing: '1px',
                          lineHeight: 1.2,
                        }}
                      >
                        {movie?.title}
                      </div>
                      <div
                        className="text-[12px] mt-1"
                        style={{
                          color: '#5aaa7a',
                          fontFamily: "'VT323', monospace",
                          letterSpacing: '0.5px',
                          lineHeight: 1.3,
                        }}
                      >
                        {movie?.originalTitle}
                      </div>
                      <div
                        className="text-[11px] mt-1.5"
                        style={{
                          color: '#4a9a6a',
                          fontFamily: "'VT323', monospace",
                          letterSpacing: '1px',
                          lineHeight: 1.3,
                        }}
                      >
                        {movie?.year}  ·  {movie?.director}
                      </div>

                      {/* Divider */}
                      <div
                        className="my-2 h-px shrink-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #3a7a5a, transparent)',
                          opacity: 0.4,
                        }}
                      />

                      <div
                        className="text-[13px] italic leading-relaxed"
                        style={{
                          color: '#6ac490',
                          fontFamily: "'Georgia', 'Times New Roman', serif",
                          textShadow: '0 0 2px rgba(90,200,140,0.15)',
                        }}
                      >
                        "{movie?.comment}"
                      </div>

                      {/* Fake progress bar */}
                      <div className="mt-3 flex items-center gap-2 shrink-0">
                        <span className="text-[9px]" style={{ color: '#3a7a5a', fontFamily: "'VT323', monospace" }}>00:00</span>
                        <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: '#1a3a2a' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #3a7a5a, #5aca8a)' }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 60, ease: 'linear' }}
                          />
                        </div>
                        <span className="text-[9px]" style={{ color: '#3a7a5a', fontFamily: "'VT323', monospace" }}>--:--</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* === CONTROL PANEL === */}
            <div className="w-[72px] flex flex-col items-center justify-center gap-4 py-2">
              {/* Play button */}
              <button
                className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 group"
                style={{
                  background: 'linear-gradient(180deg, #e8ecf0 0%, #c8d0d8 50%, #b0b8c4 100%)',
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.9),
                    0 3px 6px rgba(0,0,0,0.25),
                    0 0 0 1px rgba(0,0,0,0.12)
                  `,
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                {/* Button ring */}
                <div className="absolute inset-0 rounded-full border border-white/30" />
                <span className="text-[14px] text-gray-600 ml-0.5 group-hover:text-gray-800 transition-colors">▶</span>
              </button>

              {/* Stop / Eject button */}
              <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #e8ecf0 0%, #c8d0d8 50%, #b0b8c4 100%)',
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.9),
                    0 2px 4px rgba(0,0,0,0.2),
                    0 0 0 1px rgba(0,0,0,0.1)
                  `,
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                <div className="absolute inset-0 rounded-full border border-white/30" />
                <span className="text-[10px] text-gray-500">▮</span>
              </button>

              {/* LED cluster */}
              <div className="flex gap-4 mt-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all duration-500 relative"
                    style={{
                      background: isPlaying ? '#ff5555' : '#552222',
                      boxShadow: isPlaying
                        ? '0 0 6px #ff5555, 0 0 12px rgba(255,85,85,0.4), inset 0 1px 1px rgba(255,255,255,0.3)'
                        : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {isPlaying && <div className="absolute inset-0 rounded-full animate-pulse bg-red-400/30" />}
                  </div>
                  <span className="text-[6px] text-gray-500 tracking-wider font-medium">PWR</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-all duration-500 relative"
                    style={{
                      background: isPlaying ? '#55ff77' : '#225522',
                      boxShadow: isPlaying
                        ? '0 0 6px #55ff77, 0 0 12px rgba(85,255,119,0.4), inset 0 1px 1px rgba(255,255,255,0.3)'
                        : 'inset 0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {isPlaying && <div className="absolute inset-0 rounded-full animate-pulse bg-green-400/30" />}
                  </div>
                  <span className="text-[6px] text-gray-500 tracking-wider font-medium">PLY</span>
                </div>
              </div>

              {/* Brand label */}
              <div
                className="text-[6px] tracking-[3px] text-gray-400 mt-1"
                style={{ fontFamily: "'VT323', monospace" }}
              >
                STAR-1
              </div>
            </div>
          </div>
        </div>

        {/* Bottom base / feet */}
        <div
          className="relative mx-1 rounded-b-lg"
          style={{
            height: 24,
            background: 'linear-gradient(180deg, #5a6a7a 0%, #3a4a5a 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Ventilation slits */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[3px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-[2px] h-[8px] rounded-full bg-[#2a3a4a]" />
            ))}
          </div>
          {/* Feet */}
          <div className="absolute -bottom-1 left-4 w-3 h-2 rounded-b bg-[#2a3a4a]" />
          <div className="absolute -bottom-1 right-4 w-3 h-2 rounded-b bg-[#2a3a4a]" />
        </div>
      </div>
    </div>
  )
}
