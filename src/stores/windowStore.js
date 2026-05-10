import { create } from 'zustand'

const defaultWindows = [
  { id: 'about', title: 'About Me', defaultX: 100, defaultY: 80, defaultW: 420, defaultH: 320 },
  { id: 'terminal', title: 'System Terminal', defaultX: 500, defaultY: 80, defaultW: 400, defaultH: 340 },
  { id: 'music', title: 'Music Player', defaultX: 300, defaultY: 100, defaultW: 380, defaultH: 520 },
  { id: 'projects', title: 'Projects', defaultX: 120, defaultY: 120, defaultW: 520, defaultH: 520 },
  { id: 'resources', title: 'Resources', defaultX: 160, defaultY: 160, defaultW: 400, defaultH: 350 },
  { id: 'movies', title: 'Movie List', defaultX: 180, defaultY: 60, defaultW: 520, defaultH: 480 },
  { id: 'haha', title: 'Haha Moment', defaultX: 250, defaultY: 150, defaultW: 360, defaultH: 320 },
  { id: 'puppy', title: 'Puppy', defaultX: 280, defaultY: 180, defaultW: 320, defaultH: 280 },
]

export const useWindowStore = create((set) => ({
  windows: defaultWindows.map((w, i) => ({
    ...w,
    x: w.defaultX,
    y: w.defaultY,
    width: w.defaultW,
    height: w.defaultH,
    zIndex: i + 1,
    isOpen: false,
    isMinimized: false,
  })),
  highestZIndex: defaultWindows.length,

  openWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
    ),
  })),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isOpen: false } : w
    ),
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: true } : w
    ),
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: false } : w
    ),
  })),

  focusWindow: (id) => set((state) => {
    const newZ = state.highestZIndex + 1
    return {
      highestZIndex: newZ,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZ } : w
      ),
    }
  }),

  updatePosition: (id, x, y) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, x, y } : w
    ),
  })),
}))
