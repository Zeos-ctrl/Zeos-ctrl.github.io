"use client"

import type React from "react"

import { useState } from "react"
import { ImageCarousel } from "@/components/image-carousel"
import { InfoBox } from "@/components/info-box"
import { ExpandableModal } from "@/components/expandable-modal"
import { SkillsContent } from "@/components/skills-content"
import { ResearchContent } from "@/components/research-content"
import { ExperienceContent } from "@/components/experience-content"
import { AchievementsContent } from "@/components/achievements-content"
import { GitHubStats } from "@/components/github-stats"
import { GitHubContent } from "@/components/github-content"

interface LandingGridProps {
  data: {
    personal: {
      name: string
      title: string
      profile: string
      contact: {
        phone: string
        email: string
        address: string
        linkedin: string
        github: string
      }
    }
    sections: {
      skills: {
        categories: Array<{
          name: string
          items: string[]
        }>
      }
      research: {
        projects: Array<{
          title: string
          period: string
          supervisor: string
          institution: string
          description: string
        }>
      }
      experience: {
        positions: Array<{
          title: string
          company: string
          period: string
          website?: string
          responsibilities: string[]
        }>
      }
      achievements: {
        items: string[]
      }
      extracurricular: {
        activities: string[]
      }
    }
  }
}

export function LandingGrid({ data }: LandingGridProps) {
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean
    title: string
    content: React.ReactNode
  }>({
    isOpen: false,
    title: "",
    content: null,
  })

  const [expandedBox, setExpandedBox] = useState<string | null>(null)

  const openModal = (title: string, content: React.ReactNode, boxId: string) => {
    setExpandedBox(boxId)
    setTimeout(() => {
      setModalContent({
        isOpen: true,
        title,
        content,
      })
    }, 150)
  }

  const closeModal = () => {
    setModalContent({
      isOpen: false,
      title: "",
      content: null,
    })
    setTimeout(() => {
      setExpandedBox(null)
    }, 50)
  }

  return (
    <>
      <div className="min-h-screen md:h-[calc(100vh-80px)] px-2 md:px-6 py-2 md:py-6 flex items-start md:items-center justify-center">
        <div className="max-w-7xl mx-auto w-full h-full">
          {/* Mobile Layout - Content-focused */}
          <div className="md:hidden space-y-[1px] pb-4">
            {/* Profile Info */}
            <div
              className={`transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "profile" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <InfoBox title="Profile" className="min-h-[120px]">
                <div className="space-y-2 flex flex-col justify-center h-full">
                  <h3 className="text-sm font-bold text-black">{data.personal.name}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{data.personal.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{data.personal.profile}</p>
                </div>
              </InfoBox>
            </div>

            {/* Contact and Research Row */}
            <div className="grid grid-cols-2 gap-[1px]">
              {/* Contact */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox && expandedBox !== "contact" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <InfoBox title="Contact" className="min-h-[100px]">
                  <div className="space-y-2 text-xs text-gray-700 flex flex-col justify-center h-full">
                    <p className="break-all leading-relaxed">{data.personal.contact.email}</p>
                    <p className="leading-relaxed">{data.personal.contact.phone}</p>
                    <p className="text-gray-500 leading-relaxed text-[10px]">
                      {data.personal.contact.address.split(",").slice(0, 2).join(",")}
                    </p>
                  </div>
                </InfoBox>
              </div>

              {/* Latest Research */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox === "research"
                    ? "opacity-100 scale-105 z-10"
                    : expandedBox && expandedBox !== "research"
                      ? "opacity-30 scale-95"
                      : "opacity-100 scale-100"
                }`}
              >
                <InfoBox
                  title="Research"
                  className="min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    openModal("Research Projects", <ResearchContent data={data.sections.research} />, "research")
                  }
                >
                  <div className="space-y-1 flex flex-col justify-center h-full">
                    <h4 className="text-xs font-semibold text-black leading-tight">
                      {data.sections.research.projects[0]?.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      {data.sections.research.projects[0]?.period}
                    </p>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      {data.sections.research.projects[0]?.description.substring(0, 80)}...
                    </p>
                  </div>
                </InfoBox>
              </div>
            </div>

            {/* Image Carousel - Responsive with max height */}
            <div
              className={`aspect-square max-h-[90vh] transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "carousel" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <ImageCarousel />
            </div>

            {/* Skills Section */}
            <div
              className={`transition-all duration-300 ease-out ${
                expandedBox === "skills"
                  ? "opacity-100 scale-105 z-10"
                  : expandedBox && expandedBox !== "skills"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Key Skills"
                className="min-h-[140px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => openModal("Skills & Expertise", <SkillsContent data={data.sections.skills} />, "skills")}
              >
                <div className="space-y-3 flex flex-col justify-center h-full">
                  {data.sections.skills.categories.slice(0, 2).map((category, index) => (
                    <div key={index}>
                      <h4 className="text-xs font-semibold text-black mb-2">{category.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.items.slice(0, 4).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </InfoBox>
            </div>

            {/* Current Role */}
            <div
              className={`transition-all duration-300 ease-out ${
                expandedBox === "experience"
                  ? "opacity-100 scale-105 z-10"
                  : expandedBox && expandedBox !== "experience"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Current Role"
                className="min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() =>
                  openModal(
                    "Professional Experience",
                    <ExperienceContent data={data.sections.experience} />,
                    "experience",
                  )
                }
              >
                <div className="space-y-2 flex flex-col justify-center h-full">
                  <h4 className="text-sm font-semibold text-black leading-tight">
                    {data.sections.experience.positions[0]?.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {data.sections.experience.positions[0]?.company}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {data.sections.experience.positions[0]?.period}
                  </p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    {data.sections.experience.positions[0]?.responsibilities[0]}
                  </p>
                  {data.sections.experience.positions[0]?.website && (
                    <p className="text-[10px] text-blue-600 font-medium">
                      {data.sections.experience.positions[0]?.website}
                    </p>
                  )}
                </div>
              </InfoBox>
            </div>

            {/* Stats and Awards Row */}
            <div className="grid grid-cols-2 gap-[1px]">
              {/* Quick Stats */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox === "github"
                    ? "opacity-100 scale-105 z-10"
                    : expandedBox && expandedBox !== "github"
                      ? "opacity-30 scale-95"
                      : "opacity-100 scale-100"
                }`}
              >
                <InfoBox
                  title="GitHub Activity"
                  className="min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    openModal("GitHub Profile & Repositories", <GitHubContent username="Zeos-ctrl" />, "github")
                  }
                >
                  <GitHubStats username="Zeos-ctrl" />
                </InfoBox>
              </div>

              {/* Awards */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox === "achievements"
                    ? "opacity-100 scale-105 z-10"
                    : expandedBox && expandedBox !== "achievements"
                      ? "opacity-30 scale-95"
                      : "opacity-100 scale-100"
                }`}
              >
                <InfoBox
                  title="Recent Awards"
                  className="min-h-[100px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    openModal(
                      "Certifications & Awards",
                      <AchievementsContent data={data.sections.achievements} />,
                      "achievements",
                    )
                  }
                >
                  <div className="space-y-1 flex flex-col justify-center h-full">
                    {data.sections.achievements.items.slice(0, 3).map((achievement, index) => (
                      <p key={index} className="text-[10px] text-gray-700 leading-relaxed">
                        • {achievement.length > 40 ? achievement.substring(0, 40) + "..." : achievement}
                      </p>
                    ))}
                  </div>
                </InfoBox>
              </div>
            </div>

            {/* Connect and Time Row */}
            <div className="grid grid-cols-2 gap-[1px]">
              {/* Connect */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox && expandedBox !== "links" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <InfoBox title="Connect" className="min-h-[80px]">
                  <div className="space-y-2 flex flex-col justify-center h-full">
                    <a
                      href={`https://${data.personal.contact.linkedin}`}
                      className="block text-xs text-blue-600 hover:text-blue-500 leading-relaxed"
                    >
                      LinkedIn Profile
                    </a>
                    <a
                      href={`https://${data.personal.contact.github}`}
                      className="block text-xs text-blue-600 hover:text-blue-500 leading-relaxed"
                    >
                      GitHub Portfolio
                    </a>
                  </div>
                </InfoBox>
              </div>

              {/* Time */}
              <div
                className={`transition-all duration-300 ease-out ${
                  expandedBox && expandedBox !== "time" ? "opacity-30 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <InfoBox title="" className="min-h-[80px]">
                  <div className="flex flex-col justify-center items-center text-center h-full">
                    <p className="text-xl font-bold text-black">4:45 PM</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Sunday, June 29, 2025</p>
                  </div>
                </InfoBox>
              </div>
            </div>
          </div>

          {/* Desktop Layout - unchanged */}
          <div className="hidden md:grid grid-cols-12 grid-rows-8 gap-[1px] h-full">
            {/* Top Left - Profile Info */}
            <div
              className={`col-span-4 row-span-3 transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "profile" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <InfoBox title="Profile" className="h-full flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-black">{data.personal.name}</h3>
                  <p className="text-sm text-gray-700">{data.personal.title}</p>
                  <p className="text-xs text-gray-600">{data.personal.profile}</p>
                </div>
              </InfoBox>
            </div>

            {/* Top Center - Contact */}
            <div
              className={`col-span-4 row-span-2 transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "contact" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <InfoBox title="Contact" className="h-full flex flex-col">
                <div className="space-y-2 text-xs text-gray-700 flex-1 flex flex-col justify-center">
                  <p>{data.personal.contact.email}</p>
                  <p>{data.personal.contact.phone}</p>
                  <p className="text-gray-500">{data.personal.contact.address}</p>
                </div>
              </InfoBox>
            </div>

            {/* Top Right - Latest Research */}
            <div
              className={`col-span-4 row-span-3 transition-all duration-300 ease-out ${
                expandedBox === "research"
                  ? "opacity-100 scale-105 z-10 shadow-2xl"
                  : expandedBox && expandedBox !== "research"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Latest Research"
                className="h-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
                onClick={() =>
                  openModal("Research Projects", <ResearchContent data={data.sections.research} />, "research")
                }
              >
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-black">{data.sections.research.projects[0]?.title}</h4>
                  <p className="text-xs text-gray-500">{data.sections.research.projects[0]?.period}</p>
                  <p className="text-xs text-gray-700 leading-tight">
                    {data.sections.research.projects[0]?.description}
                  </p>
                </div>
              </InfoBox>
            </div>

            {/* Center - Image Carousel */}
            <div
              className={`col-span-4 row-span-4 col-start-5 row-start-3 transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "carousel" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <ImageCarousel />
            </div>

            {/* Left Middle - Skills Preview */}
            <div
              className={`col-span-4 row-span-3 row-start-4 transition-all duration-300 ease-out ${
                expandedBox === "skills"
                  ? "opacity-100 scale-105 z-10 shadow-2xl"
                  : expandedBox && expandedBox !== "skills"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Key Skills"
                className="h-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
                onClick={() => openModal("Skills & Expertise", <SkillsContent data={data.sections.skills} />, "skills")}
              >
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  {data.sections.skills.categories.slice(0, 3).map((category, index) => (
                    <div key={index}>
                      <h4 className="text-xs font-semibold text-black mb-1">{category.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.items.slice(0, index === 0 ? 4 : 3).map((skill, skillIndex) => (
                          <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </InfoBox>
            </div>

            {/* Right Middle - GitHub Activity */}
            <div
              className={`col-span-4 row-span-3 row-start-4 transition-all duration-300 ease-out ${
                expandedBox === "github"
                  ? "opacity-100 scale-105 z-10 shadow-2xl"
                  : expandedBox && expandedBox !== "github"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="GitHub Activity"
                className="h-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
                onClick={() =>
                  openModal("GitHub Profile & Repositories", <GitHubContent username="Zeos-ctrl" />, "github")
                }
              >
                <GitHubStats username="Zeos-ctrl" />
              </InfoBox>
            </div>

            {/* Bottom Left - Achievements */}
            <div
              className={`col-span-3 row-span-2 row-start-7 transition-all duration-300 ease-out ${
                expandedBox === "achievements"
                  ? "opacity-100 scale-105 z-10 shadow-2xl"
                  : expandedBox && expandedBox !== "achievements"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Recent Awards"
                className="h-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
                onClick={() =>
                  openModal(
                    "Certifications & Awards",
                    <AchievementsContent data={data.sections.achievements} />,
                    "achievements",
                  )
                }
              >
                <div className="space-y-1 flex-1 flex flex-col justify-center">
                  {data.sections.achievements.items.slice(0, 3).map((achievement, index) => (
                    <p key={index} className="text-xs text-gray-700 line-clamp-1">
                      • {achievement}
                    </p>
                  ))}
                </div>
              </InfoBox>
            </div>

            {/* Bottom Center - Current Role */}
            <div
              className={`col-span-3 row-span-2 row-start-7 transition-all duration-300 ease-out ${
                expandedBox === "experience"
                  ? "opacity-100 scale-105 z-10 shadow-2xl"
                  : expandedBox && expandedBox !== "experience"
                    ? "opacity-30 scale-95"
                    : "opacity-100 scale-100"
              }`}
            >
              <InfoBox
                title="Current Role"
                className="h-full cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
                onClick={() =>
                  openModal(
                    "Professional Experience",
                    <ExperienceContent data={data.sections.experience} />,
                    "experience",
                  )
                }
              >
                <div className="space-y-1 flex-1 flex flex-col justify-center">
                  <h4 className="text-sm font-semibold text-black">{data.sections.experience.positions[0]?.title}</h4>
                  <p className="text-xs text-gray-500">{data.sections.experience.positions[0]?.company}</p>
                  <p className="text-xs text-gray-500">{data.sections.experience.positions[0]?.period}</p>
                  <p className="text-xs text-gray-600 leading-tight line-clamp-2">
                    {data.sections.experience.positions[0]?.responsibilities[0]}
                  </p>
                </div>
              </InfoBox>
            </div>

            {/* Bottom Center-Right - Links */}
            <div
              className={`col-span-3 row-span-2 row-start-7 transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "links" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <InfoBox title="Connect" className="h-full flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  <a
                    href={`https://${data.personal.contact.linkedin}`}
                    className="block text-xs text-blue-600 hover:text-blue-500"
                  >
                    LinkedIn Profile
                  </a>
                  <a
                    href={`https://${data.personal.contact.github}`}
                    className="block text-xs text-blue-600 hover:text-blue-500"
                  >
                    GitHub Portfolio
                  </a>
                </div>
              </InfoBox>
            </div>

            {/* Bottom Right - Time */}
            <div
              className={`col-span-3 row-span-2 row-start-7 transition-all duration-300 ease-out ${
                expandedBox && expandedBox !== "time" ? "opacity-30 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <InfoBox title="" className="h-full flex flex-col justify-center items-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-black">4:45 PM</p>
                  <p className="text-xs text-gray-500">Sunday, June 29, 2025</p>
                </div>
              </InfoBox>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Modal */}
      <ExpandableModal isOpen={modalContent.isOpen} onClose={closeModal} title={modalContent.title}>
        {modalContent.content}
      </ExpandableModal>
    </>
  )
}
