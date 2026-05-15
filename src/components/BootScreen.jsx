import { useState, useEffect, useRef } from 'react'

// CRT phases (cumulative ms timestamps):
//   black:   0-350    completely dark, builds anticipation
//   dot:     350-1100 phosphor dot rises, color temp shifts cold→warm
//   burst:   1100-1650 dot explodes horizontally into a thin laser line
//   expand:  1650-2200 line stretches vertically to fill screen
//   noise:   2200-3000 noise burst + tear lines storm
//   post:    3000+    BIOS POST typewriter sequence (auto-transitions to boot)
//   boot:    ~4500+   CD logo + progress → fade out
const CRT_TIMELINE = [
  { phase: 'dot',    at: 350  },
  { phase: 'burst',  at: 1100 },
  { phase: 'expand', at: 1650 },
  { phase: 'noise',  at: 2200 },
  { phase: 'post',   at: 3000 },
]

const POST_LINES = [
  { text: '[ OK ] CPU: M-STAR 8800 @ 3.2GHz',       color: '#c89048' },
  { text: '[ OK ] RAM: 16384K Extended',             color: '#c89048' },
  { text: '[ OK ] VGA Compatible Adapter',           color: '#c89048' },
  { text: '[ OK ] SkylarOS v1.0',                  color: '#c89048' },
  { text: '[ .. ] Loading kernel...',               color: '#a09080' },
  { text: 'Booting from CD-ROM...',                 color: '#e8e4f0' },
]

export default function BootScreen({ onComplete }) {
  const [replayKey, setReplayKey] = useState(0)
  const [phase, setPhase] = useState('black')
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [visible, setVisible] = useState(true)
  const [tearLines, setTearLines] = useState([])
  const [noiseSeed, setNoiseSeed] = useState(1)
  const tearIdRef = useRef(0)

  // Act 2: BIOS POST state
  const [postTick, setPostTick] = useState(0)

  // --- CRT timeline ---
  useEffect(() => {
    setPhase('black')
    setProgress(0)
    setFadeOut(false)
    setVisible(true)
    setTearLines([])
    setPostTick(0)

    const timers = CRT_TIMELINE.map(({ phase, at }) =>
      setTimeout(() => setPhase(phase), at)
    )
    return () => timers.forEach(clearTimeout)
  }, [replayKey])

  // --- Dynamic noise seed ---
  useEffect(() => {
    const interval = setInterval(() => {
      setNoiseSeed((s) => (s % 999) + 1)
    }, phase === 'noise' ? 55 : phase === 'boot' ? 200 : 0)
    return () => clearInterval(interval)
  }, [phase])

  // --- Horizontal tear lines ---
  useEffect(() => {
    const interval = setInterval(() => {
      const chance = phase === 'noise' ? 0.9 : phase === 'boot' ? 0.1 : 0
      if (Math.random() < chance) {
        const id = ++tearIdRef.current
        const y = Math.random() * 100
        setTearLines((lines) => [
          ...lines,
          { id, y, opacity: 0.45 + Math.random() * 0.5 },
        ])
        setTimeout(() => {
          setTearLines((lines) => lines.filter((l) => l.id !== id))
        }, 100 + Math.random() * 110)
      }
    }, phase === 'noise' ? 50 : 500)
    return () => clearInterval(interval)
  }, [phase])

  // --- Act 2: BIOS POST typewriter ---
  useEffect(() => {
    if (phase !== 'post') return
    setPostTick(0)

    let active = true
    let intervalId = null
    let timeoutId = null

    const maxTicks = POST_LINES.reduce((sum, l) => sum + l.text.length, 0) + (POST_LINES.length - 1) * 2

    intervalId = setInterval(() => {
      setPostTick((t) => {
        if (t >= maxTicks) {
          clearInterval(intervalId)
          timeoutId = setTimeout(() => {
            if (active) setPhase('boot')
          }, 400)
          return t
        }
        return t + 1
      })
    }, 6)

    return () => {
      active = false
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [phase, replayKey])

  // --- Progress bar ---
  useEffect(() => {
    if (phase !== 'boot') return

    let active = true
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            if (!active) return
            setFadeOut(true)
            setTimeout(() => {
              if (!active) return
              setVisible(false)
              onComplete?.()
            }, 600)
          }, 400)
          return 100
        }
        return prev + Math.random() * 10 + 4
      })
    }, 180)

    return () => {
      active = false
      clearInterval(timer)
    }
  }, [phase, onComplete])

  if (!visible) return null

  const showDot = phase === 'dot'
  const showLine = phase === 'burst' || phase === 'expand'
  const showFill = phase === 'expand' || phase === 'noise' || phase === 'post' || phase === 'boot'
  const showNoiseBurst = phase === 'noise'

  // Build POST display from tick counter
  const renderedPostLines = []
  let tickCursor = 0
  for (const line of POST_LINES) {
    const lineStart = tickCursor
    const lineEnd = tickCursor + line.text.length
    if (postTick >= lineStart) {
      const visible = line.text.slice(0, Math.min(postTick - lineStart, line.text.length))
      const isDone = postTick >= lineEnd
      renderedPostLines.push(
        <div
          key={line.text}
          className="text-[14px] leading-relaxed"
          style={{
            color: line.color,
            textShadow: '0 0 3px rgba(200,144,72,0.35), 0 0 8px rgba(200,144,72,0.12)',
          }}
        >
          {visible}
          {!isDone && <span className="animate-pulse ml-[1px]">_</span>}
        </div>
      )
    }
    tickCursor = lineEnd + 2
  }

  const handleReplay = () => {
    setReplayKey((k) => k + 1)
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: '#000' }}
    >
      {/* Re-keyed inner stage - replay forces a remount of the animation */}
      <div key={replayKey} className="absolute inset-0 flex flex-col items-center justify-center">
        {/* === Full-screen fill === */}
        {showFill && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, #121018 0%, #0a0908 70%, #000 100%)',
              animation: 'crtFillIn 350ms ease-out forwards',
            }}
          />
        )}

        {/* === Phase: phosphor dot rising === */}
        {showDot && (
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: 14,
              height: 14,
              marginLeft: -7,
              marginTop: -7,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #fff8e0 0%, #fff4d6 35%, rgba(255,244,214,0.4) 65%, transparent 90%)',
              boxShadow: `
                0 0 8px #fff8e0,
                0 0 24px rgba(255,244,214,0.8),
                0 0 64px rgba(200,144,72,0.6),
                0 0 140px rgba(200,144,72,0.35),
                0 0 240px rgba(200,144,72,0.18)
              `,
              animation: 'phosphorOn 750ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          />
        )}

        {/* === Phase: horizontal line (burst → expand) === */}
        {showLine && (
          <div
            className="absolute left-0 right-0 top-1/2 pointer-events-none"
            style={{
              height: 3,
              marginTop: -1.5,
              transformOrigin: 'center',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,244,214,0.3) 10%, #fff8e0 45%, #ffffff 50%, #fff8e0 55%, rgba(255,244,214,0.3) 90%, transparent 100%)',
              boxShadow: `
                0 0 12px #fff8e0,
                0 0 32px rgba(255,244,214,0.7),
                0 0 64px rgba(200,144,72,0.5)
              `,
              animation:
                phase === 'burst'
                  ? 'lineBurst 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : 'lineExpand 550ms cubic-bezier(0.85, 0, 0.15, 1) forwards',
            }}
          />
        )}

        {/* === Noise burst overlay === */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            mixBlendMode: 'screen',
            opacity: phase === 'noise' ? 0.6 : phase === 'boot' ? 0.07 : 0,
            transition: 'opacity 400ms ease-out',
            zIndex: 25,
          }}
        >
          <filter id="crt-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="3"
              seed={noiseSeed}
            />
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.65 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#crt-noise)" />
        </svg>

        {/* === Persistent scanlines === */}
        {showFill && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent 0, transparent 1.5px, rgba(0,0,0,0.55) 2px, transparent 2.5px, transparent 3px)',
              mixBlendMode: 'multiply',
              zIndex: 20,
              animation: 'scanlineMove 9s linear infinite',
            }}
          />
        )}

        {/* === Horizontal tear lines === */}
        {tearLines.map((line) => (
          <div
            key={line.id}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: `${line.y}%`,
              height: 1,
              background: '#fff8e0',
              boxShadow: '0 0 4px #fff8e0, 0 0 10px rgba(255,244,214,0.5)',
              opacity: line.opacity,
              mixBlendMode: 'screen',
              zIndex: 30,
            }}
          />
        ))}

        {/* === Vignette === */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
            zIndex: 35,
            opacity: showFill ? 1 : 0,
            transition: 'opacity 360ms ease-out',
          }}
        />

        {/* === Act 2: BIOS POST === */}
        {phase === 'post' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
            style={{ zIndex: 40 }}
          >
            <div className="w-full max-w-md">
              {renderedPostLines}
            </div>
          </div>
        )}

        {/* === Boot phase: CD logo + progress === */}
        {phase === 'boot' && (
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              zIndex: 15,
              animation: 'bootContentIn 520ms cubic-bezier(0.25, 1, 0.5, 1) both',
            }}
          >
            {/* CD disc */}
            <div
              className="rounded-full mb-8"
              style={{
                width: 128,
                height: 128,
                animation: 'cdSpin 3s linear infinite',
                background: `
                  radial-gradient(ellipse at 32% 28%, rgba(255,255,255,0.35) 0%, transparent 45%),
                  radial-gradient(circle at center, #0a0908 8%, rgba(200,200,200,0.18) 9%, rgba(200,200,200,0.12) 14%, transparent 15%),
                  conic-gradient(from 180deg, #c89048, #d5d0e8, #c8d060, #a8c0d0, #8a9ab5, #c89048, #d5d0e8, #c8d060, #a8c0d0, #8a9ab5, #c89048)
                `,
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.06),
                  0 6px 24px rgba(0,0,0,0.45),
                  0 0 28px rgba(200,144,72,0.2),
                  inset 0 0 30px rgba(0,0,0,0.35),
                  inset 0 0 8px rgba(255,255,255,0.04)
                `,
              }}
            />

            <div
              className="text-center mb-6"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              <div
                className="text-2xl text-[#f0e4d0] tracking-[4px] mb-1"
                style={{ textShadow: '0 0 6px rgba(232,228,240,0.4)' }}
              >
                SKYLAR
              </div>
              <div className="text-sm text-[#b09878] tracking-[6px]">
                OS v1.0
              </div>
            </div>

            <div className="w-48 h-1.5 bg-[#121018] rounded-full overflow-hidden border border-[#3a3850]">
              <div
                className="h-full bg-gradient-to-r from-retro-accent to-retro-accent-light rounded-full transition-all duration-200"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  boxShadow: '0 0 10px rgba(200,144,72,0.6)',
                }}
              />
            </div>

            <div
              className="mt-3 text-[11px] text-[#b09878] tracking-wider"
              style={{ fontFamily: "'VT323', monospace" }}
            >
              {progress < 30 && 'Initializing...'}
              {progress >= 30 && progress < 60 && 'Loading modules...'}
              {progress >= 60 && progress < 90 && 'Mounting desktop...'}
              {progress >= 90 && 'Ready'}
            </div>
          </div>
        )}
      </div>

      {/* === REPLAY button === */}
      <button
        onClick={handleReplay}
        className="absolute top-4 right-4 px-3 py-1.5 text-[11px] tracking-[2px] text-[#b09878] hover:text-[#c89048] border border-[#3a3850] hover:border-[#c89048] rounded transition-all bg-[#121018]"
        style={{
          fontFamily: "'VT323', monospace",
          zIndex: 100,
        }}
        title="Replay boot animation"
      >
        ↻ REPLAY
      </button>

      <style>{`
        @keyframes phosphorOn {
          0% {
            transform: scale(0);
            opacity: 0;
            filter: hue-rotate(220deg) brightness(0.4) saturate(2);
          }
          25% {
            transform: scale(0.35);
            opacity: 0.8;
            filter: hue-rotate(140deg) brightness(0.85) saturate(1.6);
          }
          55% {
            transform: scale(0.7);
            opacity: 1;
            filter: hue-rotate(40deg) brightness(1.1) saturate(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: hue-rotate(0deg) brightness(1) saturate(1);
          }
        }
        @keyframes lineBurst {
          0% {
            transform: scaleX(0.02) scaleY(4);
            opacity: 1;
          }
          50% {
            transform: scaleX(0.6) scaleY(2);
            opacity: 1;
          }
          100% {
            transform: scaleX(1) scaleY(1);
            opacity: 1;
          }
        }
        @keyframes lineExpand {
          0% {
            transform: scaleY(1);
            opacity: 1;
          }
          70% {
            transform: scaleY(160);
            opacity: 0.55;
          }
          100% {
            transform: scaleY(160);
            opacity: 0;
          }
        }
        @keyframes crtFillIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scanlineMove {
          from { background-position: 0 0; }
          to { background-position: 0 90px; }
        }
        @keyframes bootContentIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
            filter: blur(4px);
          }
          60% {
            opacity: 1;
            filter: blur(0.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes cdSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
