"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Mail, Shield, Brain, Code, Database, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ContactForm from "@/components/contact-form"
import SidebarNavigation from "@/components/sidebar-navigation"
import MLUseCases from "@/components/ml-use-cases"
import MarathonButton from "@/components/marathon-button"
import MarathonNav from "@/components/marathon-nav"
import AnimatedText from "@/components/animated-text"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "ml-use-cases", label: "ML Use Cases" },
    { id: "services", label: "Services" },
    { id: "team", label: "Team" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ]

  const navItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "SERVICES", href: "#services" },
    { label: "TEAM", href: "#team" },
    { label: "PORTFOLIO", href: "#portfolio" },
    { label: "CONTACT", href: "#contact" },
  ]

  // Set up fade-in animations that only trigger once
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          setTimeout(() => entry.target.classList.add("animation-done"), 600)
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Smooth scroll implementation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const id = hash.replace("#", "")
        const element = document.getElementById(id)
        if (element) {
          window.scrollTo({
            top: element.offsetTop,
            behavior: "smooth",
          })
        }
      }
    }

    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    // Remove the hashchange event listener as it's causing issues with navigation
    // window.addEventListener("hashchange", handleHashChange)
    // return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <div className="bg-black text-white font-sans max-w-[100vw] overflow-x-hidden">
      {/* Removed MarathonGrid component */}
      <SidebarNavigation sections={sections} />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center">
            <img src="/images/zeos-logo.svg" alt="ZEOS.SYSTEMS Logo" className="h-10 w-auto logo-hover" />
          </a>
          <div className="hidden md:block">
            <MarathonNav items={navItems} />
          </div>
          <div className="flex items-center">
            <MarathonButton href="#contact" variant="solid" className="hidden sm:block">
              START NOW
            </MarathonButton>
            <button
              className="md:hidden text-white ml-4 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black border-b border-white/10"
            >
              <div className="container mx-auto py-4 px-4">
                <nav className="flex flex-col space-y-4">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="marathon-text uppercase hover:text-neon py-2 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-neon">[+]</span> {section.label.toUpperCase()}
                    </a>
                  ))}
                  <MarathonButton href="#contact" variant="solid" onClick={() => setMobileMenuOpen(false)}>
                    START NOW
                  </MarathonButton>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="section-full pt-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start max-w-4xl">
            <AnimatedText
              text="A MACHINE LEARNING & CYBERSECURITY CONSULTANCY"
              className="marathon-text text-neon mb-2"
              useGlitch={false}
            />
            <AnimatedText
              text="ML & SECURITY EXPERTISE FOR TECH FOUNDERS"
              className="marathon-title text-5xl md:text-7xl lg:text-8xl mb-8"
              glitchDelay={30}
              glitchSpeed={20}
              glitchCount={2}
              tag="h1"
              useGlitch={true}
            />
            <AnimatedText
              text="We provide focused machine learning and cybersecurity solutions tailored to your specific business needs. Our expertise helps tech founders implement practical AI solutions while maintaining security standards."
              className="marathon-text text-white/80 max-w-2xl mb-8"
              useGlitch={false}
            />
            <div className="flex flex-col sm:flex-row gap-4 fade-in">
              <MarathonButton href="#contact" variant="solid">
                LAUNCH TODAY
              </MarathonButton>
              <MarathonButton href="#portfolio">VIEW WORK</MarathonButton>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <AnimatedText text="// ABOUT US" className="marathon-text text-neon mb-2" useGlitch={false} />
              <AnimatedText
                text="FOCUSED ON PRACTICAL AI SOLUTIONS AND SECURITY"
                className="marathon-title text-3xl md:text-5xl mb-6"
                glitchDelay={30}
                glitchSpeed={20}
                glitchCount={2}
                tag="h2"
                useGlitch={true}
              />
              <AnimatedText
                text="At ZEOS.SYSTEMS, we offer targeted expertise in machine learning and cybersecurity to help businesses implement effective AI solutions while maintaining robust security practices."
                className="marathon-text text-white/80 mb-6"
                useGlitch={false}
              />
              <AnimatedText
                text="Our small, specialized team brings practical experience in data science and cybersecurity to deliver solutions that address real business challenges for organizations ranging from startups to established enterprises."
                className="marathon-text text-white/80 mb-6"
                useGlitch={false}
              />
              <div className="flex items-center gap-4 fade-in">
                <div className="w-12 h-1 bg-neon"></div>
                <p className="marathon-text text-neon">ESTABLISHED 2024</p>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
              <div className="marathon-card p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-2 text-neon">OUR VISION</h3>
                <AnimatedText
                  text="To help organizations implement practical AI solutions with appropriate security measures."
                  className="marathon-text text-white/80"
                  useGlitch={false}
                />
              </div>
              <div className="marathon-card p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-2 text-neon">OUR VALUES</h3>
                <AnimatedText
                  text="Practicality, transparency, and delivering measurable results."
                  className="marathon-text text-white/80"
                  useGlitch={false}
                />
              </div>
              <div className="marathon-card p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-2 text-neon">OUR APPROACH</h3>
                <AnimatedText
                  text="Focused solutions that address specific business challenges with appropriate technology."
                  className="marathon-text text-white/80"
                  useGlitch={false}
                />
              </div>
              <div className="marathon-card p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-2 text-neon">OUR EXPERTISE</h3>
                <AnimatedText
                  text="Practical implementation of ML workflows and cybersecurity best practices."
                  className="marathon-text text-white/80"
                  useGlitch={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ML Use Cases Section */}
      <section id="ml-use-cases" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div>
            <AnimatedText
              text="// MACHINE LEARNING USE CASES"
              className="marathon-text text-neon mb-2"
              useGlitch={false}
            />
            <AnimatedText
              text="PRACTICAL AI APPLICATIONS"
              className="marathon-title text-3xl md:text-5xl mb-4"
              glitchDelay={30}
              glitchSpeed={20}
              glitchCount={2}
              tag="h2"
              useGlitch={true}
            />
            <AnimatedText
              text="Machine learning offers practical solutions across various sectors. Here are key applications where our expertise can help implement effective solutions."
              className="marathon-text text-white/80 mb-12 max-w-2xl"
              useGlitch={false}
            />

            <MLUseCases />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div>
            <AnimatedText text="// SERVICES" className="marathon-text text-neon mb-2" useGlitch={false} />
            <AnimatedText
              text="FOCUSED SOLUTIONS FOR SPECIFIC CHALLENGES"
              className="marathon-title text-3xl md:text-5xl mb-4"
              glitchDelay={30}
              glitchSpeed={20}
              glitchCount={2}
              tag="h2"
              useGlitch={true}
            />
            <AnimatedText
              text="We offer targeted services in machine learning and cybersecurity, focusing on practical implementations that deliver measurable results."
              className="marathon-text text-white/80 mb-12 max-w-2xl"
              useGlitch={false}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="fade-in">
              <div className="marathon-card p-8 border border-white/10 h-full">
                <div className="mb-6 text-neon">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">ML WORKFLOW DESIGN</h3>
                <AnimatedText
                  text="Practical machine learning implementation from data preparation to deployment, tailored to your specific business needs."
                  className="marathon-text text-white/80 mb-6"
                  useGlitch={false}
                />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Data preprocessing and feature engineering"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Model selection and hyperparameter tuning"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Scalable training infrastructure"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Deployment and monitoring solutions"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                </ul>

                <MarathonButton href="#contact">LEARN MORE</MarathonButton>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card p-8 border border-white/10 h-full">
                <div className="mb-6 text-neon">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">CYBERSECURITY CONSULTING</h3>
                <AnimatedText
                  text="Targeted security assessments and practical solutions to protect your data and systems based on your specific risk profile."
                  className="marathon-text text-white/80 mb-6"
                  useGlitch={false}
                />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Vulnerability assessment and penetration testing"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Security architecture design"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Incident response planning"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Compliance and regulatory guidance"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                </ul>

                <MarathonButton href="#contact">LEARN MORE</MarathonButton>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card p-8 border border-white/10 h-full">
                <div className="mb-6 text-neon">
                  <Code className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">SECURE SOFTWARE DEVELOPMENT</h3>
                <AnimatedText
                  text="Implementing security best practices throughout the development process to build more resilient applications."
                  className="marathon-text text-white/80 mb-6"
                  useGlitch={false}
                />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Secure coding practices"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Code review and vulnerability scanning"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="DevSecOps implementation"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="API security and authentication"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                </ul>

                <MarathonButton href="#contact">LEARN MORE</MarathonButton>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card p-8 border border-white/10 h-full">
                <div className="mb-6 text-neon">
                  <Database className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">DATA SECURITY & GOVERNANCE</h3>
                <AnimatedText
                  text="Practical approaches to data protection that balance security requirements with operational needs."
                  className="marathon-text text-white/80 mb-6"
                  useGlitch={false}
                />

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Data classification and mapping"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Encryption and access control"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Privacy compliance (GDPR, CCPA)"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">›</span>
                    <AnimatedText
                      text="Data loss prevention strategies"
                      className="marathon-text text-white/80"
                      useGlitch={false}
                    />
                  </li>
                </ul>

                <MarathonButton href="#contact">LEARN MORE</MarathonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div>
            <AnimatedText text="// OUR TEAM" className="marathon-text text-neon mb-2" useGlitch={false} />
            <AnimatedText
              text="MEET THE TEAM"
              className="marathon-title text-3xl md:text-5xl mb-4"
              glitchDelay={30}
              glitchSpeed={20}
              glitchCount={2}
              tag="h2"
              useGlitch={true}
            />
            <AnimatedText
              text="Our specialized team combines academic expertise with practical industry experience to deliver targeted solutions."
              className="marathon-text text-white/80 mb-12 max-w-2xl"
              useGlitch={false}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="fade-in">
              <div className="marathon-card border border-white/10 overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/images/connor_bryan.webp?height=400&width=300&text=connor&bryan"
                    alt="Connor Bryan"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-white">CONNOR BRYAN</h3>
                  <p className="marathon-text text-neon text-sm mb-4">FOUNDER</p>
                  <AnimatedText
                    text="Combining 8+ years in the security sector with academic credentials in Computer Security and Data Intensive Physics. Specialized in applying ML techniques to security challenges and scientific data analysis."
                    className="marathon-text text-white/80 mb-4 text-sm"
                    useGlitch={false}
                  />

                  <div className="flex space-x-3">
                    <a
                      href="https://www.linkedin.com/in/connor-bryan-92144922b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center text-neon hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="https://github.com/Zeos-ctrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center text-neon hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div>
            <AnimatedText text="// PORTFOLIO" className="marathon-text text-neon mb-2" useGlitch={false} />
            <AnimatedText
              text="RESEARCH & EXPERTISE"
              className="marathon-title text-3xl md:text-5xl mb-4"
              glitchDelay={30}
              glitchSpeed={20}
              glitchCount={2}
              tag="h2"
              useGlitch={true}
            />
            <AnimatedText
              text="Showcasing our machine learning research projects and expertise. We apply these same advanced techniques to solve complex problems for our clients."
              className="marathon-text text-white/80 mb-12 max-w-2xl"
              useGlitch={false}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="fade-in">
              <div className="marathon-card border border-white/10 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/images/grav.webp"
                    alt="Gravitational Wave Analysis"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="marathon-text text-neon text-sm mb-1">RESEARCH PROJECT</p>
                    <h3 className="text-xl font-bold text-white">GRAVITATIONAL WAVE ANALYSIS</h3>
                  </div>
                </div>

                <div className="p-6">
                  <AnimatedText
                    text="Developed a machine learning model to analyze gravitational wave signals and estimate parameters of the merger event, improving efficiency and accuracy of astronomical data processing."
                    className="marathon-text text-white/80 mb-4"
                    useGlitch={false}
                  />

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">PYTHON</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">TENSORFLOW</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">NUMPY</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">SIGNAL PROCESSING</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">ASTRONOMY DATA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card border border-white/10 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="/images/city.webp"
                    alt="Urban Sounds Classification"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="marathon-text text-neon text-sm mb-1">RESEARCH PROJECT</p>
                    <h3 className="text-xl font-bold text-white">URBAN SOUNDS CLASSIFICATION</h3>
                  </div>
                </div>

                <div className="p-6">
                  <AnimatedText
                    text="Created an audio classification system that can identify and categorize urban environmental sounds, enabling applications in noise pollution monitoring, urban planning, and smart city development."
                    className="marathon-text text-white/80 mb-4"
                    useGlitch={false}
                  />

                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">TENSORFLOW</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">AUDIO PROCESSING</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">MEL SPECTROGRAMS</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">NEURAL OPERATORS</span>
                    <span className="px-2 py-1 text-xs marathon-text bg-white/5 text-neon">TRANSFORMERS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card p-6 border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4 text-neon">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">YOUR SECURITY PROJECT</h3>
                <AnimatedText
                  text="We're ready to help secure your machine learning workflows and systems. Contact us to discuss your specific needs."
                  className="marathon-text text-white/80 mb-4"
                  useGlitch={false}
                />
                <MarathonButton href="#contact">GET STARTED</MarathonButton>
              </div>
            </div>

            <div className="fade-in">
              <div className="marathon-card p-6 border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4 text-neon">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">YOUR ML WORKFLOW</h3>
                <AnimatedText
                  text="Looking to optimize your machine learning pipeline? We can help design efficient, scalable, and secure workflows."
                  className="marathon-text text-white/80 mb-4"
                  useGlitch={false}
                />
                <MarathonButton href="#contact">LEARN MORE</MarathonButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-full pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <AnimatedText text="// CONTACT US" className="marathon-text text-neon mb-2" useGlitch={false} />
              <AnimatedText
                text="LET'S DISCUSS YOUR PROJECT"
                className="marathon-title text-3xl md:text-5xl mb-6"
                glitchDelay={30}
                glitchSpeed={20}
                glitchCount={2}
                tag="h2"
                useGlitch={true}
              />
              <AnimatedText
                text="Interested in implementing machine learning or improving your cybersecurity posture? Contact us to discuss how our focused expertise can help address your specific challenges."
                className="marathon-text text-white/80 mb-8"
                useGlitch={false}
              />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 flex items-center justify-center text-neon">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-white/60">EMAIL US AT</p>
                  <a href="mailto:connor.bryan@zeos.systems" className="text-neon hover:underline marathon-text">
                    CONNOR.BRYAN@ZEOS.SYSTEMS
                  </a>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <a
                  href="https://github.com/Zeos-ctrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center text-neon hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/98955018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center text-neon hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="md:w-1/2 fade-in">
              <div className="marathon-card p-8 border border-white/10">
                <h3 className="text-xl font-bold mb-6 text-white">SEND US A MESSAGE</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="marathon-text text-white/60 text-sm">
                &copy; {new Date().getFullYear()} <span className="text-neon">ZEOS.SYSTEMS</span>. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm marathon-text text-white/60 hover:text-neon transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
