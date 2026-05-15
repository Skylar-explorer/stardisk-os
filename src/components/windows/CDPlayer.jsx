import { motion, AnimatePresence } from 'framer-motion'

function DiscIcon({ size = 64 }) {
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
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 3px 10px rgba(0,0,0,0.3)',
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
    <div className="relative shrink-0 select-none">
      {/* Flying disc insert animation */}
      <AnimatePresence>
        {isInserting && (
          <motion.div
            className="absolute left-1/2 z-20 pointer-events-none"
            style={{ marginLeft: -32 }}
            initial={{ top: -80, opacity: 1, scale: 1 }}
            animate={{ top: 16, opacity: 0, scale: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <DiscIcon size={64} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* === CD PLAYER BODY === */}
      <div className="relative" style={{ height: 280 }}>
        {/* Top tray lid */}
        <div
          className="relative z-10 rounded-t-xl mx-0"
          style={{
            height: 44,
            background: 'linear-gradient(180deg, #7a8a9a 0%, #5e6e7e 50%, #4a5a6a 100%)',
            boxShadow: `
              inset 0 1px 1px rgba(255,255,255,0.3),
              0 2px 6px rgba(0,0,0,0.2)
            `,
          }}
        >
          {/* Tray slot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%]">
            <div
              className="h-[20px] rounded-full overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #080808 0%, #151515 50%, #080808 100%)',
                boxShadow: `
                  inset 0 2px 5px rgba(0,0,0,0.95),
                  0 1px 0 rgba(255,255,255,0.12)
                `,
              }}
            >
              <div
                className="absolute inset-x-10 inset-y-[2px] rounded-full"
                style={{
                  background: 'linear-gradient(180deg, #252525 0%, #0f0f0f 100%)',
                }}
              />
              {/* Tray LED */}
              <div
                className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-14 h-[2px] rounded-full transition-all duration-500"
                style={{
                  background: isInserting || isPlaying ? '#4a9ad5' : '#2a2a2a',
                  boxShadow: isInserting || isPlaying ? '0 0 8px #4a9ad5, 0 0 16px rgba(74,154,213,0.4)' : 'none',
                }}
              />
            </div>
          </div>
          {/* Top edge highlight */}
          <div className="absolute top-0 left-3 right-3 h-px bg-white/15 rounded-full" />
        </div>

        {/* Main chassis — seamless, no side gaps */}
        <div
          className="relative"
          style={{
            height: 212,
            background: 'linear-gradient(180deg, #b0bcc8 0%, #98a4b2 25%, #8694a2 60%, #6e7c8a 100%)',
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.35),
              0 6px 20px rgba(0,0,0,0.25)
            `,
          }}
        >
          {/* Subtle side bevel lines for depth */}
          <div className="absolute top-0 left-0 bottom-0 w-px bg-white/10" />
          <div className="absolute top-0 right-0 bottom-0 w-px bg-black/8" />

          {/* Corner screws */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#5a6874] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#5a6874] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />
          <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#5a6874] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />
          <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#5a6874] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
          />

          {/* Content: Screen + Controls */}
          <div className="flex gap-4 h-full px-5 py-3.5">
            {/* === LCD SCREEN === */}
            <div
              className="flex-1 rounded-xl overflow-hidden relative"
              style={{
                height: 172,
                background: '#0a141c',
                border: '4px solid #1e2e3e',
                boxShadow: `
                  inset 0 4px 12px rgba(0,0,0,0.7),
                  0 1px 0 rgba(255,255,255,0.08),
                  inset 0 0 0 1px rgba(0,0,0,0.5)
                `,
              }}
            >
              {/* Inner bezel glow */}
              <div
                className="absolute inset-0 pointer-events-none z-10 rounded-lg"
                style={{
                  boxShadow: 'inset 0 0 24px rgba(58,109,181,0.06)',
                }}
              />
              {/* Glass reflection */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: 'linear-gradient(155deg, rgba(255,255,255,0.06) 0%, transparent 45%)',
                }}
              />
              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)',
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
                      className="text-[14px] tracking-[7px] mb-2"
                      style={{
                        color: '#4a7a5a',
                        fontFamily: "'VT323', monospace",
                        textShadow: '0 0 8px rgba(90,180,120,0.3)',
                      }}
                    >
                      SKYLAR
                    </div>
                    <div
                      className="text-[11px] tracking-[5px] mb-1"
                      style={{
                        color: '#3a5a4a',
                        fontFamily: "'VT323', monospace",
                      }}
                    >
                      CD PLAYER
                    </div>
                    <div
                      className="text-[12px] tracking-[3px] mt-1.5"
                      style={{
                        color: isInserting ? '#5aaa7a' : '#3a5a4a',
                        fontFamily: "'VT323', monospace",
                        textShadow: isInserting ? '0 0 8px rgba(90,200,120,0.6)' : 'none',
                      }}
                    >
                      {isInserting ? '◈ READING DISC ◈' : '◈ INSERT DISC ◈'}
                    </div>
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-5 animate-pulse"
                      style={{
                        background: isInserting ? '#5aca7a' : '#253a2e',
                        boxShadow: isInserting ? '0 0 10px #5aca7a, 0 0 20px rgba(90,200,120,0.3)' : 'none',
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
                      className="shrink-0 rounded-lg overflow-hidden border-2 border-[#3a6db5]/25"
                      style={{ width: 88, height: 120 }}
                    >
                      {movie?.poster ? (
                        <img
                          src={import.meta.env.BASE_URL + movie.poster}
                          alt=""
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1a3a2a] to-[#0d1a14] flex items-center justify-center"
                        >
                          <span className="text-[28px]">🎬</span>
                        </div>
                      )}
                    </div>

                    {/* Info stack */}
                    <div className="flex-1 min-w-0 flex flex-col justify-start overflow-y-auto">
                      <div
                        className="text-[20px] font-bold"
                        style={{
                          color: '#7acda0',
                          fontFamily: "'VT323', monospace",
                          textShadow: '0 0 5px rgba(90,200,140,0.5), 0 0 14px rgba(90,200,140,0.2)',
                          letterSpacing: '1px',
                          lineHeight: 1.2,
                        }}
                      >
                        {movie?.title}
                      </div>
                      <div
                        className="text-[13px] mt-1"
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
                        className="text-[12px] mt-1.5"
                        style={{
                          color: '#4a9a6a',
                          fontFamily: "'VT323', monospace",
                          letterSpacing: '1px',
                          lineHeight: 1.3,
                        }}
                      >
                        {movie?.year}  ·  {movie?.director}
                      </div>

                      <div
                        className="my-2.5 h-px shrink-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #3a7a5a, transparent)',
                          opacity: 0.35,
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

                      {/* Progress bar */}
                      <div className="mt-3.5 flex items-center gap-2 shrink-0">
                        <span className="text-[10px]" style={{ color: '#3a7a5a', fontFamily: "'VT323', monospace" }}>00:00</span>
                        <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: '#142e20' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #3a7a5a, #5aca8a)' }}
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 60, ease: 'linear' }}
                          />
                        </div>
                        <span className="text-[10px]" style={{ color: '#3a7a5a', fontFamily: "'VT323', monospace" }}>--:--</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* === CONTROL PANEL === */}
            <div className="w-[80px] flex flex-col items-center justify-center gap-5 py-2">
              {/* Play button */}
              <button
                className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 group"
                style={{
                  background: 'linear-gradient(180deg, #eef2f5 0%, #d0d8e0 50%, #b8c0cc 100%)',
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.95),
                    0 4px 8px rgba(0,0,0,0.25),
                    0 0 0 1px rgba(0,0,0,0.08)
                  `,
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                <div className="absolute inset-0 rounded-full border border-white/40" />
                <span className="text-[16px] text-gray-600 ml-0.5 group-hover:text-gray-800 transition-colors"
                >▶</span>
              </button>

              {/* Stop / Eject button */}
              <button
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(180deg, #eef2f5 0%, #d0d8e0 50%, #b8c0cc 100%)',
                  boxShadow: `
                    inset 0 1px 2px rgba(255,255,255,0.95),
                    0 3px 6px rgba(0,0,0,0.2),
                    0 0 0 1px rgba(0,0,0,0.06)
                  `,
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                <div className="absolute inset-0 rounded-full border border-white/40" />
                <span className="text-[11px] text-gray-500">▮</span>
              </button>

              {/* LED cluster */}
              <div className="flex gap-5 mt-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-500 relative"
                    style={{
                      background: isPlaying ? '#ff4444' : '#4a1a1a',
                      boxShadow: isPlaying
                        ? '0 0 8px #ff4444, 0 0 16px rgba(255,68,68,0.4), inset 0 1px 1px rgba(255,255,255,0.3)'
                        : 'inset 0 1px 3px rgba(0,0,0,0.6)',
                    }}
                  >
                    {isPlaying && <div className="absolute inset-0 rounded-full animate-pulse bg-red-400/25" />}
                  </div>
                  <span className="text-[7px] text-gray-500 tracking-wider font-medium">PWR</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full transition-all duration-500 relative"
                    style={{
                      background: isPlaying ? '#44ee66' : '#1a3a1a',
                      boxShadow: isPlaying
                        ? '0 0 8px #44ee66, 0 0 16px rgba(68,238,102,0.4), inset 0 1px 1px rgba(255,255,255,0.3)'
                        : 'inset 0 1px 3px rgba(0,0,0,0.6)',
                    }}
                  >
                    {isPlaying && <div className="absolute inset-0 rounded-full animate-pulse bg-green-400/25" />}
                  </div>
                  <span className="text-[7px] text-gray-500 tracking-wider font-medium">PLY</span>
                </div>
              </div>

              {/* Brand label */}
              <div
                className="text-[7px] tracking-[3px] text-gray-400 mt-1"
                style={{ fontFamily: "'VT323', monospace" }}
              >
                STAR-1
              </div>
            </div>
          </div>
        </div>

        {/* Bottom base / feet */}
        <div
          className="relative rounded-b-xl"
          style={{
            height: 24,
            background: 'linear-gradient(180deg, #4a5a6a 0%, #323e4a 100%)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
          }}
        >
          {/* Ventilation slits */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-[2px] h-[9px] rounded-full bg-[#1e2a36]" />
            ))}
          </div>
          {/* Feet */}
          <div className="absolute -bottom-1 left-5 w-3.5 h-2 rounded-b bg-[#1e2a36]" />
          <div className="absolute -bottom-1 right-5 w-3.5 h-2 rounded-b bg-[#1e2a36]" />
        </div>
      </div>
    </div>
  )
}
