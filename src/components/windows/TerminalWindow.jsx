import { useRef, useEffect, useState, useCallback } from 'react'
import { useTerminalStore } from '../../stores/terminalStore'

const LINE_DELAY = 40

export default function TerminalWindow() {
  const { history, executeCommand } = useTerminalStore()
  const [input, setInput] = useState('')
  const [inputHistory, setInputHistory] = useState([])
  const [historyCursor, setHistoryCursor] = useState(-1)
  const [displayed, setDisplayed] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const scrollRef = useRef(null)
  const queueRef = useRef([])
  const timerRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayed])

  // Build flat lines from history and feed into animation queue
  useEffect(() => {
    // Clear screen handling
    if (history.length === 0) {
      setDisplayed([])
      setIsRunning(false)
      queueRef.current = []
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // Build target lines from current history
    const target = []
    history.forEach((item) => {
      if (item.type === 'input') {
        target.push(item)
      } else if (typeof item.content === 'string') {
        const lines = item.content.split('\n')
        lines.forEach((line, i) => {
          target.push({ ...item, id: `${item.id}-${i}`, content: line })
        })
      }
    })

    // Find lines not yet shown
    const shownIds = new Set(displayed.map((d) => d.id))
    const newLines = target.filter((t) => !shownIds.has(t.id))

    if (newLines.length === 0) return

    // Append to queue
    queueRef.current.push(...newLines)

    // Start consumer timer if not running
    if (!timerRef.current) {
      setIsRunning(true)
      timerRef.current = setInterval(() => {
        if (queueRef.current.length === 0) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsRunning(false)
          return
        }
        const next = queueRef.current.shift()
        setDisplayed((prev) => [...prev, next])
      }, LINE_DELAY)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [history])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (inputHistory.length === 0) return
        const nextIndex =
          historyCursor < 0 ? inputHistory.length - 1 : Math.max(0, historyCursor - 1)
        setHistoryCursor(nextIndex)
        setInput(inputHistory[nextIndex])
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyCursor < 0) return
        const nextIndex = historyCursor + 1
        if (nextIndex >= inputHistory.length) {
          setHistoryCursor(-1)
          setInput('')
        } else {
          setHistoryCursor(nextIndex)
          setInput(inputHistory[nextIndex])
        }
      }
    },
    [inputHistory, historyCursor]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isRunning) return
    executeCommand(input)
    setInputHistory((prev) => [...prev, input])
    setHistoryCursor(-1)
    setInput('')
  }

  const renderLine = (item) => {
    if (item.type === 'input') {
      return (
        <div key={item.id} className="text-[#7ec8e3]">
          <span className="text-[#5aaa7a] mr-1.5 select-none">user@skylaros:~$</span>
          {item.content}
        </div>
      )
    }

    const colorClass =
      item.type === 'error'
        ? 'text-[#ff6b6b]'
        : item.content.startsWith('✦') ||
          item.content.startsWith('🎬') ||
          item.content.startsWith('😄') ||
          item.content.startsWith('┌') ||
          item.content.startsWith('│')
        ? 'text-[#a8e6cf]'
        : item.content.startsWith('  ')
        ? 'text-[#88c0a8]'
        : 'text-[#c8e6c9]'

    return (
      <div key={item.id} className={colorClass}>
        <span className="whitespace-pre-wrap">{item.content}</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0810] text-[13px] leading-relaxed font-mono relative overflow-hidden select-text">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {displayed.map((item) => renderLine(item))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center px-4 py-2.5 border-t border-[#3a3848] bg-[#0a0810]"
      >
        <span className="text-[#5aaa7a] mr-1.5 select-none shrink-0">user@skylaros:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[#d5d0e8] outline-none font-mono text-[13px] placeholder:text-[#3a3850] disabled:opacity-40"
          placeholder={isRunning ? '正在输出...' : '输入 help 查看命令列表...'}
          autoFocus
          disabled={isRunning}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  )
}
