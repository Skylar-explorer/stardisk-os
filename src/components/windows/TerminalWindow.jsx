import { useRef, useEffect, useState, useCallback } from 'react'
import { useTerminalStore } from '../../stores/terminalStore'

const TYPING_SPEED = 10

export default function TerminalWindow() {
  const { history, executeCommand } = useTerminalStore()
  const [input, setInput] = useState('')
  const [typedMap, setTypedMap] = useState({})
  const [isTyping, setIsTyping] = useState(false)
  const [inputHistory, setInputHistory] = useState([])
  const [historyCursor, setHistoryCursor] = useState(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const prevHistoryLen = useRef(history.length)

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history, typedMap])

  // Typing effect: type newly added output/error items
  useEffect(() => {
    if (history.length <= prevHistoryLen.current) {
      prevHistoryLen.current = history.length
      return
    }

    const newItems = history.slice(prevHistoryLen.current).filter((item) => item.type !== 'input')
    prevHistoryLen.current = history.length

    if (newItems.length === 0) return

    let cancelled = false
    setIsTyping(true)

    const typeItems = async () => {
      for (const item of newItems) {
        if (cancelled) break
        const fullText = item.content
        for (let i = 0; i <= fullText.length; i++) {
          if (cancelled) break
          setTypedMap((prev) => ({ ...prev, [item.id]: fullText.slice(0, i) }))
          await new Promise((r) => setTimeout(r, TYPING_SPEED))
        }
      }
      if (!cancelled) setIsTyping(false)
    }

    typeItems()
    return () => { cancelled = true }
  }, [history])

  // Command history navigation
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
    if (!input.trim() || isTyping) return
    executeCommand(input)
    setInputHistory((prev) => [...prev, input])
    setHistoryCursor(-1)
    setInput('')
  }

  const renderLine = (item) => {
    if (item.type === 'input') {
      return (
        <div key={item.id} className="text-[#7ec8e3]">
          <span className="text-[#5aaa7a] mr-1.5 select-none">user@stardisk:~$</span>
          {item.content}
        </div>
      )
    }

    const isDone = typedMap[item.id] === item.content || typedMap[item.id] === undefined
    const text = typedMap[item.id] !== undefined ? typedMap[item.id] : item.content

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
      <div key={item.id} className={`${colorClass} ${item.type === 'error' ? '' : 'font-normal'}`}>
        <span className="whitespace-pre-wrap">{text}</span>
        {!isDone && (
          <span className="inline-block w-[7px] h-[15px] bg-[#c8e6c9] ml-0.5 align-middle animate-pulse" />
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#0a1628] text-[13px] leading-relaxed font-mono relative overflow-hidden select-text">
      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 3px)',
        }}
      />

      {/* Subtle screen glow */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(58,109,181,0.04) 0%, transparent 60%)',
        }}
      />

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 relative z-0">
        {history.map((item) => renderLine(item))}
      </div>

      {/* Input line */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center px-4 py-2.5 border-t border-[rgba(58,109,181,0.22)] bg-[#0a1628] relative z-0"
      >
        <span className="text-[#5aaa7a] mr-1.5 select-none shrink-0">user@stardisk:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[#e8d5f0] outline-none font-mono text-[13px] placeholder:text-[rgba(120,140,160,0.35)] disabled:opacity-40"
          placeholder={isTyping ? '正在输出...' : '输入 help 查看命令列表...'}
          autoFocus
          disabled={isTyping}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span
          className={`w-[7px] h-[15px] ml-0.5 shrink-0 ${
            isTyping ? 'opacity-0' : 'bg-[#c8e6c9] animate-pulse'
          }`}
        />
      </form>
    </div>
  )
}
