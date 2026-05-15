import { create } from 'zustand'

const defaultWindows = [
  { id: 'about', title: 'About Me', defaultX: 80, defaultY: 60, defaultW: 860, defaultH: 600 },
  { id: 'terminal', title: 'System Terminal', defaultX: 500, defaultY: 80, defaultW: 520, defaultH: 400 },
  { id: 'music', title: 'Music Player', defaultX: 300, defaultY: 100, defaultW: 480, defaultH: 600 },
  { id: 'projects', title: 'Projects', defaultX: 120, defaultY: 120, defaultW: 860, defaultH: 600 },
  { id: 'resources', title: 'Resources', defaultX: 140, defaultY: 100, defaultW: 860, defaultH: 600 },
  { id: 'movies', title: 'Movie List', defaultX: 160, defaultY: 80, defaultW: 860, defaultH: 600 },
  { id: 'haha', title: 'Haha Moment', defaultX: 250, defaultY: 150, defaultW: 480, defaultH: 400 },
  { id: 'puppy', title: 'Puppy', defaultX: 280, defaultY: 180, defaultW: 440, defaultH: 360 },
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
    isMaximized: false,
    prevX: null,
    prevY: null,
    prevWidth: null,
    prevHeight: null,
  })),
  highestZIndex: defaultWindows.length,

  openWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
    ),
  })),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => {
      if (w.id !== id) return w
      return {
        ...w,
        isOpen: false,
        isMaximized: false,
        isMinimized: false,
        x: w.defaultX,
        y: w.defaultY,
        width: w.defaultW,
        height: w.defaultH,
        prevX: null,
        prevY: null,
        prevWidth: null,
        prevHeight: null,
      }
    }),
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

  toggleMaximize: (id) => set((state) => {
    const win = state.windows.find((w) => w.id === id)
    if (!win) return state

    if (win.isMaximized) {
      return {
        windows: state.windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isMaximized: false,
                x: w.prevX ?? w.defaultX,
                y: w.prevY ?? w.defaultY,
                width: w.prevWidth ?? w.defaultW,
                height: w.prevHeight ?? w.defaultH,
              }
            : w
        ),
      }
    }

    return {
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              isMaximized: true,
              prevX: w.x,
              prevY: w.y,
              prevWidth: w.width,
              prevHeight: w.height,
              x: 0,
              y: 0,
              width: window.innerWidth,
              height: window.innerHeight - 32,
            }
          : w
      ),
    }
  }),

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

  updateSize: (id, width, height) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, width, height } : w
    ),
  })),

  openDynamicWindow: (config) => set((state) => {
    const exists = state.windows.find((w) => w.id === config.id)
    const newZ = state.highestZIndex + 1
    if (exists) {
      return {
        highestZIndex: newZ,
        windows: state.windows.map((w) =>
          w.id === config.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: newZ }
            : w
        ),
      }
    }
    const newWin = {
      ...config,
      x: config.x ?? 200,
      y: config.y ?? 200,
      width: config.width ?? 600,
      height: config.height ?? 400,
      zIndex: newZ,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      prevX: null,
      prevY: null,
      prevWidth: null,
      prevHeight: null,
    }
    return {
      highestZIndex: newZ,
      windows: [...state.windows, newWin],
    }
  }),
}))
