import { create } from 'zustand'
import terminalResponses from '../data/terminalResponses.json'
import jokes from '../data/jokes.json'
import movies from '../data/movies.json'

const WELCOME_MESSAGES = [
  'SkylarOS v1.0 — Terminal',
  'Type "help" for available commands.',
  '',
  '✦ 欢迎来到我的个人空间站 ✦',
]

let idCounter = 0
const makeId = () => `t-${++idCounter}`

const formatDate = () => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const processResponse = (response) => {
  if (typeof response === 'string' && response.includes('{{date}}')) {
    return response.replace(/\{\{date\}\}/g, formatDate())
  }
  return response
}

const textJokes = jokes.filter((j) => j.type === 'text')

const getRandomJoke = () => {
  if (textJokes.length === 0) return '暂无文字梗'
  const idx = Math.floor(Math.random() * textJokes.length)
  return textJokes[idx].content
}

const getTodayJoke = () => {
  const today = new Date().toISOString().slice(0, 10)
  const joke = jokes.find((j) => j.date === today)
  if (joke && joke.type === 'text') return joke.content
  return getRandomJoke()
}

const getRandomMovie = () => {
  const idx = Math.floor(Math.random() * movies.length)
  const m = movies[idx]
  const stars = '⭐'.repeat(m.rating)
  return [
    `🎬 ${m.title} (${m.year})`,
    `导演：${m.director}  ${stars}`,
    `"${m.comment}"`,
  ].join('\n')
}

export const useTerminalStore = create((set, get) => ({
  history: WELCOME_MESSAGES.map((m) => ({ type: 'output', content: m, id: makeId() })),

  executeCommand: (input) => {
    const trimmed = input.trim().toLowerCase()
    const state = get()

    if (trimmed === 'clear') {
      set({ history: [] })
      return
    }

    const newHistory = [
      ...state.history,
      { type: 'input', content: input, id: makeId() },
    ]

    // Dynamic joke commands
    if (trimmed === 'joke') {
      newHistory.push({ type: 'output', content: getRandomJoke(), id: makeId() })
      set({ history: newHistory })
      return
    }

    if (trimmed === 'cat haha.txt') {
      newHistory.push({ type: 'output', content: getTodayJoke(), id: makeId() })
      set({ history: newHistory })
      return
    }

    // Dynamic movie command
    if (trimmed === 'movie') {
      newHistory.push({ type: 'output', content: getRandomMovie(), id: makeId() })
      set({ history: newHistory })
      return
    }

    const response = terminalResponses[trimmed]

    if (response) {
      if (Array.isArray(response)) {
        response.forEach((r) => {
          newHistory.push({ type: 'output', content: processResponse(r), id: makeId() })
        })
      } else {
        newHistory.push({ type: 'output', content: processResponse(response), id: makeId() })
      }
    } else if (trimmed !== '') {
      newHistory.push({
        type: 'error',
        content: `zsh: command not found: ${input}`,
        id: makeId(),
      })
    }

    set({ history: newHistory })
  },
}))
