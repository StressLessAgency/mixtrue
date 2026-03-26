import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export default function APIConfigForm() {
  const [config, setConfig] = useState({
    geminiApiKey: '••••••••••••••••',
    geminiModel: 'gemini-2.5-flash',
    maxFileSize: 200,
    sessionTimeout: 10,
    queueLimit: 50,
    codecSimulation: true,
    referenceTrack: true,
    maintenanceMode: false,
  })

  const handleSave = () => {
    toast.success('Configuration saved successfully')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Input
        label="Gemini API Key (masked)"
        type="password"
        value={config.geminiApiKey}
        onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
      />
      <Input
        label="Gemini Model"
        value={config.geminiModel}
        onChange={(e) => setConfig({ ...config, geminiModel: e.target.value })}
      />
      <div className="grid grid-cols-3 gap-4">
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

      <Button onClick={handleSave}>
        <Save className="w-4 h-4" />
        Save Configuration
      </Button>
    </div>
  )
}
