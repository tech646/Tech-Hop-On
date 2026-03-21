import Link from 'next/link'
import { ArrowLeft, Lock, RotateCcw, Play } from 'lucide-react'

const courses = [
  {
    subject: 'Critical Reading',
    progress: '2/10 aulas',
    icon: '📚',
    lessons: [
      { id: '1', title: 'Intro', duration: '12:30', status: 'done' },
      { id: '2', title: 'How to preview a text', duration: '15:45', status: 'done' },
      { id: '3', title: 'Skim and Scan', duration: '18:20', status: 'current' },
      { id: '4', title: 'Annotate', duration: '14:10', status: 'locked' },
      { id: '5', title: 'Find the Outline', duration: '11:55', status: 'locked' },
    ]
  },
  {
    subject: 'Grammar',
    progress: '0/10 aulas',
    icon: '✏️',
    lessons: [
      { id: '6', title: 'Each and Every Agreement', duration: '13:40', status: 'locked' },
      { id: '7', title: 'Neighter and Eighter Agreement', duration: '16:15', status: 'locked' },
      { id: '8', title: 'Pronoun and Adjective Agreement: Number', duration: '14:20', status: 'locked' },
      { id: '9', title: 'Pronoun and Adjective Ambiguity', duration: '12:25', status: 'locked' },
    ]
  },
  {
    subject: 'Vocabulary',
    progress: '0/8 aulas',
    icon: '📖',
    lessons: [
      { id: '10', title: 'Intro', duration: '10:30', status: 'locked' },
      { id: '11', title: 'Strategies for Learning Vocabulary', duration: '13:20', status: 'locked' },
      { id: '12', title: 'Inferring Meaning of Unfamiliar Words', duration: '15:00', status: 'locked' },
      { id: '13', title: 'Idioms with Prepositions', duration: '11:45', status: 'locked' },
    ]
  },
]

export default function TrilhaDeAulasPage() {
  const totalDone = 2
  const totalLessons = 13

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-[#0057b8]/10 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1b2232]">Aulas</h1>
          <p className="text-sm text-[#65758b]">Assista nossas vídeo aulas</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#e1e7ef] mb-6 flex items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <p className="font-bold text-[#1b2232] mb-1">Sua Trilha de Aprendizado</p>
          <p className="text-sm text-[#65758b] mb-3">{totalDone} de {totalLessons} aulas concluídas</p>
          <div className="w-full h-2.5 bg-[#f3f5f7] rounded-full">
            <div className="h-full bg-[#1b2232] rounded-full" style={{ width: `${(totalDone / totalLessons) * 100}%` }} />
          </div>
        </div>
        <span className="text-2xl font-bold text-[#1b2232]">15%</span>
      </div>

      {/* Course sections */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.subject} className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e1e7ef]">
              <div className="w-8 h-8 rounded-lg bg-[#f3f5f7] flex items-center justify-center text-lg">📺</div>
              <div>
                <p className="font-bold text-[#1b2232]">{course.subject}</p>
                <p className="text-xs text-[#65758b]">{course.progress}</p>
              </div>
            </div>
            <div className="divide-y divide-[#f3f5f7]">
              {course.lessons.map((lesson) => (
                <div key={lesson.id} className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 ${lesson.status === 'locked' ? 'opacity-60' : ''}`}>
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
                    <p className="text-xs text-[#65758b] flex items-center gap-1">⏱ {lesson.duration}</p>
                  </div>
                  {lesson.status === 'done' && (
                    <Link href={`/video-aula/${lesson.id}`} className="flex items-center gap-1.5 text-[#65758b] text-sm hover:text-[#1b2232]">
                      <RotateCcw size={14} /> Rever
                    </Link>
                  )}
                  {lesson.status === 'current' && (
                    <Link href={`/video-aula/${lesson.id}`} className="flex items-center gap-1.5 bg-[#0057b8] text-white text-sm px-4 py-1.5 rounded-xl font-medium hover:bg-[#0046a0] transition-colors">
                      <Play size={14} /> Assistir
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
