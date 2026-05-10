import resources from '../../data/resources.json'

export default function ResourcesWindow() {
  const categories = [...new Set(resources.map((r) => r.category))]

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="text-[11px] text-retro-muted mb-2">RESOURCES — {resources.length} items</div>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="text-[11px] text-retro-text font-bold mb-1.5 border-b border-[rgba(58,109,181,0.2)] pb-0.5">{cat}</div>
            <div className="space-y-1.5">
              {resources
                .filter((r) => r.category === cat)
                .map((r) => (
                  <div key={r.id} className="flex items-start gap-2 group cursor-pointer">
                    <span className="text-[10px] text-retro-muted mt-0.5">›</span>
                    <div className="flex-1">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-retro-text group-hover:text-retro-blue transition-colors"
                      >
                        {r.title}
                      </a>
                      <div className="text-[10px] text-retro-muted">{r.description}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
