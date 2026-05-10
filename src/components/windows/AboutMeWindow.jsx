export default function AboutMeWindow() {
  return (
    <div className="p-4 h-full flex items-center justify-center text-retro-text">
      <div className="text-center">
        <div className="text-4xl mb-4">👤</div>
        <div className="text-lg font-bold mb-2">About Me</div>
        <div className="text-sm text-retro-muted max-w-[300px]">
          这里将展示你的个人介绍、简历和联系方式。<br/>
          等你提供 PRD 后，我会根据你的需求开发这个页面。
        </div>
      </div>
    </div>
  )
}
