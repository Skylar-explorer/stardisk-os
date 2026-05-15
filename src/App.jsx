import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWindowStore } from './stores/windowStore'
import BootScreen from './components/BootScreen'
import MenuBar from './components/desktop/MenuBar'
import DesktopIcons from './components/desktop/DesktopIcon'
import StatusBar from './components/desktop/StatusBar'
import WindowFrame from './components/windows/WindowFrame'
import AboutMeWindow from './components/windows/AboutMeWindow'
import TerminalWindow from './components/windows/TerminalWindow'
import MusicPlayerWindow from './components/windows/MusicPlayerWindow'
import ProjectsWindow from './components/windows/ProjectsWindow'
import ResourcesWindow from './components/windows/ResourcesWindow'
import ResourcesFolderWindow from './components/windows/ResourcesFolderWindow'
import MovieListWindow from './components/windows/MovieListWindow'
import HahaMomentWindow from './components/windows/HahaMomentWindow'
import PuppyWindow from './components/windows/PuppyWindow'

const windowComponents = {
  about: AboutMeWindow,
  terminal: TerminalWindow,
  music: MusicPlayerWindow,
  projects: ProjectsWindow,
  resources: ResourcesWindow,
  resourcesFolder: ResourcesFolderWindow,
  movies: MovieListWindow,
  haha: HahaMomentWindow,
  puppy: PuppyWindow,
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const windows = useWindowStore((state) => state.windows)

  return (
    <div className="w-full h-screen relative crt-overlay">
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <MenuBar />
      <DesktopIcons />

      <AnimatePresence>
        {windows
          .filter((w) => w.isOpen)
          .map((win) => {
            const Component = windowComponents[win.component || win.id]
            if (!Component) return null
            return (
              <motion.div
                key={win.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, mass: 0.8 }}
              >
                <WindowFrame win={win}>
                  {win.component === 'resourcesFolder' ? (
                    <Component category={win.category} />
                  ) : (
                    <Component />
                  )}
                </WindowFrame>
              </motion.div>
            )
          })}
      </AnimatePresence>

      <StatusBar />
    </div>
  )
}
