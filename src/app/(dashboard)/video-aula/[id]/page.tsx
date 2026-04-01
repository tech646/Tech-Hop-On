import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'

const sectionMeta = {
  critical_reading: { label: 'Critical Reading', icon: '📚' },
  grammar:          { label: 'Grammar',          icon: '✏️' },
  vocabulary:       { label: 'Vocabulary',        icon: '📖' },
} as const

export default async function VideoAulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, section, order_index, duration_minutes, video_url')
    .eq('id', id)
    .single()

  if (!lesson) redirect('/trilha-de-aulas')

  const [{ data: sectionLessons }, { data: progress }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, order_index, duration_minutes, video_url')
      .eq('section', lesson.section)
      .order('order_index'),
    supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id),
  ])

  const completedIds = new Set(
    (progress ?? []).filter(p => p.completed).map(p => p.lesson_id)
  )
  const isCompleted = completedIds.has(id)
  const lessons = sectionLessons ?? []

  const playlist = lessons.map((l) => {
    if (completedIds.has(l.id)) return { ...l, status: 'done' as const }
    if (!l.video_url) return { ...l, status: 'coming_soon' as const }
    return { ...l, status: 'available' as const }
  })

  const meta = sectionMeta[lesson.section as keyof typeof sectionMeta]
  const doneInSection = playlist.filter(l => l.status === 'done').length

  async function markComplete() {
    'use server'
    const supa = await createClient()
    const { data: { user: u } } = await supa.auth.getUser()
    if (!u) return
    await supa.from('user_lesson_progress').upsert({
      user_id: u.id,
      lesson_id: id,
      completed: true,
      completed_at: new Date().toISOString(),
      watched_seconds: (lesson?.duration_minutes ?? 0) * 60,
    }, { onConflict: 'user_id,lesson_id' })
    // Award HopGems
    const { data: alreadyDone } = await supa.from('hop_gem_transactions')
      .select('id').eq('user_id', u.id).eq('type', 'lesson_complete').eq('description', `lesson_complete — ${id}`).limit(1)
    if (!alreadyDone || alreadyDone.length === 0) {
      await supa.from('hop_gem_transactions').insert({ user_id: u.id, amount: 20, type: 'lesson_complete', description: `lesson_complete — ${id}` })
      const { data: gems } = await supa.from('hop_gems').select('balance, total_earned').eq('user_id', u.id).single()
      if (gems) {
        await supa.from('hop_gems').update({ balance: (gems as {balance:number;total_earned:number}).balance + 20, total_earned: (gems as {balance:number;total_earned:number}).total_earned + 20, updated_at: new Date().toISOString() }).eq('user_id', u.id)
      } else {
        await supa.from('hop_gems').insert({ user_id: u.id, balance: 20, total_earned: 20 })
      }
    }
    redirect('/trilha-de-aulas')
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/trilha-de-aulas" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-sm font-medium text-[#1b2232]">Lessons</p>
          <p className="text-xs text-[#65758b]">Back to all lessons</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video player */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#f3f5f7] flex items-center justify-center text-sm">
              {meta?.icon ?? '📺'}
            </div>
            <div>
              <p className="font-bold text-[#1b2232]">{meta?.label}</p>
              <p className="text-xs text-[#65758b]">{lesson.title}</p>
            </div>
          </div>

          <div className="bg-[#f3f5f7] rounded-2xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden border border-[#e1e7ef]">
            {lesson.video_url ? (
              <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen />
            ) : (
              <div className="text-center text-[#65758b]">
                <div className="w-16 h-16 rounded-full border-2 border-[#1b2232]/20 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1b2232" opacity="0.3">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-sm">Video coming soon</p>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full mb-2 bg-[#0057b8]/10 text-[#0057b8]">
                {meta?.label}
              </div>
              <h2 className="text-xl font-bold text-[#1b2232] mb-1">{lesson.title}</h2>
              <p className="text-sm text-[#65758b] flex items-center gap-1">
                <Clock size={12} /> {lesson.duration_minutes} min
              </p>
            </div>

            {isCompleted ? (
              <div className="flex items-center gap-1.5 text-[#22c55e] text-sm font-medium shrink-0 mt-1">
                ✓ Completed
              </div>
            ) : (
              <form action={markComplete}>
                <button
                  type="submit"
                  className="bg-[#22c55e] hover:bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  ✓ Mark as complete
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="w-full lg:w-80 lg:shrink-0">
          <div className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="p-4 border-b border-[#e1e7ef]">
              <p className="font-bold text-[#1b2232]">{meta?.label}</p>
              <p className="text-xs text-[#65758b]">{doneInSection} of {playlist.filter(l => l.status !== 'coming_soon').length} lessons completed</p>
            </div>
            <div className="divide-y divide-[#f3f5f7]">
              {playlist.map((l) =>
                l.status === 'coming_soon' ? (
                  <div key={l.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-[#f3f5f7] flex items-center justify-center shrink-0 text-sm">
                      🔜
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#65758b] truncate">{l.title}</p>
                      <p className="text-xs text-[#65758b]">Coming soon</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={l.id}
                    href={`/video-aula/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f3f5f7] transition-colors ${l.id === id ? 'bg-[#f3f5f7]' : ''}`}
                  >
                    <div className="shrink-0">
                      {l.id === id ? (
                        <div className="w-7 h-7 rounded-full bg-[#0057b8] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full border-2 border-white" />
                        </div>
                      ) : l.status === 'done' ? (
                        <div className="w-7 h-7 rounded-full border-2 border-[#65758b] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#65758b]" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-[#0057b8] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0057b8]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1b2232] truncate">{l.title}</p>
                      <p className="text-xs text-[#65758b] flex items-center gap-1">
                        <Clock size={10} /> {l.duration_minutes} min
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
