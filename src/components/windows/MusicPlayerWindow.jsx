import { useEffect } from 'react'
import { useMusicStore } from '../../stores/musicStore'
import { useAudioPlayer } from '../../hooks/useAudioPlayer'
import songs from '../../data/songs.json'

function SpinningCover({ isPlaying, progressPercent, track }) {
  const size = 120
  const radius = size / 2
  const circumference = 2 * Math.PI * (radius - 2)
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size + 16, height: size + 16 }}>
      {/* Progress ring */}
      <svg className="absolute" width={size + 16} height={size + 16}>
        <circle
          cx={(size + 16) / 2}
          cy={(size + 16) / 2}
          r={radius}
          fill="none"
          stroke="rgba(200,144,72,0.15)"
          strokeWidth="2"
        />
        <circle
          cx={(size + 16) / 2}
          cy={(size + 16) / 2}
          r={radius}
          fill="none"
          stroke="#c89048"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${(size + 16) / 2} ${(size + 16) / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>

      {/* Cover image spinning */}
      <div
        className="rounded-full overflow-hidden shadow-lg"
        style={{
          width: size,
          height: size,
          animation: isPlaying ? 'spin 8s linear infinite' : 'none',
        }}
      >
        {track?.cover ? (
          <img
            src={track.cover}
            alt={track.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-retro-bg to-[#8a7d6e] flex items-center justify-center">
            <span className="text-[28px]">🎵</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MusicPlayerWindow() {
  const store = useMusicStore()
  const { seek } = useAudioPlayer()

  const {
    playlist, currentIndex, isPlaying, progress, duration, volume, muted,
    play, pause, next, prev,
    setCurrentIndex, setVolume, toggleMute, setPlaylist,
  } = store

  // Init playlist
  useEffect(() => {
    if (playlist.length === 0) {
      setPlaylist(songs)
    }
  }, [playlist.length, setPlaylist])

  const currentTrack = playlist[currentIndex]
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '00:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleSeek = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seek(percent * duration)
  }

  return (
    <div className="p-3 h-full flex flex-col">
      {/* Track Info */}
      <div className="text-[12px] text-retro-text mb-1 text-center">
        <div className="font-bold truncate">{currentTrack?.title || 'No Track'}</div>
        <div className="text-retro-muted truncate">{currentTrack?.artist || 'Unknown'}</div>
        <div className="text-[10px] text-[#9a8d80] truncate">{currentTrack?.album || ''}</div>
      </div>

      {/* Vinyl Record */}
      <div className="flex justify-center mb-3">
        <SpinningCover isPlaying={isPlaying} progressPercent={progressPercent} track={currentTrack} />
      </div>

      {/* Progress */}
      <div className="mb-2.5">
        <div
          className="h-3 bg-[#121018] border-2 border-[#c0b8b0] border-r-[#121018] border-b-[#121018] relative my-1 rounded-[3px] cursor-pointer"
          onClick={handleSeek}
        >
          <div className="h-full bg-gradient-to-r from-retro-accent to-retro-accent-light rounded-[1px]" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-retro-muted">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration) || currentTrack?.duration || '00:00'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2.5 mb-2.5">
        <button onClick={prev} className="px-3 py-[3px] text-[11px] tracking-wider border-2 border-[#d0c8c0] border-r-[#d0c8c0] border-b-[#d0c8c0] bg-[#d8d0c8] text-retro-text rounded-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:border-r-[#121018] active:border-b-[#121018] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0]">
          ⏮
        </button>
        <button
          onClick={() => isPlaying ? pause() : play()}
          className="px-4 py-[3px] text-[11px] tracking-wider border-2 border-[#d0c8c0] border-r-[#d0c8c0] border-b-[#d0c8c0] bg-[#d8d0c8] text-retro-text rounded-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:border-r-[#121018] active:border-b-[#121018] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0]"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button onClick={next} className="px-3 py-[3px] text-[11px] tracking-wider border-2 border-[#d0c8c0] border-r-[#d0c8c0] border-b-[#d0c8c0] bg-[#d8d0c8] text-retro-text rounded-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:border-r-[#121018] active:border-b-[#121018] active:border-l-[#c0b8b0] active:border-t-[#c0b8b0]">
          ⏭
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 mb-2 text-[11px] text-retro-muted">
        <button onClick={toggleMute} className="w-5 text-center">
          {muted ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1.5 accent-retro-accent"
        />
      </div>

      {/* Playlist */}
      <div className="text-[13px] text-retro-muted mb-1 font-bold tracking-wider">PLAYLIST</div>
      <div className="border-2 border-[#c0b8b0] border-r-[#121018] border-b-[#121018] bg-[#d8d0c8] rounded-[3px] overflow-auto flex-1">
        {playlist.map((track, i) => (
          <div
            key={i}
            className={`px-1.5 py-[3px] text-[11px] flex items-center gap-1.5 cursor-pointer rounded-[1px] ${
              i === currentIndex
                ? 'bg-gradient-to-r from-retro-accent to-retro-accent-light text-[#121018]'
                : 'text-retro-text hover:bg-[#c8c0b8] hover:text-retro-accent'
            }`}
            onClick={() => setCurrentIndex(i)}
          >
            {track.cover && (
              <img
                src={track.cover}
                alt=""
                className="w-4 h-4 rounded-[1px] object-cover shrink-0"
                draggable={false}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="truncate leading-tight">{track.title}</div>
              <div className={`truncate text-[9px] ${i === currentIndex ? 'text-[#3a2a1a]' : 'text-[#8a7d6e]'}`}>{track.artist}</div>
            </div>
            {i === currentIndex && <span className="shrink-0 ml-1">▶</span>}
          </div>
        ))}
      </div>

      {/* Spin animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
