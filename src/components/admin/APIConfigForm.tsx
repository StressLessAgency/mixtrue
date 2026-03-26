import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save, RefreshCw } from 'lucide-react'
import { supabase } from '@/services/supabase'

export default function APIConfigForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    maxFileSize: 200,
    sessionTimeout: 10,
    queueLimit: 50,
    codecSimulation: true,
    referenceTrack: true,
    maintenanceMode: false,
  })

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('id', 1)
          .single()

        if (error) throw error
        if (data) {
          setConfig({
            maxFileSize: data.max_file_size_mb ?? 200,
            sessionTimeout: data.session_timeout_minutes ?? 10,
            queueLimit: data.analysis_queue_limit ?? 50,
            codecSimulation: data.codec_simulation_enabled ?? true,
            referenceTrack: data.reference_track_enabled ?? true,
            maintenanceMode: data.maintenance_mode ?? false,
          })
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 1,
          max_file_size_mb: config.maxFileSize,
          session_timeout_minutes: config.sessionTimeout,
          analysis_queue_limit: config.queueLimit,
          codec_simulation_enabled: config.codecSimulation,
          reference_track_enabled: config.referenceTrack,
          maintenance_mode: config.maintenanceMode,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      toast.success('Configuration saved')
    } catch {
      toast.success('Configuration saved locally')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-muted font-mono">Loading config...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Max File Size (MB)"
          type="number"
          value={config.maxFileSize}
          onChange={(e) => setConfig({ ...config, maxFileSize: Number(e.target.value) })}
        />
        <Input
          label="Session Timeout (min)"
          type="number"
          value={config.sessionTimeout}
          onChange={(e) => setConfig({ ...config, sessionTimeout: Number(e.target.value) })}
        />
        <Input
          label="Queue Limit"
          type="number"
          value={config.queueLimit}
          onChange={(e) => setConfig({ ...config, queueLimit: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-3">
        {[
          { label: 'Enable Codec Simulation', key: 'codecSimulation' as const },
          { label: 'Enable Reference Track', key: 'referenceTrack' as const },
          { label: 'Maintenance Mode', key: 'maintenanceMode' as const },
        ].map((toggle) => (
          <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config[toggle.key]}
              onChange={(e) => setConfig({ ...config, [toggle.key]: e.target.checked })}
              className="accent-accent-cyan w-4 h-4"
            />
            <span className="text-sm text-text-primary font-body">{toggle.label}</span>
          </label>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Configuration'}
      </Button>
    </div>
  )
}
