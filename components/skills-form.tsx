"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Sparkles } from "lucide-react"

interface Skills {
  technical: string[]
  soft: string[]
  languages: string[]
  tools: string[]
}

interface SkillsFormProps {
  data: Skills
  onChange: (data: Skills) => void
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
    tools: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const addSkill = (category: keyof Skills, skill: string) => {
    if (skill.trim() && !data[category].includes(skill.trim())) {
      onChange({
        ...data,
        [category]: [...data[category], skill.trim()],
      })
      setNewSkill({ ...newSkill, [category]: "" })
    }
  }

  const removeSkill = (category: keyof Skills, skillToRemove: string) => {
    onChange({
      ...data,
      [category]: data[category].filter((skill) => skill !== skillToRemove),
    })
  }

  const generateSkillSuggestions = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate skill suggestions for a computer science student's resume. Provide 4 categories:
          1. Technical Skills (programming languages, frameworks, databases)
          2. Soft Skills (communication, teamwork, problem-solving, etc.)
          3. Languages (spoken languages)
          4. Tools (development tools, software, platforms)
          
          Format as JSON with arrays for each category. Focus on skills relevant for entry-level positions.`,
        }),
      })
      const result = await response.json()
      try {
        // Remove JSON.parse since result.text is already parsed
        const suggestions = result.text
        // Add suggestions to existing skills without duplicates
        Object.keys(suggestions).forEach((category) => {
          if (data[category as keyof Skills]) {
            const existingSkills = data[category as keyof Skills]
            const newSkills = suggestions[category].filter((skill: string) => !existingSkills.includes(skill))
            if (newSkills.length > 0) {
              onChange({
                ...data,
                [category]: [...existingSkills, ...newSkills.slice(0, 5)],
              })
            }
          }
        })
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        alert("Generated suggestions in unexpected format. Please try again.")
      }
    } catch (error) {
      console.error("Error generating skills:", error)
      alert("Failed to generate skill suggestions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const skillCategories = [
    { key: "technical" as keyof Skills, label: "Technical Skills", placeholder: "JavaScript, Python, React..." },
    { key: "soft" as keyof Skills, label: "Soft Skills", placeholder: "Communication, Leadership, Problem-solving..." },
    { key: "languages" as keyof Skills, label: "Languages", placeholder: "English, Spanish, French..." },
    { key: "tools" as keyof Skills, label: "Tools & Technologies", placeholder: "Git, Docker, AWS..." },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button
          onClick={generateSkillSuggestions}
          disabled={isGenerating}
          size="sm"
          variant="outline"
          className="flex items-center gap-1 bg-transparent"
        >
          <Sparkles className="h-3 w-3" />
          {isGenerating ? "Generating..." : "AI Suggest Skills"}
        </Button>
      </div>

      {skillCategories.map(({ key, label, placeholder }) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle className="text-base">{label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSkill[key]}
                onChange={(e) => setNewSkill({ ...newSkill, [key]: e.target.value })}
                placeholder={placeholder}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill(key, newSkill[key])
                  }
                }}
              />
              <Button onClick={() => addSkill(key, newSkill[key])} size="sm" disabled={!newSkill[key].trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {data[key].map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(key, skill)} className="ml-1 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {data[key].length === 0 && <p className="text-sm text-gray-500">No {label.toLowerCase()} added yet</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
