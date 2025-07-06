interface SkillsContentProps {
  data: {
    categories: Array<{
      name: string
      items: string[]
    }>
  }
}

export function SkillsContent({ data }: SkillsContentProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {data.categories.map((category, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200">
          <h3 className="text-sm md:text-lg font-bold text-black mb-2 md:mb-3">{category.name}</h3>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {category.items.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-2 py-1 md:px-3 md:py-1 bg-white text-gray-800 rounded-full text-xs md:text-sm font-medium border border-gray-300 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
