import projects from '../../data/projects.json'

function ProjectCard({ p }) {
  const initial = p.title.charAt(0)

  return (
    <div className="border-2 border-[#d0c8c0] border-r-[#121018] border-b-[#121018] bg-[#4a3a2a] rounded-[5px] overflow-hidden shadow-[4px_4px_0_rgba(18,16,24,0.4),0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[6px_6px_0_rgba(18,16,24,0.5),0_4px_16px_rgba(0,0,0,0.35)] hover:border-retro-accent transition-all group">
      {/* Top accent line */}
      <div className="h-[3px] w-full" style={{ background: p.gradient || p.color }} />

      <div className="p-4 flex gap-3.5">
        {/* Color block */}
        <div
          className="w-12 h-12 rounded-[4px] shrink-0 flex items-center justify-center text-white font-bold text-[18px] shadow-inner"
          style={{ background: p.gradient || p.color }}
        >
          {initial}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + subtitle */}
          <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
            <span className="text-[15px] font-bold text-[#f0e4d0]">{p.title}</span>
            <span className="text-[11px] text-[#b09878]">{p.subtitle}</span>
          </div>

          {/* Painpoint */}
          {p.painpoint && (
            <p className="text-[11px] text-[#c89048] leading-relaxed mb-2">
              <span className="inline-block px-1.5 py-[1px] border border-[#c89048]/40 rounded-[2px] text-[10px] mr-1.5">核心痛点</span>
              {p.painpoint}
            </p>
          )}

          {/* Description */}
          <p className="text-[12px] text-[#e8e0d4] leading-relaxed mb-2">
            {p.description}
          </p>

          {/* Use cases */}
          <ul className="space-y-1">
            {p.useCases.map((u, i) => (
              <li key={i} className="text-[11px] text-[#c8c0b8] leading-relaxed flex items-start gap-1.5">
                <span className="shrink-0 mt-[5px] w-[4px] h-[4px] rounded-full bg-[#b09878]" />
                <span>{u}</span>
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="flex items-center gap-2.5 mt-3 pt-2.5 border-t border-[#d0c8c0]/30">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] px-3 py-[4px] border-2 border-[#d0c8c0] border-r-[#121018] border-b-[#121018] bg-[#d8d0c8] text-retro-text rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.15)] active:border-r-[#d0c8c0] active:border-b-[#d0c8c0] active:border-l-[#121018] active:border-t-[#121018] hover:bg-[#c8c0b8] transition-colors"
              >
                Live →
              </a>
            ) : p.linkNote ? (
              <span className="text-[10px] text-[#b09878] italic">{p.linkNote}</span>
            ) : null}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] px-3 py-[4px] border-2 border-[#d0c8c0] border-r-[#121018] border-b-[#121018] bg-[#d8d0c8] text-retro-text rounded-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.15)] active:border-r-[#d0c8c0] active:border-b-[#d0c8c0] active:border-l-[#121018] active:border-t-[#121018] hover:bg-[#c8c0b8] transition-colors"
              >
                GitHub →
              </a>
            )}
          </div>
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
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-[#a89f91]">
        更多项目开发中...
      </div>
    </div>
  )
}
