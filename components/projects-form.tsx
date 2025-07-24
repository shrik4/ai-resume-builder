"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Sparkles } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  technologies: string
  link: string
  github: string
}

interface ProjectsFormProps {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
      github: "",
    }
    onChange([...data, newProject])
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = data.map((project) => (project.id === id ? { ...project, [field]: value } : project))
    onChange(updated)
  }

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id))
  }

  const generateDescription = async (project: Project) => {
    if (!project.name) {
      alert("Please enter project name first")
      return
    }

    setGeneratingFor(project.id)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a professional project description for a student's resume. Project name: ${project.name}. Technologies used: ${project.technologies || "web technologies"}. Create a 2-3 sentence description that highlights the project's purpose, key features, and technical achievements. Focus on what the student learned and accomplished.`,
        }),
      })
      const result = await response.json()
      if (result.text) {
        updateProject(project.id, "description", result.text)
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
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={addProject} size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Button onClick={addProject} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {data.map((project, index) => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Project #{index + 1}</CardTitle>
            <Button
              onClick={() => removeProject(project.id)}
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="E-commerce Website"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                  placeholder="React, Node.js, MongoDB, Express"
                />
              </div>
              <div>
                <Label>Live Demo Link</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateProject(project.id, "link", e.target.value)}
                  placeholder="https://myproject.com"
                />
              </div>
              <div>
                <Label>GitHub Repository</Label>
                <Input
                  value={project.github}
                  onChange={(e) => updateProject(project.id, "github", e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Project Description</Label>
                  <Button
                    onClick={() => generateDescription(project)}
                    disabled={generatingFor === project.id}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    {generatingFor === project.id ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe what the project does, key features, and what you learned..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
