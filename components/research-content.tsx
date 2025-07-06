import { ExternalLink } from "lucide-react"

interface ResearchContentProps {
  data: {
    projects: Array<{
      title: string
      period: string
      supervisor: string
      institution: string
      description: string
    }>
  }
}

export function ResearchContent({ data }: ResearchContentProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {data.projects.map((project, index) => (
        <div key={index} className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 md:mb-4">
            <div>
              <h3 className="text-sm md:text-xl font-bold text-black mb-1 md:mb-2">{project.title}</h3>
              <p className="text-xs md:text-sm text-gray-700 font-medium">
                Supervised by: {project.supervisor} • {project.institution}
              </p>
            </div>
            <span className="text-xs md:text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 md:px-3 md:py-1 rounded-full mt-2 md:mt-0 border border-orange-200">
              {project.period}
            </span>
          </div>

          <p className="text-xs md:text-base text-gray-700 leading-relaxed mb-3 md:mb-4">{project.description}</p>

          <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium border border-orange-200 transition-colors flex items-center space-x-1 md:space-x-2">
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
            <span>View Project</span>
          </button>
        </div>
      ))}
    </div>
  )
}
