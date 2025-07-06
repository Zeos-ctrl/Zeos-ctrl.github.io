import { TopNavigation } from "@/components/top-navigation"
import { LandingGrid } from "@/components/landing-grid"
import portfolioData from "@/data/portfolio-config.json"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Top Navigation */}
      <TopNavigation />

      {/* Landing Section - Allows natural content flow */}
      <div className="bg-black pt-12 md:pt-20">
        <LandingGrid data={portfolioData} />
      </div>
    </div>
  )
}
