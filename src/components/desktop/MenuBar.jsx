export default function MenuBar() {
  return (
    <div className="h-7 bg-white/65 backdrop-blur-md border-b border-[rgba(58,109,181,0.25)] flex items-center px-3 text-sm text-retro-text relative">
      <div className="w-[18px] h-[18px] mr-4 cursor-pointer flex items-center justify-center">
        📌
      </div>
      <div className="mr-5 cursor-pointer px-2 py-0.5 rounded hover:bg-[rgba(58,109,181,0.15)] hover:text-[#1a4a7a]">
        About Me
      </div>
      <div className="mr-5 cursor-pointer px-2 py-0.5 rounded hover:bg-[rgba(58,109,181,0.15)] hover:text-[#1a4a7a]">
        Contact
      </div>
      <div className="mr-5 cursor-pointer px-2 py-0.5 rounded hover:bg-[rgba(58,109,181,0.15)] hover:text-[#1a4a7a]">
        Surprise
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-[12px] text-retro-blue">☀</span>
        <span>09:15 PM</span>
      </div>
    </div>
  )
}
