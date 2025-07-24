"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface Education {
  id: string
  institution: string
  degree: string
  major: string
  gpa: string
  graduationDate: string
  relevantCourses: string
}

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      major: "",
      gpa: "",
      graduationDate: "",
      relevantCourses: "",
    }
    onChange([...data, newEducation])
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    onChange(updated)
  }

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No education entries yet</p>
            <Button onClick={addEducation} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Education Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {data.map((education, index) => (
        <Card key={education.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Education #{index + 1}</CardTitle>
            <Button
              onClick={() => removeEducation(education.id)}
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
                <Label>Institution *</Label>
                <Input
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                  placeholder="University of Example"
                />
              </div>
              <div>
                <Label>Degree *</Label>
                <Input
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <Label>Major/Field of Study</Label>
                <Input
                  value={education.major}
                  onChange={(e) => updateEducation(education.id, "major", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa}
                  onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Graduation Date</Label>
                <Input
                  value={education.graduationDate}
                  onChange={(e) => updateEducation(education.id, "graduationDate", e.target.value)}
                  placeholder="May 2024"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Relevant Coursework</Label>
                <Textarea
                  value={education.relevantCourses}
                  onChange={(e) => updateEducation(education.id, "relevantCourses", e.target.value)}
                  placeholder="Data Structures, Algorithms, Web Development, Database Systems..."
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
