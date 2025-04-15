"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import MarathonButton from "./marathon-button"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formsubmit.co/320d206f9292e1275c7759e0e5f1ad26", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Form submission failed")

      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="YOUR NAME"
          value={formData.name}
          onChange={handleChange}
          required
          className="marathon-input bg-black/50 text-white"
        />
      </div>

      <div>
        <Input
          type="email"
          name="email"
          placeholder="YOUR EMAIL"
          value={formData.email}
          onChange={handleChange}
          required
          className="marathon-input bg-black/50 text-white"
        />
      </div>

      <div>
        <Input
          type="text"
          name="subject"
          placeholder="SUBJECT"
          value={formData.subject}
          onChange={handleChange}
          required
          className="marathon-input bg-black/50 text-white"
        />
      </div>

      <div>
        <Textarea
          name="message"
          placeholder="YOUR MESSAGE"
          value={formData.message}
          onChange={handleChange}
          required
          className="marathon-input bg-black/50 text-white min-h-[120px]"
        />
      </div>

      <MarathonButton type="submit" disabled={isSubmitting} variant="solid" className="w-full">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
            SENDING...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            SEND MESSAGE
          </span>
        )}
      </MarathonButton>

      {submitStatus === "success" && (
        <div className="p-3 border border-neon/30 text-neon marathon-text">
          THANK YOU! YOUR MESSAGE HAS BEEN SENT SUCCESSFULLY.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-3 border border-red-500/30 text-red-500 marathon-text">
          THERE WAS AN ERROR SENDING YOUR MESSAGE. PLEASE TRY AGAIN.
        </div>
      )}
    </form>
  )
}
