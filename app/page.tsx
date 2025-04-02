"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Mail, Shield, Brain, Code, Database, ChevronDown, ArrowRight, Menu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ContactForm from "@/components/contact-form"
import CaseStudy from "@/components/case-study"
import ServiceCard from "@/components/service-card"
import DotMatrix from "@/components/dot-matrix"
import SidebarNavigation from "@/components/sidebar-navigation"
import TeamMember from "@/components/team-member"
import MLUseCases from "@/components/ml-use-cases"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "ml", label: "ML" },
    { id: "services", label: "Services" },
    { id: "team", label: "Team" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
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

          // Add a class to prevent re-animation after the animation completes
          setTimeout(() => {
            entry.target.classList.add("animation-done")
          }, 600) // Match the duration of the animation

          // Unobserve after animation to prevent re-triggering
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe all elements with fade-in class
    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
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

    // Handle initial hash if present
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="bg-black text-white font-sans max-w-[100vw] overflow-x-hidden">
      <SidebarNavigation sections={sections} />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neutral-800">
        <div className="container mx-auto px-4 py-4 flex justify-center items-center">
          <a href="#home" className="absolute left-4 text-xl font-bold text-white">
            ZEOS.SYSTEMS
          </a>
          <nav className="hidden md:flex space-x-8 lg:space-x-12">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="uppercase text-sm tracking-wider hover:text-apple-blue transition-colors"
              >
                {section.label}
              </a>
            ))}
          </nav>
          <div className="absolute right-4 flex space-x-4 items-center">
            <a
              href="#contact"
              className="bg-apple-blue text-white text-sm px-4 py-2 rounded-md hidden sm:flex items-center gap-2"
            >
              Start Now <ArrowRight className="w-4 h-4" />
            </a>
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMobileMenu}
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
              className="md:hidden bg-black/95 backdrop-blur-md border-b border-neutral-800"
            >
              <div className="container mx-auto py-4 px-4">
                <nav className="flex flex-col space-y-4">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="text-white hover:text-apple-blue py-2 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {section.label}
                    </a>
                  ))}
                  <a
                    href="#contact"
                    className="bg-apple-blue text-white text-sm px-4 py-3 rounded-md flex items-center justify-center gap-2 mt-2"
                    onClick={closeMobileMenu}
                  >
                    Start Now <ArrowRight className="w-4 h-4" />
                  </a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="section-full pt-20">
        <DotMatrix dotCount={1000} dotSize={3} pattern="wave" maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 flex flex-col items-center justify-center text-center relative z-10">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 max-w-4xl fade-in">
            World-class machine learning
            <br />
            for tech founders.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 fade-in">
            <a
              href="#contact"
              className="bg-apple-blue text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
            >
              Launch Today <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 py-3 rounded-md flex items-center justify-center gap-2"
            >
              View Work <ChevronDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-full bg-neutral-900/30 pt-20">
        <DotMatrix dotCount={600} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 fade-in">
              <div className="text-apple-blue text-sm font-medium mb-2">// ABOUT US</div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Our mission is to secure and optimize your workflows with AI
              </h2>
              <p className="text-neutral-300 mb-6">
                At ZEOS.SYSTEMS, we combine cutting-edge expertise in machine learning and cybersecurity to deliver
                comprehensive solutions that protect and enhance your business operations.
              </p>
              <p className="text-neutral-300 mb-6">
                Founded by experts with backgrounds in data science, cybersecurity, and software engineering,
                we're committed to making advanced technology accessible and secure for organizations of all sizes.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-apple-blue"></div>
                <p className="text-apple-blue font-medium">Established 2024</p>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
              <div className="bg-black/50 backdrop-blur-sm p-6 border border-neutral-800 rounded-sm">
                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                <p className="text-neutral-300">
                  To create a world where organizations can harness the power of AI with confidence and security.
                </p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm p-6 border border-neutral-800 rounded-sm">
                <h3 className="text-xl font-bold mb-2">Our Values</h3>
                <p className="text-neutral-300">Integrity, innovation, and excellence in every solution we deliver.</p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm p-6 border border-neutral-800 rounded-sm">
                <h3 className="text-xl font-bold mb-2">Our Approach</h3>
                <p className="text-neutral-300">
                  Tailored, data-driven strategies that address your unique challenges.
                </p>
              </div>
              <div className="bg-black/50 backdrop-blur-sm p-6 border border-neutral-800 rounded-sm">
                <h3 className="text-xl font-bold mb-2">Our Expertise</h3>
                <p className="text-neutral-300">
                  Deep knowledge in ML workflows, cybersecurity, and system optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ML Use Cases Section */}
      <section id="ml" className="section-full pt-20">
        <DotMatrix dotCount={700} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="fade-in">
            <div className="text-apple-blue text-sm font-medium mb-2">// MACHINE LEARNING USE CASES</div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4">Transforming industries with AI.</h2>
            <p className="text-neutral-300 text-lg mb-12 max-w-2xl">
              Machine learning is revolutionizing how businesses operate across sectors. Explore some of the key
              applications where our expertise can drive innovation and efficiency.
            </p>

            <MLUseCases />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-full bg-neutral-900/30 pt-20">
        <DotMatrix dotCount={500} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="fade-in">
            <div className="text-apple-blue text-sm font-medium mb-2">// SERVICES</div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4">Expert solutions for complex challenges.</h2>
            <p className="text-neutral-300 text-lg mb-12 max-w-2xl">
              With years of experience in machine learning and cybersecurity, we specialize in creating secure,
              efficient, and scalable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="fade-in">
              <ServiceCard
                icon={<Brain className="w-8 h-8 text-apple-blue" />}
                title="ML Workflow Design"
                description="End-to-end machine learning pipeline development, from data ingestion to model deployment and monitoring."
                features={[
                  "Data preprocessing and feature engineering",
                  "Model selection and hyperparameter tuning",
                  "Scalable training infrastructure",
                  "Deployment and continuous improvement",
                ]}
              />
            </div>

            <div className="fade-in">
              <ServiceCard
                icon={<Shield className="w-8 h-8 text-apple-blue" />}
                title="Cybersecurity Consulting"
                description="Comprehensive security assessments and solutions to protect your data and systems from evolving threats."
                features={[
                  "Vulnerability assessment and penetration testing",
                  "Security architecture design",
                  "Incident response planning",
                  "Compliance and regulatory guidance",
                ]}
              />
            </div>

            <div className="fade-in">
              <ServiceCard
                icon={<Code className="w-8 h-8 text-apple-blue" />}
                title="Secure Software Development"
                description="Building robust applications with security integrated throughout the development lifecycle."
                features={[
                  "Secure coding practices",
                  "Code review and vulnerability scanning",
                  "DevSecOps implementation",
                  "API security and authentication",
                ]}
              />
            </div>

            <div className="fade-in">
              <ServiceCard
                icon={<Database className="w-8 h-8 text-apple-blue" />}
                title="Data Security & Governance"
                description="Protecting sensitive data while ensuring compliance with regulatory requirements."
                features={[
                  "Data classification and mapping",
                  "Encryption and access control",
                  "Privacy compliance (GDPR, CCPA)",
                  "Data loss prevention strategies",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-full pt-20">
        <DotMatrix dotCount={600} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="fade-in">
            <div className="text-apple-blue text-sm font-medium mb-2">// OUR TEAM</div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4">Meet the experts.</h2>
            <p className="text-neutral-300 text-lg mb-12 max-w-2xl">
              Our team brings together experience in machine learning, cybersecurity, and software
              development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="fade-in">
              <TeamMember
                name="Connor Bryan"
                role="Founder"
                bio="Bsc Computer Security (Cardiff Met), Msc Data Intensive Physics (Cardiff Uni). 8+ years of experience in the security sector."
                image="/images/connor_bryan.webp?height=400&width=300&text=connor&bryan"
                socialLinks={[
                  { platform: "linkedin", url: "https://www.linkedin.com/in/connor-bryan-92144922b" },
                  { platform: "github", url: "https://github.com/Zeos-ctrl" },
                  /*{ platform: "twitter", url: "https://twitter.com/" },*/
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-full bg-neutral-900/30 pt-20">
        <DotMatrix dotCount={700} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="fade-in">
            <div className="text-apple-blue text-sm font-medium mb-2">// PORTFOLIO</div>
            <h2 className="text-2xl md:text-5xl font-bold mb-4">Research & expertise.</h2>
            <p className="text-neutral-300 text-lg mb-12 max-w-2xl">
              Showcasing our machine learning research projects and expertise. We apply these same advanced techniques
              to solve complex problems for our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="fade-in">
              <CaseStudy
                title="Gravitational Wave Analysis"
                client="Research Project"
                description="Developed a machine learning model to analyze gravitational wave signals and estimate paramaters of the merger event, improving efficiency and accuracy of astronomical data processing."
                technologies={["Python", "TensorFlow", "NumPy", "Signal Processing", "Astronomy Data"]}
                image="/images/grav.webp"
              />
            </div>

            <div className="fade-in">
              <CaseStudy
                title="Urban Sounds Classification"
                client="Research Project"
                description="Created an audio classification system that can identify and categorize urban environmental sounds, enabling applications in noise pollution monitoring, urban planning, and smart city development."
                technologies={["TensorFlow", "Audio Processing", "Mel Spectrograms", "Transformers", "FNO"]}
                image="/images/city.webp"
              />
            </div>

            <div className="fade-in">
              <div className="bg-black/50 backdrop-blur-sm border border-neutral-800 rounded-sm overflow-hidden p-6 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-apple-blue/10 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your Security Project</h3>
                <p className="text-neutral-300 mb-4">
                  We're ready to help secure your machine learning workflows and systems. Contact us to discuss your
                  specific needs.
                </p>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20 transition-colors rounded-sm"
                >
                  Get Started
                </a>
              </div>
            </div>

            <div className="fade-in">
              <div className="bg-black/50 backdrop-blur-sm border border-neutral-800 rounded-sm overflow-hidden p-6 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-apple-blue/10 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-apple-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your ML Workflow</h3>
                <p className="text-neutral-300 mb-4">
                  Looking to optimize your machine learning pipeline? We can help design efficient, scalable, and secure
                  workflows.
                </p>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-apple-blue/10 text-apple-blue hover:bg-apple-blue/20 transition-colors rounded-sm"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-full pt-20">
        <DotMatrix dotCount={500} dotSize={3} maxDistance={150} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2 fade-in">
              <div className="text-apple-blue text-sm font-medium mb-2">// CONTACT US</div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">Let's discuss your project</h2>
              <p className="text-neutral-300 mb-8">
                Ready to enhance your machine learning workflows or strengthen your cybersecurity posture? Get in touch
                with our team of experts to discuss how we can help you achieve your goals.
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-apple-blue" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Email us at</p>
                  <a href="mailto:info@zeos.systems" className="text-apple-blue hover:underline">
                    connor.bryan@zeos.systems
                  </a>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <a
                  href="https://github.com/Zeos-ctrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center hover:bg-apple-blue/20 transition-colors"
                >
                  <Github className="w-5 h-5 text-apple-blue" />
                </a>
                <a
                  href="https://linkedin.com/company/98955018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-apple-blue/10 flex items-center justify-center hover:bg-apple-blue/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-apple-blue" />
                </a>
              </div>
            </div>

            <div className="md:w-1/2 fade-in">
              <div className="bg-black/50 backdrop-blur-sm p-8 border border-neutral-800 rounded-sm">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-800 relative">
        <DotMatrix dotCount={300} dotSize={2} maxDistance={100} />

        <div className="container mx-auto px-4 md:pl-24 lg:pl-32 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-neutral-400 text-sm">
                &copy; {new Date().getFullYear()} ZEOS.SYSTEMS. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <a href="#home" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                Home
              </a>
              <a href="#about" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                About
              </a>
              <a href="#ml-use-cases" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                ML Use Cases
              </a>
              <a href="#services" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                Services
              </a>
              <a href="#team" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                Team
              </a>
              <a href="#portfolio" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                Portfolio
              </a>
              <a href="#contact" className="text-sm text-neutral-400 hover:text-apple-blue transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

