import Link from 'next/link'
import { ArrowLeft, Clock, Lock } from 'lucide-react'
import { use } from 'react'

const playlist = [
  { id: '1', title: 'Intro', duration: '12:30', status: 'done' },
  { id: '2', title: 'How to preview a text', duration: '15:45', status: 'done' },
  { id: '3', title: 'Skim and Scan', duration: '18:20', status: 'current' },
  { id: '4', title: 'Annotate', duration: '14:10', status: 'locked' },
  { id: '5', title: 'Find the Outline', duration: '11:55', status: 'locked' },
]

export default function VideoAulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const current = playlist.find(l => l.id === id) || playlist[0]

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/trilha-de-aulas" className="text-[#65758b] hover:text-[#1b2232]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-sm text-[#65758b]">Aulas</p>
          <p className="text-xs text-[#65758b]">Volte para todas as vídeo aulas</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Video player */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#f3f5f7] flex items-center justify-center text-sm">📺</div>
            <div>
              <p className="font-bold text-[#1b2232]">Critical Reading</p>
              <p className="text-xs text-[#65758b]">{current.title}</p>
            </div>
          </div>

          {/* Video */}
          <div className="bg-[#f3f5f7] rounded-2xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden border border-[#e1e7ef]">
            <button className="w-16 h-16 rounded-full border-2 border-[#1b2232] flex items-center justify-center hover:bg-white/50 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1b2232">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>

          {/* Lesson info */}
          <div className="bg-[#0057b8]/10 text-[#0057b8] text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">Critical Reading</div>
          <h2 className="text-xl font-bold text-[#1b2232] mb-1">{current.title}</h2>
          <p className="text-sm text-[#65758b]">Resumo da aula</p>
        </div>

        {/* Playlist */}
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-[#e1e7ef] overflow-hidden">
            <div className="p-4 border-b border-[#e1e7ef]">
              <p className="font-bold text-[#1b2232]">Critical Reading</p>
              <p className="text-xs text-[#65758b]">2 de 13 aulas concluídas</p>
            </div>
            <div className="divide-y divide-[#f3f5f7]">
              {playlist.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/video-aula/${lesson.id}`}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f3f5f7] transition-colors ${lesson.status === 'locked' ? 'opacity-60 pointer-events-none' : ''} ${lesson.id === id ? 'bg-[#f3f5f7]' : ''}`}
                >
                  <div className="shrink-0">
                    {lesson.id === id ? (
                      <div className="w-7 h-7 rounded-full bg-[#0057b8] flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border-2 border-white" />
                      </div>
                    ) : lesson.status === 'locked' ? (
                      <div className="w-7 h-7 rounded-full bg-[#f3f5f7] flex items-center justify-center">
                        <Lock size={12} className="text-[#65758b]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-[#65758b] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#65758b]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1b2232] truncate">{lesson.title}</p>
                    <p className="text-xs text-[#65758b] flex items-center gap-1"><Clock size={10} /> {lesson.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
