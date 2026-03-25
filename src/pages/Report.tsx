import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download, GitCompare } from 'lucide-react'
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
import { analysisApi } from '@/services/analysisApi'
import { exportReportPdf } from '@/services/pdfExport'
import type { ReportData } from '@/types/analysis'

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [_activeTab, setActiveTab] = useState('overview')
  const gate = useFeatureGate()

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    analysisApi.getReport(sessionId)
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load report'))
      .finally(() => setLoading(false))
  }, [sessionId])

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
        <div className="glass-card p-8 text-center">
          <p className="text-accent-red font-display font-semibold mb-2">Error Loading Report</p>
          <p className="text-sm text-text-secondary">{error ?? 'Report not found'}</p>
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

        {/* Tabs */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
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
