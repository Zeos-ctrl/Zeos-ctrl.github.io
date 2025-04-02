"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

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
      e.preventDefault();
      setIsSubmitting(true);

      try {
          const response = await fetch("https://formsubmit.co/320d206f9292e1275c7759e0e5f1ad26", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
          });

          if (!response.ok) throw new Error("Form submission failed");

          setSubmitStatus("success");
          setFormData({ name: "", email: "", subject: "", message: "" });
      } catch (error) {
          setSubmitStatus("error");
      } finally {
          setIsSubmitting(false);
          setTimeout(() => setSubmitStatus(null), 5000);
      }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-neutral-900/50 border-neutral-700 focus:border-apple-blue"
        />
      </div>

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-neutral-900/50 border-neutral-700 focus:border-apple-blue"
        />
      </div>

      <div>
        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="bg-neutral-900/50 border-neutral-700 focus:border-apple-blue"
        />
      </div>

      <div>
        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="bg-neutral-900/50 border-neutral-700 focus:border-apple-blue min-h-[120px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full bg-apple-blue hover:bg-apple-blue/90 text-white">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </span>
        )}
      </Button>

      {submitStatus === "success" && (
        <div className="p-3 bg-green-900/20 border border-green-800 text-green-400 rounded-sm">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-sm">
          There was an error sending your message. Please try again.
        </div>
      )}
    </form>
  )
}

