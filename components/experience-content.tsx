interface ExperienceContentProps {
  data: {
    positions: Array<{
      title: string
      company: string
      period: string
      website?: string
      responsibilities: string[]
    }>
  }
}

export function ExperienceContent({ data }: ExperienceContentProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {data.positions.map((position, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-sm md:text-xl font-bold text-black">{position.title}</h3>
              <p className="text-xs md:text-lg text-gray-700 font-medium">{position.company}</p>
              {position.website && <p className="text-xs md:text-sm text-lime-600 font-medium">{position.website}</p>}
            </div>
            <span className="text-xs md:text-sm font-medium text-lime-600 bg-lime-50 px-2 py-1 md:px-3 md:py-1 rounded-full mt-2 md:mt-0 border border-lime-200">
              {position.period}
            </span>
          </div>

          <div className="space-y-2 md:space-y-3">
            <h4 className="text-xs md:text-sm font-semibold text-gray-600">Key Responsibilities:</h4>
            <div className="space-y-1 md:space-y-2">
              {position.responsibilities.map((responsibility, respIndex) => (
                <div key={respIndex} className="bg-white rounded-lg p-2 md:p-3 border border-gray-100">
                  <p className="text-xs md:text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-lime-500 rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0"></span>
                    {responsibility}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
