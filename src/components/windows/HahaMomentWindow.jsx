import jokes from '../../data/jokes.json'

function TextCard({ joke }) {
  return (
    <div className="text-[12px] text-[#f0e4d0] whitespace-pre-line leading-relaxed">
      {joke.content}
    </div>
  )
}

function ImageCard({ joke }) {
  return (
    <div className="space-y-2">
      <img
        src={import.meta.env.BASE_URL + joke.src}
        alt=""
        className="w-full rounded-[2px]"
        style={{ maxHeight: 360, objectFit: 'contain' }}
        draggable={false}
      />
      {joke.caption && (
        <div className="text-[11px] text-[#c8c0b8] leading-relaxed">
          {joke.caption}
        </div>
      )}
    </div>
  )
}

export default function HahaMomentWindow() {
  return (
    <div className="p-3 h-full overflow-auto">
      <div className="text-[11px] text-retro-muted mb-2">HAHA MOMENT — {jokes.length} items</div>
      <div className="space-y-3">
        {jokes.map((joke) => (
          <div key={joke.id} className="border-2 border-[#c0b8b0] border-r-[#121018] border-b-[#121018] bg-[#4a3a2a] rounded-[3px] p-3">
            <div className="text-[10px] text-[#b09878] mb-1.5">{joke.date}</div>
            {joke.type === 'image' ? (
              <ImageCard joke={joke} />
            ) : (
              <TextCard joke={joke} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-[10px] text-retro-muted mt-4">
        😄 不定期更新，缓解求职焦虑
      </div>
    </div>
  )
}
