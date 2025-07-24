"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

interface PersonalInfoFormProps {
  data: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn: string
    github: string
    portfolio: string
    summary: string
  }
  onChange: (data: any) => void
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const generateSummary = async () => {
    if (!data.fullName) {
      alert("Please enter your name first")
      return
    }

    setIsGeneratingSummary(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a professional summary for a student resume. The student's name is ${data.fullName}. Create a 2-3 sentence summary that highlights their potential, eagerness to learn, and readiness to contribute to a professional environment. Make it engaging and suitable for entry-level positions.`
        })
      })
      const result = await response.json()
      if (result.text) {
        handleInputChange("summary", result.text)
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
      alert("Failed to generate summary. Please try again.")
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={data.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john.doe@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div>
            <Label htmlFor="linkedIn">LinkedIn Profile</Label>
            <Input
              id="linkedIn"
              value={data.linkedIn}
              onChange={(e) => handleInputChange("linkedIn", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              value={data.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="github.com/johndoe"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="portfolio">Portfolio Website</Label>
            <Input
              id="portfolio"
              value={data.portfolio}
              onChange={(e) => handleInputChange("portfolio", e.target.value)}
              placeholder="www.johndoe.com"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            onClick={generateSummary}
            disabled={isGeneratingSummary}
            size="sm"
            variant="outline"
            className="flex items-center gap-1 bg-transparent"
          >
            <Sparkles className="h-3 w-3" />
            {isGeneratingSummary ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleInputChange("summary", e.target.value)}
          placeholder="A brief professional summary highlighting your strengths and career objectives..."
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-1">2-3 sentences highlighting your key strengths and career goals</p>
      </div>
    </div>
  )
}
