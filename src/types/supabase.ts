export type PlanTier = 'free' | 'pro' | 'legendary'
export type CompType = 'none' | 'lifetime' | 'timed'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  plan: PlanTier
  comp_type?: CompType
  comp_expires_at?: string | null
  comp_granted_by?: string | null
  stripe_customer_id: string | null
  analyses_this_month: number
  created_at: string
}

export interface AnalysisSession {
  id: string
  user_id: string
  track_name: string
  file_format: string
  file_size_mb: number
  genre_mode: string
  analysis_mode: string
  overall_score: number | null
  mixdown_score: number | null
  club_score: number | null
  master_score: number | null
  report_data: Record<string, unknown> | null
  deletion_confirmed_at: string | null
  deletion_receipt_id: string | null
  created_at: string
}

export interface AdminSettings {
  id: number
  api_endpoint_url: string | null
  api_key_masked: string | null
  max_file_size_mb: number
  session_timeout_minutes: number
  analysis_queue_limit: number
  lufs_targets: Record<string, unknown> | null
  codec_simulation_enabled: boolean
  reference_track_enabled: boolean
  maintenance_mode: boolean
  updated_at: string
}

export interface StripeEvent {
  id: string
  event_id: string
  event_type: string
  payload: Record<string, unknown>
  processed_at: string
}
