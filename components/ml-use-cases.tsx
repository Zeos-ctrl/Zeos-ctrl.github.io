"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Brain, Database, LineChart, Building, Microscope, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UseCaseProps {
  title: string
  icon: React.ReactNode
  content: string
}

const UseCase = ({ title, icon, content }: UseCaseProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="marathon-card border border-white/10 overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="text-neon">{icon}</div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        <div className="text-neon">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-4 border-t border-white/10">
              <p className="marathon-text text-white">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MLUseCases() {
  const useCases = [
    {
      title: "NATURAL LANGUAGE PROCESSING",
      icon: <Brain className="w-5 h-5" />,
      content:
        "NLP enables machines to understand, interpret, and generate human language. Applications include chatbots, sentiment analysis, language translation, content summarization, and automated report generation. Our systems can process unstructured text data to extract insights and automate communication tasks.",
    },
    {
      title: "COMPUTER VISION",
      icon: <LineChart className="w-5 h-5" />,
      content:
        "Computer vision allows machines to interpret and make decisions based on visual data. Use cases include facial recognition, object detection, autonomous vehicles, quality control in manufacturing, medical image analysis, and augmented reality. Our solutions can process images and video to identify patterns and anomalies.",
    },
    {
      title: "PREDICTIVE ANALYTICS",
      icon: <Database className="w-5 h-5" />,
      content:
        "Predictive analytics uses historical data to forecast future outcomes. Applications include demand forecasting, risk assessment, predictive maintenance, customer churn prediction, and financial modeling. Our models can analyze trends and patterns to help businesses make data-driven decisions.",
    },
    {
      title: "SCIENTIFIC RESEARCH",
      icon: <Microscope className="w-5 h-5" />,
      content:
        "Machine learning accelerates scientific discovery in fields like astronomy, physics, chemistry, and genomics. Applications include analyzing gravitational waves, protein folding prediction, climate modeling, and particle physics. Our research-focused ML solutions help scientists process complex datasets and identify patterns beyond human perception.",
    },
    {
      title: "BUSINESS INTELLIGENCE",
      icon: <Building className="w-5 h-5" />,
      content:
        "ML enhances business intelligence through customer segmentation, recommendation systems, fraud detection, process optimization, and market analysis. Our business solutions help companies gain competitive advantages by uncovering insights from their data and automating decision processes.",
    },
    {
      title: "CYBERSECURITY",
      icon: <ShieldCheck className="w-5 h-5" />,
      content:
        "Machine learning strengthens cybersecurity through anomaly detection, threat intelligence, user behavior analysis, and automated incident response. Our security-focused ML systems can identify patterns indicative of attacks, reduce false positives, and help organizations respond to threats more effectively.",
    },
  ]

  return (
    <div className="w-full">
      <div className="space-y-4">
        {useCases.map((useCase, index) => (
          <UseCase key={index} title={useCase.title} icon={useCase.icon} content={useCase.content} />
        ))}
      </div>
    </div>
  )
}
