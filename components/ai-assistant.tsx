"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"
import type { ResumeData } from "@/app/page"

interface AIAssistantProps {
  resumeData: ResumeData
  currentSection: string
}

export function AIAssistant({ resumeData, currentSection }: AIAssistantProps) {
  const [feedback, setFeedback] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [customResponse, setCustomResponse] = useState("")
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false)

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    try {
      const resumeText = JSON.stringify(resumeData, null, 2)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze this student resume and provide specific, actionable feedback. Focus on:\n1. Content quality and relevance for students\n2. Missing sections or information\n3. Formatting and structure suggestions\n4. Ways to make it more appealing to employers\n5. Industry-specific recommendations\n\nResume data: ${resumeText}\n\nProvide constructive feedback in a friendly, encouraging tone suitable for students.`
        })
      })
      const result = await response.json()
      setFeedback(result.text)
    } catch (error) {
      console.error("Error analyzing resume:", error)
      setFeedback("Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) return

    setIsGeneratingCustom(true)
    try {
      const resumeText = JSON.stringify(resumeData, null, 2)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a career counselor helping a student with their resume. Here's their current resume data: ${resumeText}\n\nStudent's question/request: ${customPrompt}\n\nProvide helpful, specific advice tailored to their situation.`
        })
      })
      const result = await response.json()
      setCustomResponse(result.text)
    } catch (error) {
      console.error("Error generating custom response:", error)
      setCustomResponse("Failed to generate response. Please try again.")
    } finally {
      setIsGeneratingCustom(false)
    }
  }

  const getCompletionStatus = () => {
    const sections = [
      { name: "Personal Info", complete: resumeData.personalInfo.fullName && resumeData.personalInfo.email },
      { name: "Education", complete: resumeData.education.length > 0 },
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"
      { name: "Projects", complete: resumeData.projects.length > 0 },
    ]

    const completed = sections.filter((s) => s.complete).length
    const total = sections.length

    return { sections, completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const status = getCompletionStatus()

  const tips = {
    experience: [
      "Mention academic honors or achievements",
      "Include internships, part-time jobs, and volunteer work",
    ],
    skills: [
      "Separate technical and soft skills",
      "Include programming languages and tools",
      "Add any certifications you have",
    ],
    projects: [
      "Showcase 2-4 of your best projects",
      "Include links to live demos and GitHub",
      "Explain the impact and technologies used",
    ],
  }

  return (
    <div className="space-y-6">
      {/* Section Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips for {currentSection}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {tips[currentSection as keyof typeof tips]?.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Resume Analysis
          </CardTitle>
          <CardDescription>Get personalized feedback on your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={analyzeResume} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? "Analyzing..." : "Analyze My Resume"}
          </Button>

          {feedback && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <div className="whitespace-pre-wrap">{feedback}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom AI Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask AI Assistant
          </CardTitle>
          <CardDescription>Get specific help with your resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask me anything about your resume... e.g., 'How can I make my experience section stronger?' or 'What skills should I add for software engineering roles?'"
            rows={3}
          />
          <Button onClick={handleCustomPrompt} disabled={isGeneratingCustom || !customPrompt.trim()} className="w-full">
            {isGeneratingCustom ? "Thinking..." : "Ask AI"}
          </Button>

          {customResponse && (
            <div className="p-3 bg-green-50 rounded-lg text-sm">
              <div className="whitespace-pre-wrap">{customResponse}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
              Student Template
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
              Tech Focus
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
              Internship Ready
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
