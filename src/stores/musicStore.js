import { create } from 'zustand'

export const useMusicStore = create((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.7,
  muted: false,

  setPlaylist: (songs) => set({ playlist: songs, currentIndex: 0, progress: 0, duration: 0 }),

  play: () => {
    const { playlist } = get()
    if (playlist.length === 0) return
    set({ isPlaying: true })
  },
  pause: () => set({ isPlaying: false }),

  next: () => set((state) => {
    if (state.playlist.length === 0) return state
    return {
      currentIndex: (state.currentIndex + 1) % state.playlist.length,
      progress: 0,
    }
  }),

  prev: () => set((state) => {
    if (state.playlist.length === 0) return state
    return {
      currentIndex: state.currentIndex === 0 ? state.playlist.length - 1 : state.currentIndex - 1,
      progress: 0,
    }
  }),

  setCurrentIndex: (index) => set({ currentIndex: index, progress: 0 }),
  setProgress: (t) => set({ progress: t }),
  setDuration: (d) => set({ duration: d }),
  setVolume: (v) => set({ volume: v }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),

  getCurrentTrack: () => {
    const { playlist, currentIndex } = get()
    return playlist[currentIndex] || null
  },
}))
