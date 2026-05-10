export default function StatusBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-white/65 backdrop-blur-md border-t border-[rgba(58,109,181,0.25)] flex items-center px-2 gap-2 z-[100]">
      <div className="w-7 h-[22px] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[12px] cursor-pointer bg-white/40 rounded-[3px] text-retro-text">
        💻
      </div>
      <div className="w-7 h-[22px] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[12px] cursor-pointer bg-white/40 rounded-[3px] text-retro-text">
        📁
      </div>
      <div className="w-7 h-[22px] border-2 border-white/90 border-r-[rgba(58,109,181,0.3)] border-b-[rgba(58,109,181,0.3)] flex items-center justify-center text-[12px] cursor-pointer bg-white/40 rounded-[3px] text-retro-text">
        📄
      </div>
      <div className="w-px h-5 bg-[rgba(58,109,181,0.25)] border-r border-white/50" />
      <div className="flex gap-4 ml-auto text-[11px]">
        <div className="flex items-center gap-1 text-retro-text">
          <span>CPU</span>
          <div className="w-[50px] h-2.5 bg-[rgba(220,224,115,0.5)] border border-[rgba(58,109,181,0.3)] border-r-white/70 border-b-white/70 rounded-[3px]">
            <div className="h-full bg-gradient-to-r from-retro-blue to-retro-blue-light w-[36%] rounded-[1px]" />
          </div>
          <span>36%</span>
        </div>
        <div className="flex items-center gap-1 text-retro-text">
          <span>DSK</span>
          <div className="w-[30px] h-2.5 bg-[rgba(220,224,115,0.5)] border border-[rgba(58,109,181,0.3)] border-r-white/70 border-b-white/70 rounded-[3px]">
            <div className="h-full bg-gradient-to-r from-retro-blue to-retro-blue-light w-0 rounded-[1px]" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-retro-text">
          <span>RAM</span>
          <div className="w-[30px] h-2.5 bg-[rgba(220,224,115,0.5)] border border-[rgba(58,109,181,0.3)] border-r-white/70 border-b-white/70 rounded-[3px]">
            <div className="h-full bg-gradient-to-r from-retro-blue to-retro-blue-light w-[60%] rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
