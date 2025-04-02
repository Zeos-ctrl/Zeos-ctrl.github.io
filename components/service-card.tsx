import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  features: string[]
}

export default function ServiceCard({ icon, title, description, features }: ServiceCardProps) {
  return (
    <div className="bg-black/50 backdrop-blur-sm p-8 border border-neutral-800 rounded-sm hover:border-apple-blue/50 transition-colors group">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-300 mb-6">{description}</p>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-apple-blue mt-1">›</span>
            <span className="text-neutral-200">{feature}</span>
          </li>
        ))}
      </ul>

      <a href="#contact" className="inline-flex items-center text-apple-blue hover:underline">
        Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  )
}

