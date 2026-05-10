import jokes from '../../data/jokes.json'

export default function HahaMomentWindow() {
  return (
    <div className="p-3 h-full overflow-auto">
      <div className="text-[11px] text-retro-muted mb-2">HAHA MOMENT — {jokes.length} jokes</div>
      <div className="space-y-3">
        {jokes.map((joke) => (
          <div key={joke.id} className="border-2 border-[rgba(58,109,181,0.3)] border-r-white/80 border-b-white/80 bg-white/60 rounded-[3px] p-3">
            <div className="text-[10px] text-retro-muted mb-1.5">{joke.date}</div>
            <div className="text-[12px] text-retro-text whitespace-pre-line leading-relaxed">
              {joke.content}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-[10px] text-retro-muted mt-4">
        😄 不定期更新，缓解求职焦虑
      </div>
    </div>
  )
}
