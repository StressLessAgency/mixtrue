import jsPDF from 'jspdf'
import type { ReportData, SeverityLevel } from '@/types/analysis'

// ─── Color palette ───────────────────────────────────────────────────────────
type RGB = [number, number, number]
const C = {
  bg:           [8, 12, 20] as RGB,
  panel:        [14, 20, 35] as RGB,
  panelLight:   [20, 28, 48] as RGB,
  border:       [30, 42, 68] as RGB,
  cyan:         [0, 229, 255] as RGB,
  purple:       [124, 58, 237] as RGB,
  green:        [0, 255, 157] as RGB,
  amber:        [255, 184, 0] as RGB,
  red:          [255, 59, 92] as RGB,
  textPrimary:  [235, 240, 255] as RGB,
  textSecondary:[150, 162, 190] as RGB,
  textMuted:    [75, 85, 110] as RGB,
}

function scoreColor(score: number): RGB {
  if (score >= 80) return C.green
  if (score >= 60) return C.cyan
  if (score >= 40) return C.amber
  return C.red
}

function severityColor(severity: SeverityLevel): RGB {
  if (severity === 'critical') return C.red
  if (severity === 'warning') return C.amber
  return C.cyan
}

// ─── PDF State ────────────────────────────────────────────────────────────────
interface PdfState {
  doc: jsPDF
  y: number
  pageW: number
  pageH: number
  margin: number
  contentW: number
}

function newPage(s: PdfState) {
  s.doc.addPage()
  s.y = s.margin
  fillBg(s)
}

function fillBg(s: PdfState) {
  s.doc.setFillColor(...C.bg)
  s.doc.rect(0, 0, s.pageW, s.pageH, 'F')
}

function checkPage(s: PdfState, needed = 20) {
  if (s.y + needed > s.pageH - s.margin) {
    newPage(s)
  }
}

// ─── Drawing Primitives ───────────────────────────────────────────────────────
function drawPanel(s: PdfState, x: number, y: number, w: number, h: number, color: RGB = C.panel) {
  s.doc.setFillColor(...color)
  s.doc.roundedRect(x, y, w, h, 2, 2, 'F')
  s.doc.setDrawColor(...C.border)
  s.doc.setLineWidth(0.3)
  s.doc.roundedRect(x, y, w, h, 2, 2, 'S')
}

function drawScoreBar(s: PdfState, x: number, y: number, w: number, score: number, label: string, value: string) {
  const barH = 5
  const trackW = w - 60

  // Label
  s.doc.setFontSize(7.5)
  s.doc.setTextColor(...C.textSecondary)
  s.doc.text(label, x, y + 4)

  // Track
  s.doc.setFillColor(...C.panelLight)
  s.doc.roundedRect(x + 60, y, trackW, barH, 1.5, 1.5, 'F')

  // Fill
  const fillW = Math.max((score / 100) * trackW, 2)
  const col = scoreColor(score)
  s.doc.setFillColor(...col)
  s.doc.roundedRect(x + 60, y, fillW, barH, 1.5, 1.5, 'F')

  // Value
  s.doc.setFontSize(7.5)
  s.doc.setTextColor(...scoreColor(score))
  s.doc.text(value, x + w - 1, y + 4, { align: 'right' })
}

function drawScoreCard(s: PdfState, x: number, y: number, w: number, h: number, score: number, label: string) {
  const col = scoreColor(score)
  drawPanel(s, x, y, w, h)

  // Score number
  s.doc.setFontSize(22)
  s.doc.setTextColor(...col)
  s.doc.setFont('helvetica', 'bold')
  s.doc.text(`${score}`, x + w / 2, y + h / 2 + 2, { align: 'center' })

  // Label
  s.doc.setFontSize(6.5)
  s.doc.setTextColor(...C.textMuted)
  s.doc.setFont('helvetica', 'normal')
  s.doc.text(label.toUpperCase(), x + w / 2, y + h - 4, { align: 'center' })
}

function drawSectionHeader(s: PdfState, title: string) {
  checkPage(s, 16)
  // Accent bar
  s.doc.setFillColor(...C.cyan)
  s.doc.rect(s.margin, s.y, 2.5, 8, 'F')
  // Title
  s.doc.setFontSize(10)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...C.textPrimary)
  s.doc.text(title.toUpperCase(), s.margin + 6, s.y + 6)
  s.y += 14
}

function drawDivider(s: PdfState) {
  s.doc.setDrawColor(...C.border)
  s.doc.setLineWidth(0.3)
  s.doc.line(s.margin, s.y, s.pageW - s.margin, s.y)
  s.y += 6
}

function drawSeverityBadge(s: PdfState, x: number, y: number, severity: SeverityLevel) {
  const col = severityColor(severity)
  const label = severity.toUpperCase()
  const bw = 18, bh = 5
  s.doc.setFillColor(col[0], col[1], col[2], 0.15)
  s.doc.setFillColor(...col)
  // Draw thin pill background with opacity simulation
  s.doc.setFillColor(Math.min(col[0] + 180, 255), Math.min(col[1] + 170, 255), Math.min(col[2] + 170, 255))
  // Simpler: just use the border
  s.doc.setDrawColor(...col)
  s.doc.setLineWidth(0.4)
  s.doc.roundedRect(x, y - 3.5, bw, bh, 1.2, 1.2, 'S')
  s.doc.setFontSize(5.5)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...col)
  s.doc.text(label, x + bw / 2, y + 0.2, { align: 'center' })
}

function drawFooter(s: PdfState, pageNum: number, totalPages: number) {
  const footerY = s.pageH - 8
  s.doc.setDrawColor(...C.border)
  s.doc.setLineWidth(0.3)
  s.doc.line(s.margin, footerY - 3, s.pageW - s.margin, footerY - 3)
  s.doc.setFontSize(6.5)
  s.doc.setFont('helvetica', 'normal')
  s.doc.setTextColor(...C.textMuted)
  s.doc.text('mixtrue — Professional Audio Analysis', s.margin, footerY)
  s.doc.text(`Page ${pageNum} of ${totalPages}`, s.pageW - s.margin, footerY, { align: 'right' })
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function exportReportPdf(report: ReportData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const s: PdfState = {
    doc,
    y: 0,
    pageW: doc.internal.pageSize.getWidth(),
    pageH: doc.internal.pageSize.getHeight(),
    margin: 14,
    contentW: doc.internal.pageSize.getWidth() - 28,
  }

  // ── PAGE 1: Header + Scores + Summary ──────────────────────────────────────
  fillBg(s)
  s.y = 0

  // Top header bar
  s.doc.setFillColor(...C.panel)
  s.doc.rect(0, 0, s.pageW, 38, 'F')
  s.doc.setFillColor(...C.cyan)
  s.doc.rect(0, 0, s.pageW, 1.5, 'F')

  // Brand
  s.doc.setFontSize(18)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...C.cyan)
  s.doc.text('mixtrue', s.margin, 13)

  // Tag
  s.doc.setFontSize(7)
  s.doc.setFont('helvetica', 'normal')
  s.doc.setTextColor(...C.textMuted)
  s.doc.text('ANALYSIS REPORT', s.margin, 19)

  // Track name (right-aligned)
  s.doc.setFontSize(11)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...C.textPrimary)
  const trackName = report.trackName.length > 40 ? report.trackName.substring(0, 37) + '...' : report.trackName
  s.doc.text(trackName, s.pageW - s.margin, 12, { align: 'right' })

  // Meta row
  s.doc.setFontSize(7.5)
  s.doc.setFont('helvetica', 'normal')
  s.doc.setTextColor(...C.textSecondary)
  const meta = `${report.genreMode.toUpperCase()} · ${report.analysisMode.toUpperCase()} · ${report.fileFormat} · ${report.fileSizeMb}MB · ${new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
  s.doc.text(meta, s.pageW - s.margin, 19, { align: 'right' })

  s.y = 46

  // ── Score cards ────────────────────────────────────────────────────────────
  const cardGap = 4
  const cardW = (s.contentW - cardGap * 3) / 4
  const cardH = 28

  // Overall score (bigger)
  const overallW = cardW * 1.6 + cardGap
  drawPanel(s, s.margin, s.y, overallW, cardH + 8)

  const overallCol = scoreColor(report.overallScore)
  s.doc.setFontSize(32)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...overallCol)
  s.doc.text(`${report.overallScore}`, s.margin + overallW / 2, s.y + 20, { align: 'center' })

  s.doc.setFontSize(6.5)
  s.doc.setFont('helvetica', 'normal')
  s.doc.setTextColor(...C.textMuted)
  s.doc.text('OVERALL SCORE', s.margin + overallW / 2, s.y + 28, { align: 'center' })

  // Score bar under overall
  s.doc.setFillColor(...C.panelLight)
  s.doc.rect(s.margin + 6, s.y + cardH + 1, overallW - 12, 2.5, 'F')
  const fillPct = (report.overallScore / 100) * (overallW - 12)
  s.doc.setFillColor(...overallCol)
  s.doc.rect(s.margin + 6, s.y + cardH + 1, fillPct, 2.5, 'F')

  // Sub-scores
  const subX = s.margin + overallW + cardGap
  const subW = (s.contentW - overallW - cardGap) / 3 - cardGap / 2
  const subLabels = ['MIXDOWN', 'CLUB', 'MASTER']
  const subScores = [report.mixdownScore, report.clubScore, report.masterScore]
  subScores.forEach((score, i) => {
    const x = subX + i * (subW + cardGap)
    drawScoreCard(s, x, s.y, subW, cardH + 8, score, subLabels[i])
  })

  s.y += cardH + 8 + 10

  // ── Executive Summary ──────────────────────────────────────────────────────
  if (report.executiveSummary) {
    drawPanel(s, s.margin, s.y, s.contentW, 26, C.panelLight)
    s.doc.setFontSize(7)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(...C.cyan)
    s.doc.text('EXECUTIVE SUMMARY', s.margin + 5, s.y + 7)
    s.doc.setFontSize(8.5)
    s.doc.setFont('helvetica', 'normal')
    s.doc.setTextColor(...C.textSecondary)
    const summaryLines = s.doc.splitTextToSize(report.executiveSummary, s.contentW - 10) as string[]
    s.doc.text(summaryLines.slice(0, 2), s.margin + 5, s.y + 14)
    s.y += 34
  }

  // ── Key Metrics Row ────────────────────────────────────────────────────────
  const metricW = (s.contentW - cardGap * 2) / 3
  const metrics = [
    { label: 'INTEGRATED LUFS', value: `${report.master.integratedLufs.toFixed(1)} LUFS`, color: C.cyan },
    { label: 'TRUE PEAK', value: `${report.master.truePeak.toFixed(1)} dBTP`, color: C.amber },
    { label: 'DYNAMIC RANGE', value: `${report.dynamics.metrics.drScore.toFixed(1)} DR`, color: C.green },
  ]
  metrics.forEach((m, i) => {
    const x = s.margin + i * (metricW + cardGap)
    drawPanel(s, x, s.y, metricW, 18)
    s.doc.setFontSize(6)
    s.doc.setFont('helvetica', 'normal')
    s.doc.setTextColor(...C.textMuted)
    s.doc.text(m.label, x + 5, s.y + 6)
    s.doc.setFontSize(11)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(...m.color)
    s.doc.text(m.value, x + 5, s.y + 14)
  })
  s.y += 26

  // BPM / Key if available
  const bpm = report.clubReadiness?.bpmDetection
  if (bpm) {
    const bpmMetrics = [
      { label: 'BPM', value: `${bpm.bpm}`, color: C.purple },
      { label: 'KEY', value: bpm.key, color: C.textSecondary },
      { label: 'CAMELOT', value: bpm.camelotPosition, color: C.textSecondary },
    ]
    bpmMetrics.forEach((m, i) => {
      const x = s.margin + i * (metricW + cardGap)
      drawPanel(s, x, s.y, metricW, 18)
      s.doc.setFontSize(6)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.textMuted)
      s.doc.text(m.label, x + 5, s.y + 6)
      s.doc.setFontSize(11)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...m.color)
      s.doc.text(m.value, x + 5, s.y + 14)
    })
    s.y += 26
  }

  // ── PAGE 2: Category Scores + Priority Issues ──────────────────────────────
  newPage(s)

  drawSectionHeader(s, 'Category Breakdown')

  report.categoryScores.forEach((cat, i) => {
    checkPage(s, 12)
    const rowY = s.y
    if (i % 2 === 0) {
      s.doc.setFillColor(...C.panelLight)
      s.doc.rect(s.margin, rowY - 1, s.contentW, 9, 'F')
    }
    drawScoreBar(s, s.margin + 3, rowY + 1, s.contentW - 6, cat.score, cat.category, `${cat.score}/100`)
    s.doc.setFontSize(6.5)
    s.doc.setTextColor(...C.textMuted)
    const verdictX = s.margin + 3 + 60 + ((s.contentW - 6 - 60 - 12) * (cat.score / 100)) + 15
    s.doc.text(cat.verdict, Math.min(verdictX, s.margin + s.contentW - 40), rowY + 5)
    s.y += 10
  })

  s.y += 6
  drawDivider(s)

  drawSectionHeader(s, 'Priority Issues')

  report.priorityIssues.forEach((issue) => {
    checkPage(s, 28)
    const issueH = 26
    const col = severityColor(issue.severity)

    // Card background
    drawPanel(s, s.margin, s.y, s.contentW, issueH)

    // Left severity stripe
    s.doc.setFillColor(...col)
    s.doc.roundedRect(s.margin, s.y, 2.5, issueH, 1, 1, 'F')

    // Severity badge
    drawSeverityBadge(s, s.margin + 7, s.y + 7, issue.severity)

    // Title
    s.doc.setFontSize(8.5)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(...C.textPrimary)
    s.doc.text(issue.title, s.margin + 30, s.y + 7)

    // Tab badge
    s.doc.setFontSize(6)
    s.doc.setFont('helvetica', 'normal')
    s.doc.setTextColor(...C.textMuted)
    s.doc.text(issue.tab.toUpperCase(), s.pageW - s.margin - 2, s.y + 7, { align: 'right' })

    // Description
    s.doc.setFontSize(7.5)
    s.doc.setFont('helvetica', 'normal')
    s.doc.setTextColor(...C.textSecondary)
    const descLines = s.doc.splitTextToSize(issue.description, s.contentW - 18) as string[]
    s.doc.text(descLines.slice(0, 2), s.margin + 7, s.y + 15)

    s.y += issueH + 4
  })

  // ── PAGE 3: Fix Plan ───────────────────────────────────────────────────────
  newPage(s)
  drawSectionHeader(s, 'Fix Plan')

  report.aiFixes.fixes.forEach((fix, idx) => {
    const estimatedH = 35 + fix.fix.length * 7
    checkPage(s, Math.min(estimatedH, 60))

    const col = severityColor(fix.priority)

    // Card
    drawPanel(s, s.margin, s.y, s.contentW, 12)
    s.doc.setFillColor(...col)
    s.doc.roundedRect(s.margin, s.y, 2.5, 12, 1, 1, 'F')

    // Number bubble
    s.doc.setFillColor(...col)
    s.doc.circle(s.margin + 10, s.y + 6, 4, 'F')
    s.doc.setFontSize(7)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(8, 12, 20)
    s.doc.text(`${idx + 1}`, s.margin + 10, s.y + 7.5, { align: 'center' })

    // Priority + Category
    s.doc.setFontSize(6.5)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(...col)
    s.doc.text(`${fix.priority.toUpperCase()} · ${fix.category.toUpperCase()}`, s.margin + 18, s.y + 5)

    // Title
    s.doc.setFontSize(9)
    s.doc.setFont('helvetica', 'bold')
    s.doc.setTextColor(...C.textPrimary)
    s.doc.text(fix.title, s.margin + 18, s.y + 10.5)
    s.y += 16

    // Problem
    s.doc.setFontSize(8)
    s.doc.setFont('helvetica', 'italic')
    s.doc.setTextColor(...C.textSecondary)
    const probLines = s.doc.splitTextToSize(fix.problem, s.contentW - 6) as string[]
    s.doc.text(probLines.slice(0, 2), s.margin + 3, s.y)
    s.y += probLines.slice(0, 2).length * 4 + 4

    // Steps
    fix.fix.forEach((step, j) => {
      checkPage(s, 8)
      s.doc.setFillColor(...C.panelLight)
      s.doc.roundedRect(s.margin + 3, s.y - 1, s.contentW - 6, 6.5, 1, 1, 'F')

      // Step number
      s.doc.setFontSize(6.5)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...col)
      s.doc.text(`${j + 1}`, s.margin + 7, s.y + 3.5)

      s.doc.setFontSize(7.5)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.textSecondary)
      const stepLines = s.doc.splitTextToSize(step, s.contentW - 22) as string[]
      s.doc.text(stepLines[0], s.margin + 12, s.y + 3.5)
      s.y += 8
    })

    // Plugins
    if (fix.pluginSuggestions?.length) {
      checkPage(s, 8)
      s.doc.setFontSize(6.5)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...C.textMuted)
      s.doc.text('PLUGINS: ', s.margin + 3, s.y + 3)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.cyan)
      s.doc.text(fix.pluginSuggestions.join(' · '), s.margin + 18, s.y + 3)
      s.y += 7
    }

    // Estimated improvement
    if (fix.estimatedImprovement) {
      checkPage(s, 7)
      s.doc.setFontSize(6.5)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...C.green)
      s.doc.text(`ESTIMATED IMPROVEMENT: ${fix.estimatedImprovement}`, s.margin + 3, s.y + 3)
      s.y += 7
    }

    s.y += 6
  })

  // ── Reference Tracks (if present) ─────────────────────────────────────────
  if (report.referenceTrackSuggestions?.length) {
    checkPage(s, 20)
    if (s.y > s.pageH * 0.6) newPage(s)
    drawSectionHeader(s, 'Reference Tracks')

    report.referenceTrackSuggestions.forEach((ref) => {
      checkPage(s, 22)
      drawPanel(s, s.margin, s.y, s.contentW, 20)

      s.doc.setFontSize(8.5)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...C.textPrimary)
      s.doc.text(`${ref.artist} — ${ref.track}`, s.margin + 5, s.y + 8)

      s.doc.setFontSize(6.5)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.cyan)
      s.doc.text(ref.relevantMetric, s.pageW - s.margin - 2, s.y + 8, { align: 'right' })

      s.doc.setFontSize(7.5)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.textSecondary)
      const reasonLines = s.doc.splitTextToSize(ref.reason, s.contentW - 10) as string[]
      s.doc.text(reasonLines[0], s.margin + 5, s.y + 16)
      s.y += 24
    })
  }

  // ── Platform Targets ───────────────────────────────────────────────────────
  if (report.master.platformTargets?.length) {
    checkPage(s, 20)
    if (s.y > s.pageH * 0.7) newPage(s)
    drawSectionHeader(s, 'Platform Loudness Targets')

    const colW = (s.contentW - cardGap * 3) / 4
    report.master.platformTargets.slice(0, 4).forEach((pt, i) => {
      const x = s.margin + i * (colW + cardGap)
      const statusColor = pt.status === 'pass' ? C.green : pt.status === 'warning' ? C.amber : C.red
      drawPanel(s, x, s.y, colW, 22)
      s.doc.setFontSize(7)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...C.textSecondary)
      s.doc.text(pt.platform, x + colW / 2, s.y + 7, { align: 'center' })
      s.doc.setFontSize(9)
      s.doc.setFont('helvetica', 'bold')
      s.doc.setTextColor(...statusColor)
      s.doc.text(`${pt.userValue.toFixed(1)}`, x + colW / 2, s.y + 15, { align: 'center' })
      s.doc.setFontSize(5.5)
      s.doc.setFont('helvetica', 'normal')
      s.doc.setTextColor(...C.textMuted)
      s.doc.text(`target: ${pt.target}`, x + colW / 2, s.y + 20, { align: 'center' })
    })
    s.y += 30
  }

  // ── Deletion Receipt ───────────────────────────────────────────────────────
  checkPage(s, 36)
  if (s.y > s.pageH - 60) newPage(s)

  s.y += 6
  drawPanel(s, s.margin, s.y, s.contentW, 34, C.panelLight)
  s.doc.setFillColor(...C.green)
  s.doc.rect(s.margin, s.y, 2.5, 34, 'F')

  s.doc.setFontSize(7)
  s.doc.setFont('helvetica', 'bold')
  s.doc.setTextColor(...C.green)
  s.doc.text('SECURE DELETION RECEIPT', s.margin + 7, s.y + 8)

  s.doc.setFontSize(7)
  s.doc.setFont('helvetica', 'normal')
  s.doc.setTextColor(...C.textSecondary)
  const receiptLines = [
    `File: ${report.deletionReceipt.fileName}`,
    `Deleted: ${new Date(report.deletionReceipt.deletedAt).toLocaleString()}`,
    `Receipt ID: ${report.deletionReceipt.receiptId}`,
    `Session ID: ${report.deletionReceipt.sessionId}`,
    `Storage: ${report.deletionReceipt.storage}  ·  Data Usage: ${report.deletionReceipt.aiTraining}`,
  ]
  receiptLines.forEach((line, i) => {
    s.doc.text(line, s.margin + 7, s.y + 14 + i * 4.5)
  })
  s.y += 40

  // ── Add footers to all pages ───────────────────────────────────────────────
  const totalPages: number = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawFooter(s, p, totalPages)
  }

  doc.save(`mixtrue-report-${report.sessionId.substring(0, 8)}.pdf`)
}
