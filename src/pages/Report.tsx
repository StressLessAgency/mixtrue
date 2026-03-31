import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download, GitCompare, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/layout/PageTransition'
import LoadingScreen from '@/components/LoadingScreen'
import OverallScoreGauge from '@/components/report/OverallScoreGauge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// Skeleton import removed — branded LoadingScreen replaces it
import PaywallOverlay from '@/components/report/PaywallOverlay'
import OverviewTab from '@/components/report/tabs/OverviewTab'
import FrequencyTab from '@/components/report/tabs/FrequencyTab'
import DynamicsTab from '@/components/report/tabs/DynamicsTab'
import StereoFieldTab from '@/components/report/tabs/StereoFieldTab'
import ClubReadinessTab from '@/components/report/tabs/ClubReadinessTab'
import MasterTab from '@/components/report/tabs/MasterTab'
import AIFixesTab from '@/components/report/tabs/AIFixesTab'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { useSessionStore } from '@/stores/useSessionStore'
import { analysisApi } from '@/services/analysisApi'
import { exportReportPdf } from '@/services/pdfExport'
import type { ReportData } from '@/types/analysis'

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const storedReport = useSessionStore((s) => s.report)
  const isRealUpload = useSessionStore((s) => s.isRealUpload)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [_activeTab, setActiveTab] = useState('overview')
  const gate = useFeatureGate()

  // 1. Reactively use stored report from Gemini (works even if it arrives late)
  useEffect(() => {
    console.log('[mixtrue] Report effect:', { hasReport: !!report, hasStoredReport: !!storedReport, storedTrack: storedReport?.trackName })
    if (report) return
    if (storedReport) {
      console.log('[mixtrue] Displaying report:', storedReport.trackName)
      setReport(storedReport)
      setLoading(false)
      setError(null)
    }
  }, [storedReport, report])

  // 2. On mount, try Supabase for saved reports (history visits), then fall back
  useEffect(() => {
    if (!sessionId) return
    if (storedReport) return // Store already has it, effect above handles it

    // Try Supabase first
    analysisApi.getSavedReport(sessionId).then((saved) => {
      if (saved) {
        console.log('[mixtrue] Loaded saved report from Supabase')
        setReport(saved)
        setLoading(false)
        return
      }

      // No saved report - if this is a real upload, keep waiting (Gemini still running)
      // If demo, load mock data
      if (!isRealUpload) {
        analysisApi.getReport(sessionId).then((mock) => {
          setReport(mock)
          setLoading(false)
        })
      }
      // For real uploads, the reactive useEffect above will catch the Gemini result
    }).catch(() => {
      if (!isRealUpload) {
        analysisApi.getReport(sessionId).then(setReport).finally(() => setLoading(false))
      }
    })
  }, [sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Timeout for real uploads - if Gemini hasn't returned after 90s, show error
  useEffect(() => {
    if (!isRealUpload || report) return
    const timeout = setTimeout(() => {
      if (!report) {
        setError('Analysis is taking longer than expected. Please refresh the page to check again.')
        setLoading(false)
      }
    }, 90_000)
    return () => clearTimeout(timeout)
  }, [isRealUpload, report])

  if (loading) {
    return <LoadingScreen message="Analyzing your track..." />
  }

  if (error || !report) {
    return (
      <PageTransition>
        <div className="glass-card p-8 text-center space-y-4">
          <p className="text-accent-red font-display font-semibold mb-2">Error Loading Report</p>
          <p className="text-sm text-text-secondary">{error ?? 'Report not found'}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleExportPdf = async () => await exportReportPdf(report)

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header - DAW style */}
        <div className="daw-panel p-3 sm:p-5 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
            {/* Score gauges row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <OverallScoreGauge score={report.overallScore} size={130} strokeWidth={8} label="Overall" />
              <div className="flex flex-row sm:flex-col gap-3">
                <OverallScoreGauge score={report.mixdownScore} size={64} strokeWidth={4} label="Mix" />
                <OverallScoreGauge score={report.clubScore} size={64} strokeWidth={4} label="Club" />
                <OverallScoreGauge score={report.masterScore} size={64} strokeWidth={4} label="Master" />
              </div>
            </div>

            {/* Track info + actions */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl text-text-primary mb-2 truncate">{report.trackName}</h1>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Badge variant="cyan">{report.fileFormat}</Badge>
                <Badge variant="purple" className="capitalize">{report.genreMode}</Badge>
                <Badge variant="default" className="capitalize">{report.analysisMode}</Badge>
                <Badge variant="default">{report.fileSizeMb} MB</Badge>
              </div>

              {/* Inline metrics bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                <div className="daw-panel px-2 sm:px-3 py-2 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">LUFS</span>
                  <p className="text-xs sm:text-sm font-mono text-accent-cyan truncate">{report.master.integratedLufs.toFixed(1)}</p>
                </div>
                <div className="daw-panel px-2 sm:px-3 py-2 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">Peak</span>
                  <p className="text-xs sm:text-sm font-mono text-accent-amber truncate">{report.master.truePeak.toFixed(1)} dBTP</p>
                </div>
                <div className="daw-panel px-2 sm:px-3 py-2 overflow-hidden">
                  <span className="text-[9px] sm:text-[10px] font-mono text-text-muted uppercase tracking-wider">DR</span>
                  <p className="text-xs sm:text-sm font-mono text-accent-green truncate">{report.dynamics.metrics.drScore.toFixed(1)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleExportPdf}>
                  <Download className="w-3 h-3" />
                  Export PDF
                </Button>
                <Link to="/app/history">
                  <Button variant="outline" size="sm">
                    <GitCompare className="w-3 h-3" />
                    Compare
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="frequency">Frequency</TabsTrigger>
              <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
              <TabsTrigger value="stereo">Stereo Field</TabsTrigger>
              <TabsTrigger value="club">Club Readiness</TabsTrigger>
              <TabsTrigger value="master">Master</TabsTrigger>
              <TabsTrigger value="fixes">Fix Plan</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab report={report} onNavigateTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="frequency">
            <FrequencyTab data={report.frequency} />
          </TabsContent>

          <TabsContent value="dynamics">
            <DynamicsTab data={report.dynamics} />
          </TabsContent>

          <TabsContent value="stereo">
            <StereoFieldTab data={report.stereoField} />
          </TabsContent>

          <TabsContent value="club">
            {gate.canAccessClub ? (
              <ClubReadinessTab data={report.clubReadiness} />
            ) : (
              <PaywallOverlay feature="Club Readiness" />
            )}
          </TabsContent>

          <TabsContent value="master">
            {gate.canAccessMaster ? (
              <MasterTab data={report.master} />
            ) : (
              <PaywallOverlay feature="Master Analysis" />
            )}
          </TabsContent>

          <TabsContent value="fixes">
            {gate.canAccessAiFixes ? (
              <AIFixesTab data={report.aiFixes} onExportPdf={handleExportPdf} />
            ) : (
              <PaywallOverlay feature="Fix Plan" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
