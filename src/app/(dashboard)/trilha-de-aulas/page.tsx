import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, RotateCcw, Play } from 'lucide-react'

const sectionMeta = {
  critical_reading: { label: 'Critical Reading', icon: '📚' },
  grammar:          { label: 'Grammar',          icon: '✏️' },
  vocabulary:       { label: 'Vocabulary',        icon: '📖' },
} as const

type Section = keyof typeof sectionMeta
const sectionOrder: Section[] = ['critical_reading', 'grammar', 'vocabulary']

export default async function TrilhaDeAulasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, title, section, order_index, duration_minutes')
      .in('section', ['critical_reading', 'grammar', 'vocabulary'])
      .order('order_index'),
    supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id),
  ])

  const completedIds = new Set(
    (progress ?? []).filter(p => p.completed).map(p => p.lesson_id)
  )

  const sections = sectionOrder.map(section => {
    const sectionLessons = (lessons ?? [])
      .filter(l => l.section === section)
      .sort((a, b) => a.order_index - b.order_index)

    let foundCurrent = false
    const withStatus = sectionLessons.map((lesson, idx) => {
      if (completedIds.has(lesson.id)) return { ...lesson, status: 'done' as const }
      const prevDone = idx === 0 || completedIds.has(sectionLessons[idx - 1].id)
      if (prevDone && !foundCurrent) {
        foundCurrent = true
        return { ...lesson, status: 'current' as const }
      }
      return { ...lesson, status: 'locked' as const }
    })

    const done = withStatus.filter(l => l.status === 'done').length
    return { section, meta: sectionMeta[section], lessons: withStatus, done }
  })

  const totalDone = sections.reduce((a, s) => a + s.done, 0)
  const totalLessons = sections.reduce((a, s) => a + s.lessons.length, 0)
  const progressPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-[#0057b8]/10 flex items-center justify-center">
          <span className="text-lg">📚</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1b2232]">Lessons</h1>
          <p className="text-sm text-[#65758b]">Watch our video lessons</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#e1e7ef] mb-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <p className="font-bold text-[#1b2232] mb-1">Your Learning Track</p>
          <p className="text-sm text-[#65758b] mb-3">{totalDone} of {totalLessons} lessons completed</p>
          <div className="w-full h-2.5 bg-[#f3f5f7] rounded-full">
            <div
              className="h-full bg-[#1b2232] rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <span className="text-2xl font-bold text-[#1b2232]">{progressPct}%</span>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {sections.map(({ section, meta, lessons: sectionLessons, done }) => (
          <div key={section} className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1e7ef]">
              <div className="w-8 h-8 rounded-lg bg-[#f3f5f7] flex items-center justify-center text-lg">
                {meta.icon}
              </div>
              <div>
                <p className="font-bold text-[#1b2232]">{meta.label}</p>
                <p className="text-xs text-[#65758b]">{done}/{sectionLessons.length} lessons</p>
              </div>
            </div>

            <div className="divide-y divide-[#f3f5f7]">
              {sectionLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 ${lesson.status === 'locked' ? 'opacity-50' : ''}`}
                >
                  <div className="shrink-0">
                    {lesson.status === 'done' ? (
                      <div className="w-8 h-8 rounded-full border-2 border-[#65758b] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#65758b]" />
                      </div>
                    ) : lesson.status === 'current' ? (
                      <div className="w-8 h-8 rounded-full border-2 border-[#0057b8] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#0057b8]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#f3f5f7] flex items-center justify-center">
                        <Lock size={14} className="text-[#65758b]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1b2232] truncate">{lesson.title}</p>
                    <p className="text-xs text-[#65758b]">⏱ {lesson.duration_minutes} min</p>
                  </div>

                  {lesson.status === 'done' && (
                    <Link
                      href={`/video-aula/${lesson.id}`}
                      className="flex items-center gap-1.5 text-[#65758b] text-sm hover:text-[#1b2232] shrink-0"
                    >
                      <RotateCcw size={14} /> Review
                    </Link>
                  )}
                  {lesson.status === 'current' && (
                    <Link
                      href={`/video-aula/${lesson.id}`}
                      className="flex items-center gap-1.5 bg-[#0057b8] text-white text-sm px-4 py-1.5 rounded-xl font-medium hover:bg-[#0046a0] transition-colors shrink-0"
                    >
                      <Play size={14} /> Watch
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
