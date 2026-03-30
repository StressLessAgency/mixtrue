import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Download, GitCompare, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageTransition from '@/components/layout/PageTransition'
import OverallScoreGauge from '@/components/report/OverallScoreGauge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { loadReportFromSession } from '@/services/historyService'
import type { ReportData } from '@/types/analysis'

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const storedReport = useSessionStore((s) => s.report)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // FIX: activeTab drives <Tabs value={...}> so that programmatic navigation works.
  // Previously _activeTab was a disconnected local state that never reached the Tabs component.
  const [activeTab, setActiveTab] = useState('overview')

  const gate = useFeatureGate()

  const fetchReport = useCallback((signal?: AbortSignal) => {
    if (!sessionId) return

    // Priority 1: In-memory store from just-completed analysis (fastest, no I/O)
    if (storedReport && storedReport.sessionId === sessionId) {
      setReport(storedReport)
      setLoading(false)
      return
    }

    // Priority 2: sessionStorage -- survives a page refresh within the same browser session
    const sessionReport = loadReportFromSession(sessionId)
    if (sessionReport) {
      setReport(sessionReport)
      setLoading(false)
      return
    }

    // Priority 3: API fallback (returns mock data when Supabase is not configured)
    setLoading(true)
    setError(null)

    const reportPromise = analysisApi.getReport(sessionId)

    const abortPromise = signal
      ? new Promise<never>((_, reject) => {
          signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          )
        })
      : null

    const request = abortPromise
      ? Promise.race([reportPromise, abortPromise])
      : reportPromise

    request
      .then(setReport)
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load report')
      })
      .finally(() => setLoading(false))
  }, [sessionId, storedReport])

  useEffect(() => {
    const controller = new AbortController()
    fetchReport(controller.signal)
    return () => controller.abort()
  }, [fetchReport])

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="flex gap-6">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (error || !report) {
    return (
      <PageTransition>
        <div className="glass-card p-8 text-center space-y-4">
          <p className="text-accent-red font-display font-semibold mb-2">Error Loading Report</p>
          <p className="text-sm text-text-secondary">{error ?? 'Report not found'}</p>
          <Button variant="outline" size="sm" onClick={() => fetchReport()}>
            <RefreshCw className="w-3 h-3" />
            Retry
          </Button>
        </div>
      </PageTransition>
    )
  }

  const handleExportPdf = () => exportReportPdf(report)

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <OverallScoreGauge score={report.overallScore} size={160} strokeWidth={10} label="Overall Score" />

          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl text-text-primary mb-2">{report.trackName}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="cyan">{report.fileFormat}</Badge>
              <Badge variant="purple" className="capitalize">{report.genreMode}</Badge>
              <Badge variant="default" className="capitalize">{report.analysisMode}</Badge>
              <Badge variant="default">{report.fileSizeMb} MB</Badge>
            </div>

            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <OverallScoreGauge score={report.mixdownScore} size={70} strokeWidth={5} />
                <p className="text-xs text-text-muted mt-1">Mixdown</p>
              </div>
              <div className="text-center">
                <OverallScoreGauge score={report.clubScore} size={70} strokeWidth={5} />
                <p className="text-xs text-text-muted mt-1">Club</p>
              </div>
              <div className="text-center">
                <OverallScoreGauge score={report.masterScore} size={70} strokeWidth={5} />
                <p className="text-xs text-text-muted mt-1">Master</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" size="sm" onClick={handleExportPdf}>
                <Download className="w-3 h-3" />
                Export PDF Report
              </Button>
              <Link to="/app/history">
                <Button variant="outline" size="sm">
                  <GitCompare className="w-3 h-3" />
                  Compare Versions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* FIX: Pass value={activeTab} so the Tabs component is in controlled mode.
            onValueChange keeps activeTab in sync when the user clicks tabs manually.
            onNavigateTab (from OverviewTab) calls setActiveTab, which updates activeTab,
            which flows into value={activeTab}, which the Tabs component now respects. */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
            <TabsTrigger value="stereo">Stereo Field</TabsTrigger>
            <TabsTrigger value="club">Club Readiness</TabsTrigger>
            <TabsTrigger value="master">Master</TabsTrigger>
            <TabsTrigger value="fixes">AI Fixes</TabsTrigger>
          </TabsList>

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
              <PaywallOverlay feature="AI Fix Plan" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
