"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ExportPDFButtonProps {
  targetRef: React.RefObject<HTMLElement>
}

export function ExportPDFButton({ targetRef }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!targetRef.current) return
    
    setIsExporting(true)
    try {
      const canvas = await html2canvas(targetRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 960, // Fixed width for consistency
      })
      
      // A4 dimensions in mm
      const pdfWidth = 210
      const pdfHeight = 297
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // Calculate scaling to fit content to A4
      const imgWidth = pdfWidth - 20 // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Center the content
      const x = 10 // Left margin
      const y = 10 // Top margin
      
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        x,
        y,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      )
      
      pdf.save('resume.pdf')
    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting..." : "Export PDF"}
    </Button>
  )
}
