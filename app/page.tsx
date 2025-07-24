"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PersonalInfoForm } from "@/components/personal-info-form"
import { EducationForm } from "@/components/education-form"
import { ExperienceForm } from "@/components/experience-form"
import { SkillsForm } from "@/components/skills-form"
import { ProjectsForm } from "@/components/projects-form"
import { ResumePreview } from "@/components/resume-preview"
import { AIAssistant } from "@/components/ai-assistant"
import { FileText, Sparkles, Download, Eye } from "lucide-react"

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn: string
    github: string
    portfolio: string
    summary: string
  }
  education: Array<{
    id: string
    institution: string
    degree: string
    major: string
    gpa: string
    graduationDate: string
    relevantCourses: string
  }>
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    tools: string[]
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
    github: string
  }>
}

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal")
  const [showPreview, setShowPreview] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      tools: [],
    },
    projects: [],
  })

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: FileText },
    { id: "education", label: "Education", icon: FileText },
    { id: "experience", label: "Experience", icon: FileText },
    { id: "skills", label: "Skills", icon: FileText },
    { id: "projects", label: "Projects", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Resume Builder</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create a professional resume tailored for students with AI-powered suggestions and optimization
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant={showPreview ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Edit Resume" : "Preview Resume"}
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {showPreview ? (
              <ResumePreview data={resumeData} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Build Your Resume</CardTitle>
                  <CardDescription>Fill out each section to create your professional resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                      {tabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="personal" className="mt-6">
                      <PersonalInfoForm
                        data={resumeData.personalInfo}
                        onChange={(data) => updateResumeData("personalInfo", data)}
                      />
                    </TabsContent>

                    <TabsContent value="education" className="mt-6">
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) => updateResumeData("education", data)}
                      />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-6">
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) => updateResumeData("experience", data)}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-6">
                      <SkillsForm data={resumeData.skills} onChange={(data) => updateResumeData("skills", data)} />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-6">
                      <ProjectsForm
                        data={resumeData.projects}
                        onChange={(data) => updateResumeData("projects", data)}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <AIAssistant resumeData={resumeData} currentSection={activeTab} />
          </div>
        </div>
      </div>
    </div>
  )
}
