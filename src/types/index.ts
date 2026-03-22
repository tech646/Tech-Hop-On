export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  city: string | null
  country: string | null
  school: string | null
  current_grade: string | null
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

export type Lesson = {
  id: string
  title: string
  description: string | null
  section: 'critical_reading' | 'grammar' | 'vocabulary' | 'math'
  order_index: number
  video_url: string | null
  duration_minutes: number
  thumbnail_url: string | null
  created_at: string
}

export type UserLessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  watched_seconds: number
}

export type SATResult = {
  id: string
  user_id: string
  score: number
  total_questions: number
  correct_answers: number
  practice_type: string
  created_at: string
}

export type AIChatSession = {
  id: string
  user_id: string
  assistant_id: 'brighta' | 'gritty' | 'smartle' | 'wan'
  messages: Array<{ role: string; content: string; timestamp: string }>
  created_at: string
  updated_at: string
}

export type MathAppointment = {
  id: string
  user_id: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  teacher_name: string | null
  notes: string | null
  created_at: string
}

export type UserCollege = {
  id: string
  user_id: string
  name: string
  category: 'dream' | 'target' | 'safety'
  created_at: string
}
