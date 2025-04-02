import Image from "next/image"

interface CaseStudyProps {
  title: string
  client: string
  description: string
  technologies: string[]
  image: string
}

export default function CaseStudy({ title, client, description, technologies, image }: CaseStudyProps) {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-neutral-800 rounded-sm overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-sm text-apple-blue mb-1">{client}</p>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-neutral-300 mb-4">{description}</p>

        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-neutral-800 text-neutral-300 rounded-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

