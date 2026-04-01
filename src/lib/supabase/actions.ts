'use server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

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
  const videoSeconds = (hoursResult.data ?? []).reduce((acc, r) => acc + (r.watched_seconds ?? 0), 0)
  const userAiMessages = (aiResult.data ?? []).reduce((acc, r) => {
    const msgs = (r.messages as Array<{ role: string }>) ?? []
    return acc + msgs.filter(m => m.role === 'user').length
  }, 0)
  const aiSeconds = userAiMessages * 2 * 60 // 2 min per user message
  const studyHours = Math.round((videoSeconds + aiSeconds) / 3600)
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  // Only cancel if the appointment belongs to the authenticated user
  return supabase.from('math_appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
    .eq('user_id', user.id)
}

// Save diagnostic answers
export async function saveDiagnosticResult(userId: string, answers: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from('diagnostic_results_v2').upsert({ user_id: userId, answers, completed_at: new Date().toISOString() }, { onConflict: 'user_id' })
}

// Gestor: get all students' performance data
export async function getGestorStudentsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email?.endsWith('@hopon.academy')) return { students: [], stats: { total: 0, avgSAT: 0, avgLessons: 0, avgAI: 0 } }

  // Get all non-admin, non-teacher profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, country, city, sat_target_score, avatar_url, role')
    .not('email', 'ilike', '%@hopon.academy')
    .neq('role', 'teacher')

  if (!profiles || profiles.length === 0) return { students: [], stats: { total: 0, avgSAT: 0, avgLessons: 0, avgAI: 0 } }

  const userIds = profiles.map(p => p.id)

  // Fetch all needed data in parallel
  const [mathData, lessonsData, aiData, satData, collegesData, anelisaData, rankingData] = await Promise.all([
    supabase
      .from('math_appointments')
      .select('user_id')
      .in('user_id', userIds)
      .eq('status', 'confirmed'),
    supabase
      .from('user_lesson_progress')
      .select('user_id')
      .in('user_id', userIds)
      .eq('completed', true),
    supabase
      .from('ai_chat_sessions')
      .select('user_id, messages')
      .in('user_id', userIds),
    supabase
      .from('sat_practice_results')
      .select('user_id, score, created_at')
      .in('user_id', userIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_colleges')
      .select('user_id, name')
      .in('user_id', userIds),
    supabase
      .from('anelisa_appointments')
      .select('user_id')
      .in('user_id', userIds)
      .neq('status', 'cancelled'),
    supabase.rpc('get_ranking', { current_user_id: user.id }),
  ])

  const rankMap: Record<string, number> = {}
  ;((rankingData.data ?? []) as Array<{ user_id: string; rank_pos: number }>)
    .forEach(r => { rankMap[r.user_id] = r.rank_pos })

  const students = profiles.map(p => {
    const mathCount = (mathData.data ?? []).filter(r => r.user_id === p.id).length
    const lessonsCount = (lessonsData.data ?? []).filter(r => r.user_id === p.id).length
    const anelisaCount = (anelisaData.data ?? []).filter(r => r.user_id === p.id).length
    const aiMsgs = (aiData.data ?? [])
      .filter(r => r.user_id === p.id)
      .reduce((acc: number, r) => acc + ((r.messages as unknown[])?.length ?? 0), 0)

    const userSAT = (satData.data ?? []).filter(r => r.user_id === p.id)
    const latestSAT = userSAT[0]?.score ?? null
    const prevSAT = userSAT[1]?.score ?? null
    const trend = latestSAT && prevSAT
      ? latestSAT >= prevSAT ? 'up' : 'down'
      : 'neutral'

    const colleges = (collegesData.data ?? [])
      .filter(r => r.user_id === p.id)
      .map(r => r.name)
      .slice(0, 3)

    return {
      id: p.id,
      name: p.full_name || p.email?.split('@')[0] || 'Aluno',
      country: p.country || 'Brazil',
      city: p.city || '',
      avatarUrl: p.avatar_url || null,
      mathClasses: mathCount,
      lessons: lessonsCount,
      anelisaClasses: anelisaCount,
      aiUsage: aiMsgs,
      satScore: latestSAT,
      satTarget: p.sat_target_score || 1300,
      trend,
      colleges,
      rankPosition: rankMap[p.id] ?? null,
    }
  })

  const total = students.length
  const avgSAT = students.filter(s => s.satScore).length > 0
    ? Math.round(students.filter(s => s.satScore).reduce((a, s) => a + (s.satScore ?? 0), 0) / students.filter(s => s.satScore).length)
    : 0
  const avgLessons = total > 0 ? Math.round(students.reduce((a, s) => a + s.lessons, 0) / total) : 0
  const avgAI = total > 0 ? Math.round(students.reduce((a, s) => a + s.aiUsage, 0) / total) : 0

  return { students, stats: { total, avgSAT, avgLessons, avgAI } }
}

// Admin: set user role (student ↔ teacher)
export async function setUserRole(userId: string, role: 'student' | 'teacher') {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email?.endsWith('@hopon.academy')) throw new Error('Unauthorized')
  const admin = createAdminClient()
  await admin.from('profiles').update({ role }).eq('id', userId)
}

// Admin: get all teachers with math class count
export async function getTeachersData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email?.endsWith('@hopon.academy')) return { teachers: [] }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, country, city, avatar_url, cal_com_link')
    .not('email', 'ilike', '%@hopon.academy')
    .eq('role', 'teacher')

  if (!profiles || profiles.length === 0) return { teachers: [] }

  const userIds = profiles.map(p => p.id)
  const { data: mathData } = await supabase
    .from('math_appointments')
    .select('user_id')
    .in('user_id', userIds)
    .eq('status', 'confirmed')

  const teachers = profiles.map(p => ({
    id: p.id,
    name: p.full_name || p.email?.split('@')[0] || 'Teacher',
    email: p.email || '',
    country: p.country || '',
    city: p.city || '',
    avatarUrl: p.avatar_url || null,
    calComLink: p.cal_com_link || null,
    mathClasses: (mathData ?? []).filter(r => r.user_id === p.id).length,
  }))

  return { teachers }
}

// Admin: save teacher's Cal.com link
export async function setTeacherCalLink(teacherId: string, calComLink: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email?.endsWith('@hopon.academy')) throw new Error('Unauthorized')
  const admin = createAdminClient()
  await admin.from('profiles').update({ cal_com_link: calComLink || null }).eq('id', teacherId)
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
