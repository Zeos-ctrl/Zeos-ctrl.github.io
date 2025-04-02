import Image from "next/image"
import { Linkedin, Github, Twitter } from "lucide-react"

interface SocialLink {
  platform: "linkedin" | "github" | "twitter"
  url: string
}

interface TeamMemberProps {
  name: string
  role: string
  bio: string
  image: string
  socialLinks?: SocialLink[]
}

export default function TeamMember({ name, role, bio, image, socialLinks = [] }: TeamMemberProps) {
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      case "github":
        return <Github className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="bg-black border border-neutral-800 rounded-sm overflow-hidden group hover:border-apple-blue/50 transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-apple-blue text-sm mb-4">{role}</p>
        <p className="text-neutral-400 mb-4 text-sm">{bio}</p>

        {socialLinks.length > 0 && (
          <div className="flex space-x-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:bg-apple-blue/10 hover:text-apple-blue transition-colors"
              >
                {renderSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

