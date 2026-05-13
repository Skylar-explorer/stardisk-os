import { useState, useRef, useEffect } from 'react'
import aboutData from '../../data/about.json'

const SUGGESTION_MAP = {
  'skylar是一个什么样的人类': 'human',
  'skylar是一个什么样的人类？': 'human',
  'skylar的职业探索': 'career',
  'skylar的职业探索？': 'career',
  '怎样联系到skylar': 'contact',
  '怎样联系到skylar？': 'contact',
}

function BrowserChrome({ url, onHome, onBack, canGoBack }) {
  return (
    <div className="bg-[#e8e4dc] border-b-2 border-[rgba(58,109,181,0.15)] px-3 py-2 flex items-center gap-2 select-none">
      <div className="flex gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="w-7 h-6 flex items-center justify-center text-[12px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 disabled:opacity-30 active:border-r-white/80 active:border-b-white/80 active:border-l-[rgba(58,109,181,0.25)] active:border-t-[rgba(58,109,181,0.25)]"
          title="后退"
        >
          ←
        </button>
        <button
          onClick={onHome}
          className="w-7 h-6 flex items-center justify-center text-[12px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.25)] border-b-[rgba(58,109,181,0.25)] bg-white/60 active:border-r-white/80 active:border-b-white/80 active:border-l-[rgba(58,109,181,0.25)] active:border-t-[rgba(58,109,181,0.25)]"
          title="主页"
        >
          🏠
        </button>
      </div>
      <div className="flex-1 flex items-center gap-1.5 bg-white border-2 border-[rgba(58,109,181,0.2)] border-l-white/60 border-t-white/60 rounded px-3 py-[4px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
        <span className="text-[11px] text-retro-muted">🔒</span>
        <span className="text-[12px] text-retro-text truncate font-mono">{url}</span>
      </div>
    </div>
  )
}

function StatusBar({ text }) {
  return (
    <div className="bg-[#e8e4dc] border-t border-[rgba(58,109,181,0.12)] px-3 py-[4px] text-[11px] text-retro-muted flex items-center gap-2 select-none">
      <span>{text}</span>
      <span className="ml-auto">🌐 已连接</span>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[10px] px-2 py-[2px] rounded border border-[rgba(58,109,181,0.2)] bg-white/60 text-retro-muted hover:text-retro-text hover:border-[rgba(58,109,181,0.4)] transition-all ml-2"
    >
      {copied ? '✅ 已复制' : '📋 复制'}
    </button>
  )
}

function HomePage({ onSearch, suggestions }) {
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
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="mb-8 text-center">
        <div
          className="text-[36px] font-bold tracking-tight mb-2"
          style={{
            color: '#3a6db5',
            fontFamily: "'VT323', monospace",
            textShadow: '0 0 10px rgba(58,109,181,0.12)',
          }}
        >
          AboutMe Search
        </div>
        <div className="text-[12px] text-retro-muted">搜索你想了解的 Skylar</div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-[480px] mb-5">
        <div className="flex border-2 border-[rgba(58,109,181,0.3)] border-r-white/80 border-b-white/80 rounded-[4px] overflow-hidden shadow-[0_2px_8px_rgba(58,109,181,0.1)] bg-white">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入你想了解的内容..."
            className="flex-1 px-4 py-2.5 text-[14px] text-retro-text bg-transparent outline-none placeholder:text-retro-muted/40"
          />
          <button
            type="submit"
            className="px-4 text-[13px] bg-[#3a6db5] text-white hover:bg-[#2d5a9a] transition-colors"
          >
            搜索
          </button>
        </div>
      </form>

      <div className="w-full max-w-[480px]">
        <div className="text-[11px] text-retro-muted mb-2.5 tracking-wider">推荐搜索</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              className="text-[12px] px-3 py-[4px] rounded-full border border-[rgba(58,109,181,0.18)] text-retro-text bg-white/60 hover:bg-white hover:border-[rgba(58,109,181,0.35)] hover:shadow-[0_1px_4px_rgba(58,109,181,0.1)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function BaiduCard({ result, onOpenDetail }) {
  const introBlock = result.content?.find((b) => b.type === 'baidu_intro')
  const introText = introBlock?.text || result.summary

  return (
    <div className="bg-white/80 border-2 border-[rgba(58,109,181,0.15)] border-r-white/80 border-b-white/80 rounded-[5px] p-4 shadow-[0_2px_8px_rgba(58,109,181,0.08)] mb-5">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(58,109,181,0.1)]">
        <span className="text-[16px]">📖</span>
        <span className="text-[13px] font-bold text-retro-text">{result.title}</span>
        <span className="text-[10px] px-1.5 py-[1px] rounded bg-[#3a6db5]/10 text-[#3a6db5] ml-auto">百度百科</span>
      </div>

      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="w-[110px] h-[140px] rounded-[4px] overflow-hidden border border-[rgba(58,109,181,0.15)] bg-white">
            <img
              src={import.meta.env.BASE_URL + (result.image || 'images/avatar.png')}
              alt="Skylar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-[10px] text-retro-muted text-center mt-1">Skylar 人物照</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-retro-text leading-relaxed">
            {introText}
          </div>
          <button
            onClick={() => onOpenDetail(0)}
            className="text-[11px] text-[#1a0dab] hover:underline mt-2 inline-block"
          >
            查看详情 →
          </button>
        </div>
      </div>
    </div>
  )
}

function SearchResults({ query, results, onOpenDetail }) {
  const baiduResult = results.find((r) => r.style === 'baidu')
  const normalResults = results.filter((r) => r.style !== 'baidu')

  return (
    <div className="h-full overflow-auto px-6 py-5">
      <div className="max-w-[640px] mx-auto">
        <div className="text-[12px] text-retro-muted mb-4">
          AboutMe Search 为您找到相关结果约 <span className="text-retro-text font-semibold">{results.length}</span> 条
          <span className="mx-2">·</span>
          搜索用时 0.06 秒
        </div>

        {/* Baidu-style card at top of results */}
        {baiduResult && (
          <BaiduCard result={baiduResult} onOpenDetail={onOpenDetail} />
        )}

        <div className="space-y-4">
          {normalResults.map((result, idx) => {
            // Adjust index to account for baidu result being filtered out
            const realIndex = results.indexOf(result)
            return (
              <div
                key={realIndex}
                className="group cursor-pointer"
                onClick={() => onOpenDetail(realIndex)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-[18px] mt-0.5 shrink-0">{result.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-[#1a0dab] group-hover:underline leading-snug font-medium">
                      {result.title}
                    </div>
                    <div className="text-[11px] text-[#006621] leading-snug truncate">
                      {result.url}
                    </div>
                    <div className="text-[12px] text-[#545454] leading-relaxed mt-0.5">
                      {result.summary}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[rgba(58,109,181,0.1)]">
          <div className="text-[11px] text-retro-muted text-center">
            🌀 AboutMe Search · 仅索引关于 Skylar 的公开信息
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentRenderer({ content }) {
  return (
    <div className="space-y-5">
      {content.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <div key={i} className="text-[16px] font-bold text-retro-text flex items-center gap-2">
                <span className="w-[3px] h-[16px] bg-[#3a6db5] rounded-full" />
                {block.text}
              </div>
            )
          case 'paragraph':
            return (
              <p key={i} className="text-[13px] text-retro-text leading-relaxed pl-[11px]">
                {block.text}
              </p>
            )
          case 'quote':
            return (
              <div key={i} className="pl-[11px] border-l-2 border-[#3a6db5]/20 py-1">
                <p className="text-[13px] text-retro-text/80 italic leading-relaxed">
                  "{block.text}"
                </p>
              </div>
            )
          case 'tag':
            return (
              <div key={i} className="flex items-center gap-2 pl-[11px]">
                <span className="text-[11px] px-2.5 py-[3px] rounded bg-[#3a6db5]/10 text-[#3a6db5] font-semibold border border-[#3a6db5]/20">
                  {block.label}
                </span>
                <span className="text-[13px] text-retro-text">{block.value}</span>
              </div>
            )
          case 'badge':
            return (
              <div key={i} className="flex flex-wrap gap-2 pl-[11px]">
                {block.items.map((item, j) => (
                  <span
                    key={j}
                    className="text-[11px] px-2.5 py-[3px] rounded-full border border-[rgba(58,109,181,0.15)] text-retro-muted bg-white/50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )
          case 'timeline':
            return (
              <div key={i} className="pl-[11px] space-y-4">
                {block.items.map((item, j) => (
                  <div key={j} className="relative pl-5 border-l-2 border-[rgba(58,109,181,0.2)]">
                    <div className="absolute left-[-5px] top-[6px] w-[8px] h-[8px] rounded-full bg-[#3a6db5]/30 border-2 border-white" />
                    <div className="text-[11px] text-retro-muted mb-0.5">{item.period}</div>
                    <div className="text-[13px] font-semibold text-retro-text">{item.company}</div>
                    <div className="text-[12px] text-retro-muted">{item.role}</div>
                    {item.desc && <div className="text-[12px] text-retro-text/80 mt-1">{item.desc}</div>}
                  </div>
                ))}
              </div>
            )
          case 'contact_big':
            return (
              <div key={i} className="pl-[11px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-retro-muted w-12 shrink-0">{block.label}</span>
                  {block.link && block.link !== '#' ? (
                    <a
                      href={block.link}
                      className="text-[14px] text-[#1a0dab] hover:underline font-medium"
                    >
                      {block.value}
                    </a>
                  ) : (
                    <span className="text-[14px] text-retro-text font-medium">{block.value}</span>
                  )}
                  <CopyButton text={block.value} />
                </div>
              </div>
            )
          case 'baidu_intro':
            return (
              <div key={i} className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-[120px] h-[150px] rounded-[4px] overflow-hidden border border-[rgba(58,109,181,0.15)] bg-white">
                    <img
                      src={import.meta.env.BASE_URL + 'images/avatar.png'}
                      alt="Skylar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] text-retro-muted text-center mt-1">Skylar 人物照</div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-retro-text leading-relaxed">
                    {block.text}
                  </div>
                </div>
              </div>
            )
          case 'resume_link':
            return (
              <div key={i} className="pl-[11px]">
                <a
                  href={import.meta.env.BASE_URL + 'resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#1a0dab] hover:underline font-medium px-3 py-1.5 rounded border border-[rgba(58,109,181,0.15)] bg-white/50 hover:bg-white transition-colors"
                >
                  <span>📎</span>
                  戳此查看简历
                </a>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

function DetailPage({ result, onBack }) {
  if (!result) return null

  const isBaidu = result.style === 'baidu'

  return (
    <div className="h-full overflow-auto px-6 py-5">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onBack}
            className="text-[12px] px-2.5 py-[4px] rounded border-2 border-white/80 border-r-[rgba(58,109,181,0.2)] border-b-[rgba(58,109,181,0.2)] bg-white/60 text-retro-muted hover:text-retro-text transition-colors"
          >
            ← 返回搜索结果
          </button>
          <span className="text-[11px] text-retro-muted">搜索结果</span>
        </div>

        <div className="bg-white/70 border-2 border-[rgba(58,109,181,0.12)] border-r-white/80 border-b-white/80 rounded-[5px] p-5 shadow-[0_2px_8px_rgba(58,109,181,0.06)]">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[rgba(58,109,181,0.1)]">
            <span className="text-[20px]">{result.icon}</span>
            <div>
              <h1 className="text-[16px] font-bold text-retro-text">{result.title}</h1>
              <div className="text-[11px] text-retro-muted">{result.url}</div>
            </div>
          </div>

          {isBaidu && (
            <div className="mb-3 px-2 py-1 bg-[#f0f7ff] rounded text-[10px] text-[#3a6db5] font-medium inline-block">
              📖 百度百科风格词条
            </div>
          )}

          <ContentRenderer content={result.content} />
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-[11px] text-retro-muted hover:text-retro-text transition-colors"
          >
            🔙 返回搜索结果
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AboutMeWindow() {
  const [view, setView] = useState('home')
  const [activeSection, setActiveSection] = useState(null)
  const [activeResultIndex, setActiveResultIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
    const normalized = query.toLowerCase().replace(/\s/g, '')
    const sectionKey = SUGGESTION_MAP[normalized]
    if (sectionKey && aboutData.sections[sectionKey]) {
      setActiveSection(sectionKey)
      setView('results')
    } else {
      setActiveSection(null)
      setView('results')
    }
  }

  const handleOpenDetail = (idx) => {
    setActiveResultIndex(idx)
    setView('detail')
  }

  const handleBack = () => {
    if (view === 'detail') {
      setView('results')
      setActiveResultIndex(null)
    } else if (view === 'results') {
      setView('home')
      setActiveSection(null)
      setActiveResultIndex(null)
      setSearchQuery('')
    }
  }

  const handleHome = () => {
    setView('home')
    setActiveSection(null)
    setActiveResultIndex(null)
    setSearchQuery('')
  }

  const getResults = () => {
    if (!activeSection) return []
    return aboutData.sections[activeSection]?.results || []
  }

  const getCurrentResult = () => {
    const results = getResults()
    if (activeResultIndex === null || activeResultIndex >= results.length) return null
    return results[activeResultIndex]
  }

  const getUrl = () => {
    if (view === 'home') return 'https://about.me'
    if (view === 'results') return `https://about.me/search?q=${encodeURIComponent(searchQuery)}`
    const result = getCurrentResult()
    if (result) return result.url
    return 'https://about.me'
  }

  const getStatus = () => {
    if (view === 'home') return '🔍 准备搜索'
    if (view === 'results') {
      const count = getResults().length
      return `📋 "${searchQuery}" — ${count} 条结果`
    }
    const result = getCurrentResult()
    if (result) return `✅ 已加载 — ${result.title}`
    return ''
  }

  const canGoBack = view !== 'home'

  return (
    <div className="h-full flex flex-col bg-[#f5f3ee]">
      <BrowserChrome
        url={getUrl()}
        onHome={handleHome}
        onBack={handleBack}
        canGoBack={canGoBack}
      />

      <div className="flex-1 overflow-hidden">
        {view === 'home' && (
          <HomePage onSearch={handleSearch} suggestions={aboutData.suggestions} />
        )}

        {view === 'results' && (
          <SearchResults
            query={searchQuery}
            results={getResults()}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {view === 'detail' && (
          <DetailPage result={getCurrentResult()} onBack={handleBack} />
        )}
      </div>

      <StatusBar text={getStatus()} />
    </div>
  )
}
