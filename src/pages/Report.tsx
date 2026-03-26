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
import type { ReportData } from '@/types/analysis'

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const storedReport = useSessionStore((s) => s.report)
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [_activeTab, setActiveTab] = useState('overview')
  const gate = useFeatureGate()

  const fetchReport = useCallback((signal?: AbortSignal) => {
    if (!sessionId) return

    // Use stored report from Gemini analysis if available and matching
    if (storedReport && storedReport.sessionId === sessionId) {
      setReport(storedReport)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const reportPromise = analysisApi.getReport(sessionId)

    const abortPromise = signal
      ? new Promise<never>((_, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        })
      : null

    const request = abortPromise ? Promise.race([reportPromise, abortPromise]) : reportPromise

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
      <div className="space-y-6">
        {/* Header - DAW style */}
        <div className="daw-panel p-5">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Score gauges row */}
            <div className="flex items-center gap-5">
              <OverallScoreGauge score={report.overallScore} size={130} strokeWidth={8} label="Overall" />
              <div className="flex flex-col gap-3">
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
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="daw-panel px-3 py-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">LUFS</span>
                  <p className="text-sm font-mono text-accent-cyan">{report.master.integratedLufs.toFixed(1)}</p>
                </div>
                <div className="daw-panel px-3 py-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">True Peak</span>
                  <p className="text-sm font-mono text-accent-amber">{report.master.truePeak.toFixed(1)} dBTP</p>
                </div>
                <div className="daw-panel px-3 py-2">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">DR</span>
                  <p className="text-sm font-mono text-accent-green">{report.dynamics.metrics.drScore.toFixed(1)}</p>
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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
            <TabsTrigger value="stereo">Stereo Field</TabsTrigger>
            <TabsTrigger value="club">Club Readiness</TabsTrigger>
            <TabsTrigger value="master">Master</TabsTrigger>
            <TabsTrigger value="fixes">Fix Plan</TabsTrigger>
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
              <PaywallOverlay feature="Fix Plan" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
