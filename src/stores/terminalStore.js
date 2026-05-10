import { create } from 'zustand'
import terminalResponses from '../data/terminalResponses.json'

const WELCOME_MESSAGES = [
  'StarDisk OS v1.0 — Terminal',
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
