import { useState, useRef, useEffect } from 'react'
import aboutData from '../../data/about.json'

const SUGGESTION_MAP = {
  'skylar是谁': 'who',
  'skylar是谁？': 'who',
  'skylar是一个什么样的人类': 'human',
  'skylar是一个什么样的人类？': 'human',
  'skylar平时喜欢干嘛': 'hobbies',
  'skylar平时喜欢干嘛？': 'hobbies',
  'skylar有哪些工作经历': 'experience',
  'skylar有哪些工作经历？': 'experience',
  'skylar最近在探索些啥': 'exploring',
  'skylar最近在探索些啥？': 'exploring',
  '怎样才能联系到skylar': 'contact',
  '怎样才能联系到skylar？': 'contact',
}

function BrowserChrome({ url, onHome, onBack, canGoBack }) {
  return (
    <div className="bg-[#e8e4dc] border-b-2 border-[rgba(58,109,181,0.15)] px-2 py-1.5 flex items-center gap-1.5 select-none">
      {/* Nav buttons */}
      <div className="flex gap-0.5">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="w-6 h-5 flex items-center justify-center text-[11px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 disabled:opacity-30 active:border-r-white/80 active:border-b-white/80 active:border-l-[rgba(58,109,181,0.25)] active:border-t-[rgba(58,109,181,0.25)]"
          title="后退"
        >
          ←
        </button>
        <button
          onClick={onHome}
          className="w-6 h-5 flex items-center justify-center text-[11px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 active:border-r-white/80 active:border-b-white/80 active:border-l-[rgba(58,109,181,0.25)] active:border-t-[rgba(58,109,181,0.25)]"
          title="主页"
        >
          🏠
        </button>
      </div>

      {/* Address bar */}
      <div className="flex-1 flex items-center gap-1 bg-white border-2 border-[rgba(58,109,181,0.2)] border-l-white/60 border-t-white/60 rounded px-2 py-[3px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
        <span className="text-[10px] text-retro-muted">🔒</span>
        <span className="text-[11px] text-retro-text truncate font-mono">{url}</span>
      </div>
    </div>
  )
}

function StatusBar({ text }) {
  return (
    <div className="bg-[#e8e4dc] border-t border-[rgba(58,109,181,0.12)] px-2 py-[3px] text-[10px] text-retro-muted flex items-center gap-2 select-none">
      <span>{text}</span>
      <span className="ml-auto">🌐 已连接</span>
    </div>
  )
}

function SearchPage({ onSearch, suggestions }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleSuggestionClick = (s) => {
    setQuery(s)
    onSearch(s)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div
          className="text-[28px] font-bold tracking-tight mb-1"
          style={{
            color: '#3a6db5',
            fontFamily: "'VT323', monospace",
            textShadow: '0 0 8px rgba(58,109,181,0.15)',
          }}
        >
          {aboutData.searchEngine.logo}
        </div>
        <div className="text-[11px] text-retro-muted">{aboutData.searchEngine.tagline}</div>
      </div>

      {/* Search box */}
      <form onSubmit={handleSubmit} className="w-full max-w-[340px] mb-4">
        <div className="flex border-2 border-[rgba(58,109,181,0.3)] border-r-white/80 border-b-white/80 rounded-[4px] overflow-hidden shadow-[0_2px_6px_rgba(58,109,181,0.08)] bg-white">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入你想了解的内容..."
            className="flex-1 px-3 py-2 text-[13px] text-retro-text bg-transparent outline-none placeholder:text-retro-muted/50"
          />
          <button
            type="submit"
            className="px-3 text-[12px] bg-[#3a6db5] text-white hover:bg-[#2d5a9a] transition-colors"
          >
            搜索
          </button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="w-full max-w-[340px]">
        <div className="text-[10px] text-retro-muted mb-2 tracking-wider">推荐搜索</div>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className="text-[11px] px-2.5 py-[3px] rounded-full border border-[rgba(58,109,181,0.18)] text-retro-text bg-white/60 hover:bg-white hover:border-[rgba(58,109,181,0.35)] hover:shadow-[0_1px_4px_rgba(58,109,181,0.1)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentRenderer({ content }) {
  return (
    <div className="space-y-4">
      {content.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <div key={i} className="text-[15px] font-bold text-retro-text flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-[#3a6db5] rounded-full" />
                {block.text}
              </div>
            )
          case 'paragraph':
            return (
              <p key={i} className="text-[12px] text-retro-text leading-relaxed pl-[11px]">
                {block.text}
              </p>
            )
          case 'tag':
            return (
              <div key={i} className="flex items-center gap-2 pl-[11px]">
                <span className="text-[10px] px-2 py-[2px] rounded bg-[#3a6db5]/10 text-[#3a6db5] font-semibold border border-[#3a6db5]/20">
                  {block.label}
                </span>
                <span className="text-[12px] text-retro-text">{block.value}</span>
              </div>
            )
          case 'badge':
            return (
              <div key={i} className="flex flex-wrap gap-1.5 pl-[11px]">
                {block.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-[10px] px-2 py-[2px] rounded-full border border-[rgba(58,109,181,0.15)] text-retro-muted bg-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )
          case 'timeline':
            return (
              <div key={i} className="pl-[11px] space-y-3">
                {block.items.map((item, j) => (
                  <div key={j} className="relative pl-4 border-l-2 border-[rgba(58,109,181,0.2)]">
                    <div className="absolute left-[-5px] top-[5px] w-[8px] h-[8px] rounded-full bg-[#3a6db5]/30 border-2 border-white" />
                    <div className="text-[10px] text-retro-muted mb-0.5">{item.period}</div>
                    <div className="text-[12px] font-semibold text-retro-text">{item.company}</div>
                    <div className="text-[11px] text-retro-muted">{item.role}</div>
                    <div className="text-[11px] text-retro-text/80 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            )
          case 'contact':
            return (
              <div key={i} className="pl-[11px] space-y-2">
                {block.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-[10px] text-retro-muted w-16 shrink-0">{item.label}</span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#3a6db5] hover:underline truncate"
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

function DetailPage({ pageKey, onBack }) {
  const page = aboutData.pages[pageKey]
  if (!page) return null

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="text-[11px] px-2 py-[3px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.2)] border-b-[rgba(58,109,181,0.2)] bg-white/60 text-retro-muted hover:text-retro-text transition-colors"
        >
          ← 返回
        </button>
        <span className="text-[10px] text-retro-muted">搜索结果</span>
      </div>

      <div className="bg-white/70 border-2 border-[rgba(58,109,181,0.12)] border-r-white/80 border-b-white/80 rounded-[5px] p-4 shadow-[0_2px_8px_rgba(58,109,181,0.06)]">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[rgba(58,109,181,0.1)]">
          <span className="text-[18px]">{page.icon}</span>
          <h1 className="text-[15px] font-bold text-retro-text">{page.title}</h1>
        </div>
        <ContentRenderer content={page.content} />
      </div>

      <div className="mt-3 text-center">
        <button
          onClick={onBack}
          className="text-[11px] text-retro-muted hover:text-retro-text transition-colors"
        >
          🔙 返回搜索首页
        </button>
      </div>
    </div>
  )
}

export default function AboutMeWindow() {
  const [currentPage, setCurrentPage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
    const normalized = query.toLowerCase().replace(/\s/g, '')
    const matchedKey = SUGGESTION_MAP[normalized]
    if (matchedKey) {
      setCurrentPage(matchedKey)
    } else {
      setCurrentPage('notfound')
    }
  }

  const handleBack = () => {
    setCurrentPage(null)
    setSearchQuery('')
  }

  const handleHome = () => {
    setCurrentPage(null)
    setSearchQuery('')
  }

  const currentUrl = currentPage
    ? aboutData.pages[currentPage]?.url || 'https://about.me/search'
    : 'https://about.me'

  const statusText = currentPage
    ? `✅ 已完成 - ${aboutData.pages[currentPage]?.title || '搜索'}`
    : '🔍 准备搜索'

  return (
    <div className="h-full flex flex-col bg-[#f5f3ee]">
      <BrowserChrome
        url={currentUrl}
        onHome={handleHome}
        onBack={handleBack}
        canGoBack={currentPage !== null}
      />

      <div className="flex-1 overflow-hidden">
        {currentPage === null && (
          <SearchPage onSearch={handleSearch} suggestions={aboutData.suggestions} />
        )}

        {currentPage === 'notfound' && (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <div className="text-[32px] mb-2">🤔</div>
            <div className="text-[14px] font-bold text-retro-text mb-1">
              没有找到相关结果
            </div>
            <div className="text-[11px] text-retro-muted mb-4 text-center max-w-[280px]">
              试试推荐搜索中的关键词，或者换一种说法？
            </div>
            <button
              onClick={handleBack}
              className="text-[11px] px-3 py-1.5 rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 text-retro-text hover:bg-white transition-colors"
            >
              返回首页
            </button>
          </div>
        )}

        {currentPage && currentPage !== 'notfound' && (
          <DetailPage pageKey={currentPage} onBack={handleBack} />
        )}
      </div>

      <StatusBar text={statusText} />
    </div>
  )
}
