"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Download } from "lucide-react"
import type { ResumeData } from "@/app/page"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ResumePreviewProps {
  data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { personalInfo, education, experience, skills, projects } = data

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return
    
    setIsDownloading(true)
    try {
      // Get element dimensions
      const element = resumeRef.current;
      const elementHeight = element.scrollHeight;
      const elementWidth = element.scrollWidth;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        height: elementHeight,
        width: elementWidth,
        windowHeight: elementHeight,
        windowWidth: elementWidth
      });

      // A4 measurements in points (72 points per inch)
      const pageWidth = 595.28;
      const pageHeight = 841.89;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait'
      });

      // If content spans multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);

      while (heightLeft >= pageHeight) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        page++;
      }

      pdf.save(`${data.personalInfo.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </div>
      <Card
        ref={resumeRef}
        className="resume-container mx-auto bg-white"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '15mm',
          margin: '0 auto'
        }}
      >
        <CardContent className="space-y-6 [&>*]:page-break-inside-avoid">
          {/* Header */}
          <div className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {personalInfo.location}
                </div>
              )}
              {personalInfo.linkedIn && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  {personalInfo.linkedIn}
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  {personalInfo.github}
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {personalInfo.portfolio}
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.institution}
                        </h3>
                        <p className="text-gray-700">
                          {edu.degree} {edu.major && `in ${edu.major}`}
                          {edu.gpa && ` • GPA: ${edu.gpa}`}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {edu.graduationDate}
                      </span>
                    </div>
                    {edu.relevantCourses && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Relevant Coursework:</strong> {edu.relevantCourses}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-gray-700">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <div className="flex gap-2 text-sm">
                        {project.link && (
                          <a
                            href={project.link}
                            className="text-blue-600 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            className="text-blue-600 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    {project.technologies && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Technologies:</strong> {project.technologies}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(skills.technical.length > 0 ||
            skills.soft.length > 0 ||
            skills.languages.length > 0 ||
            skills.tools.length > 0) && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.technical.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Technical Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {skills.soft.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Soft Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.soft.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {skills.tools.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Tools & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.tools.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {skills.languages.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.languages.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}