'use server'
import { createClient } from '@/lib/supabase/server'

// Get home page stats for a user
export async function getUserStats(userId: string) {
  const supabase = await createClient()

  const [lessonsResult, hoursResult, satResult, aiResult] = await Promise.all([
    // completed lessons count
    supabase
      .from('user_lesson_progress')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('completed', true),
    // total watched seconds → convert to hours
    supabase
      .from('user_lesson_progress')
      .select('watched_seconds')
      .eq('user_id', userId),
    // latest SAT score
    supabase
      .from('sat_practice_results')
      .select('score')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // AI messages count
    supabase
      .from('ai_chat_sessions')
      .select('messages')
      .eq('user_id', userId),
  ])

  const completedLessons = lessonsResult.count ?? 0
  const totalSeconds = (hoursResult.data ?? []).reduce((acc, r) => acc + (r.watched_seconds ?? 0), 0)
  const studyHours = Math.round(totalSeconds / 3600)
  const latestSAT = satResult.data?.score ?? null
  const aiMessages = (aiResult.data ?? []).reduce((acc, r) => acc + ((r.messages as unknown[])?.length ?? 0), 0)

  return { completedLessons, studyHours, latestSAT, aiMessages }
}

// Get lessons with user progress
export async function getLessonsWithProgress(_userId: string) {
  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, user_lesson_progress(completed, watched_seconds)')
    .order('order_index')
  return lessons ?? []
}

// Save lesson progress
export async function saveLessonProgress(userId: string, lessonId: string, watchedSeconds: number, completed: boolean) {
  const supabase = await createClient()
  return supabase.from('user_lesson_progress').upsert({
    user_id: userId,
    lesson_id: lessonId,
    watched_seconds: watchedSeconds,
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  }, { onConflict: 'user_id,lesson_id' })
}

// Save SAT practice result
export async function saveSATResult(userId: string, score: number, totalQuestions: number, correctAnswers: number) {
  const supabase = await createClient()
  return supabase.from('sat_practice_results').insert({
    user_id: userId,
    score,
    total_questions: totalQuestions,
    correct_answers: correctAnswers,
  })
}

// Get SAT history
export async function getSATHistory(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sat_practice_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  return data ?? []
}

// Save/get AI chat session
export async function getOrCreateChatSession(userId: string, assistantId: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('ai_chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('assistant_id', assistantId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (existing) return existing
  const { data } = await supabase
    .from('ai_chat_sessions')
    .insert({ user_id: userId, assistant_id: assistantId, messages: [] })
    .select()
    .single()
  return data
}

export async function appendMessageToSession(sessionId: string, message: { role: string; content: string; timestamp: string }) {
  const supabase = await createClient()
  const { data: session } = await supabase
    .from('ai_chat_sessions')
    .select('messages')
    .eq('id', sessionId)
    .single()
  const messages = [...((session?.messages as unknown[]) ?? []), message]
  return supabase
    .from('ai_chat_sessions')
    .update({ messages, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
}

// Get user profile with colleges
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const [profile, colleges, satHistory] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('user_colleges').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('sat_practice_results').select('score, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
  ])
  return {
    profile: profile.data,
    colleges: colleges.data ?? [],
    satHistory: satHistory.data ?? [],
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from('profiles').upsert({ id: userId, ...data, updated_at: new Date().toISOString() })
}

// Math appointments
export async function getUserAppointments(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('math_appointments')
    .select('*')
    .eq('user_id', userId)
    .order('scheduled_at', { ascending: true })
  return data ?? []
}

export async function createAppointment(userId: string, scheduledAt: string, teacherName: string, notes?: string) {
  const supabase = await createClient()
  return supabase.from('math_appointments').insert({
    user_id: userId,
    scheduled_at: scheduledAt,
    teacher_name: teacherName,
    notes,
  })
}

export async function cancelAppointment(appointmentId: string) {
  const supabase = await createClient()
  return supabase.from('math_appointments').update({ status: 'cancelled' }).eq('id', appointmentId)
}

// Save diagnostic answers
export async function saveDiagnosticResult(userId: string, answers: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from('diagnostic_results_v2').upsert({ user_id: userId, answers, completed_at: new Date().toISOString() }, { onConflict: 'user_id' })
}

// Admin: get all stats
export async function getAdminStats() {
  const supabase = await createClient()
  const [users, appointments, satResults, aiSessions] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('math_appointments').select('id', { count: 'exact' }),
    supabase.from('sat_practice_results').select('score'),
    supabase.from('ai_chat_sessions').select('id', { count: 'exact' }),
  ])
  const avgSAT = satResults.data?.length
    ? Math.round(satResults.data.reduce((a, r) => a + r.score, 0) / satResults.data.length)
    : 0
  return {
    totalUsers: users.count ?? 0,
    totalAppointments: appointments.count ?? 0,
    avgSATScore: avgSAT,
    totalAISessions: aiSessions.count ?? 0,
  }
}
