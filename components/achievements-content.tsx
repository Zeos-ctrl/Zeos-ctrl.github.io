interface AchievementsContentProps {
  data: {
    items: string[]
  }
}

export function AchievementsContent({ data }: AchievementsContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
      {data.items.map((item, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200">
          <div className="flex items-start space-x-2 md:space-x-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-indigo-500 rounded-full mt-1 md:mt-1.5 flex-shrink-0"></div>
            <span className="text-xs md:text-base text-gray-700 leading-tight">{item}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
