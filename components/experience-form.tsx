"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Sparkles } from "lucide-react"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange([...data, newExperience])
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    const updated = data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    onChange(updated)
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
  }

  const generateDescription = async (experience: Experience) => {
    if (!experience.position || !experience.company) {
      alert("Please enter position and company first")
      return
    }

    setGeneratingFor(experience.id)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a professional job description for a student's resume. Position: ${experience.position} at ${experience.company}. Create 2-3 bullet points that highlight responsibilities, achievements, and skills gained. Focus on action verbs and quantifiable results where possible. Make it suitable for a student/entry-level position.`
        })
      })
      const result = await response.json()
      if (result.text) {
        updateExperience(experience.id, "description", result.text)
      } else {
        throw new Error(result.error || "Unknown error")
      }
    } catch (error) {
      console.error("Error generating description:", error)
      alert("Failed to generate description. Please try again.")
    } finally {
      setGeneratingFor(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No work experience yet</p>
            <Button onClick={addExperience} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Work Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {data.map((experience, index) => (
        <Card key={experience.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
            <Button
              onClick={() => removeExperience(experience.id)}
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company *</Label>
                <Input
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label>Position *</Label>
                <Input
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                  placeholder="Software Engineering Intern"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                  placeholder="June 2023"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                  placeholder="August 2023"
                  disabled={experience.current}
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) => updateExperience(experience.id, "current", checked as boolean)}
                  />
                  <Label htmlFor={`current-${experience.id}`}>I currently work here</Label>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Job Description</Label>
                  <Button
                    onClick={() => generateDescription(experience)}
                    disabled={generatingFor === experience.id}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {generatingFor === experience.id ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                  placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software solutions&#10;• Improved application performance by 25% through code optimization"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
