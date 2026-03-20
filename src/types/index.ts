export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  bio: string | null
  plan: 'free' | 'monthly' | 'semester' | 'annual'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  type: 'aula' | 'math' | 'video' | 'trilha'
  duration_minutes: number
  thumbnail_url: string | null
  order: number
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  course_id: string
  completed: boolean
  progress_percent: number
  last_accessed_at: string
}

export interface Appointment {
  id: string
  user_id: string
  assistant_id: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  created_at: string
}

export interface DiagnosticResult {
  id: string
  user_id: string
  step: number
  answers: Record<string, unknown>
  score: number | null
  completed_at: string
}

export interface AIAssistant {
  id: string
  name: string
  description: string
  avatar_url: string
  specialty: string
  color: string
}

export interface Plan {
  id: string
  name: string
  price_monthly: number
  price_semester: number
  price_annual: number
  features: string[]
  is_popular: boolean
}
