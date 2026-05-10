import { useState } from 'react'
import projects from '../../data/projects.json'

function ProjectCard({ p }) {
  const [expanded, setExpanded] = useState(false)
  const initialCount = 2
  const hasMore = p.features.length > initialCount
  const shownFeatures = expanded ? p.features : p.features.slice(0, initialCount)

  const initial = p.title.charAt(0)

  return (
    <div className="border-2 border-[rgba(58,109,181,0.25)] border-r-white/80 border-b-white/80 bg-white/55 rounded-[5px] overflow-hidden transition-all duration-250 hover:shadow-[0_6px_20px_rgba(58,109,181,0.14)] hover:border-retro-blue/40 group">
      {/* Top accent line */}
      <div className="h-[3px] w-full" style={{ background: p.gradient || p.color }} />

      <div className="p-3.5">
        {/* Header row: cover + title + tags */}
        <div className="flex gap-3 mb-2.5">
          {/* Cover block */}
          <div
            className="w-[72px] h-[56px] rounded-[4px] shrink-0 flex items-center justify-center text-white font-bold text-[22px] shadow-inner transition-transform duration-200 group-hover:scale-[1.03]"
            style={{ background: p.gradient || p.color }}
          >
            {initial}
          </div>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-retro-text leading-tight truncate">
              {p.title}
            </div>
            <div className="text-[11px] text-retro-muted mt-0.5 truncate">
              {p.subtitle}
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-[5px] py-[1px] rounded-full border leading-tight"
                  style={{
                    borderColor: `${p.color}40`,
                    color: p.color,
                    background: `${p.color}12`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Problem */}
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[11px]">🔍</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: p.color }}>
              核心问题
            </span>
          </div>
          <div className="text-[12px] text-retro-text leading-relaxed pl-4">
            {p.problem}
          </div>
        </div>

        {/* Features */}
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[11px]">⚡</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: p.color }}>
              功能
            </span>
          </div>
          <ul className="space-y-1 pl-4">
            {shownFeatures.map((f, i) => (
              <li
                key={i}
                className="text-[11px] text-retro-text leading-relaxed flex items-start gap-1.5"
              >
                <span className="shrink-0 mt-[3px] w-[5px] h-[5px] rounded-full" style={{ background: p.color }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] mt-1.5 ml-4 text-retro-muted hover:text-retro-text transition-colors flex items-center gap-0.5"
            >
              {expanded ? '收起 ▲' : `展开全部 (${p.features.length}) ▼`}
            </button>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-[rgba(58,109,181,0.12)]">
          {p.link ? (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-3 py-[4px] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] bg-white/70 text-retro-text rounded-[3px] shadow-[0_1px_3px_rgba(58,109,181,0.08)] active:border-r-white/90 active:border-b-white/90 active:border-l-[rgba(58,109,181,0.3)] active:border-t-[rgba(58,109,181,0.3)] hover:bg-white transition-colors"
            >
              Live →
            </a>
          ) : p.linkNote ? (
            <span className="text-[10px] text-retro-muted italic">{p.linkNote}</span>
          ) : null}
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] px-3 py-[4px] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] bg-white/70 text-retro-text rounded-[3px] shadow-[0_1px_3px_rgba(58,109,181,0.08)] active:border-r-white/90 active:border-b-white/90 active:border-l-[rgba(58,109,181,0.3)] active:border-t-[rgba(58,109,181,0.3)] hover:bg-white transition-colors"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsWindow() {
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] text-retro-muted tracking-wider">
          PROJECTS — {projects.length} items
        </div>
        <div className="text-[10px] text-retro-muted/60">
          点击卡片展开详情
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-retro-muted/50">
        更多项目开发中...
      </div>
    </div>
  )
}
