import jsPDF from 'jspdf'
import type { ReportData } from '@/types/analysis'

export function exportReportPdf(report: ReportData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  function addTitle(text: string) {
    doc.setFontSize(18)
    doc.setTextColor(0, 229, 255)
    doc.text(text, 14, y)
    y += 10
  }

  function addSubtitle(text: string) {
    doc.setFontSize(12)
    doc.setTextColor(200, 200, 200)
    doc.text(text, 14, y)
    y += 8
  }

  function addText(text: string) {
    doc.setFontSize(10)
    doc.setTextColor(180, 180, 180)
    const lines = doc.splitTextToSize(text, pageWidth - 28)
    doc.text(lines, 14, y)
    y += lines.length * 5 + 3
  }

  function addSpacer(h = 8) { y += h }

  function checkPage() {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  }

  // Background
  doc.setFillColor(8, 12, 20)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F')

  // Header
  addTitle('mixtrue — Analysis Report')
  addSubtitle(`Track: ${report.trackName}`)
  addText(`Genre: ${report.genreMode} | Mode: ${report.analysisMode} | Format: ${report.fileFormat} | Size: ${report.fileSizeMb}MB`)
  addText(`Date: ${new Date(report.createdAt).toLocaleDateString()}`)
  addSpacer()

  // Overall Scores
  addSubtitle('Overall Scores')
  addText(`Overall: ${report.overallScore}/100 | Mixdown: ${report.mixdownScore}/100 | Club: ${report.clubScore}/100 | Master: ${report.masterScore}/100`)
  addSpacer()

  // Category Scores
  addSubtitle('Category Breakdown')
  report.categoryScores.forEach((cat) => {
    checkPage()
    addText(`${cat.category}: ${cat.score}/100 — ${cat.verdict}`)
  })
  addSpacer()

  // Priority Issues
  checkPage()
  addSubtitle('Priority Issues')
  report.priorityIssues.forEach((issue, i) => {
    checkPage()
    addText(`${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title}: ${issue.description}`)
  })
  addSpacer()

  // Fix Plan
  doc.addPage()
  y = 20
  doc.setFillColor(8, 12, 20)
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F')
  addTitle('Fix Plan')
  addSpacer()

  report.aiFixes.fixes.forEach((fix) => {
    checkPage()
    addSubtitle(`[${fix.priority.toUpperCase()}] ${fix.title}`)
    addText(fix.problem)
    fix.fix.forEach((step, j) => {
      checkPage()
      addText(`  ${j + 1}. ${step}`)
    })
    if (fix.pluginSuggestions.length) {
      addText(`Plugins: ${fix.pluginSuggestions.join(', ')}`)
    }
    addText(fix.estimatedImprovement)
    addSpacer()
  })

  // Deletion Receipt
  checkPage()
  addSpacer(10)
  addSubtitle('Secure Deletion Receipt')
  addText(`File: ${report.deletionReceipt.fileName}`)
  addText(`Deleted: ${new Date(report.deletionReceipt.deletedAt).toLocaleString()}`)
  addText(`Session ID: ${report.deletionReceipt.sessionId}`)
  addText(`Receipt ID: ${report.deletionReceipt.receiptId}`)
  addText(`Storage: ${report.deletionReceipt.storage}`)
  addText(`Data Usage: ${report.deletionReceipt.aiTraining}`)

  doc.save(`mixtrue-report-${report.sessionId.substring(0, 8)}.pdf`)
}
