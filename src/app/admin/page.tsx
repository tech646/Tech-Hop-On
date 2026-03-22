import Link from 'next/link'
import { getGestorStudentsData } from '@/lib/supabase/actions'
import { Users, TrendingUp, BookOpen, Sparkles, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react'

export default async function GestorPage() {
  const { students, stats } = await getGestorStudentsData()

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Back */}
      <Link href="/home" className="inline-flex items-center gap-1.5 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 transition-colors">
        <ArrowLeft size={14} /> Voltar para home
      </Link>

      {/* Header banner */}
      <div className="bg-[#1f2c47] rounded-2xl px-8 py-6 mb-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#FFCB22] flex items-center justify-center shrink-0">
          <Users size={24} className="text-[#1f2c47]" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl">Painel do Gestor</h1>
          <p className="text-white/60 text-sm mt-0.5">Acompanhe o desempenho dos alunos.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'TOTAL DE ALUNOS', value: stats.total, icon: Users },
          { label: 'MÉDIA SAT', value: stats.avgSAT || '—', icon: TrendingUp },
          { label: 'MÉDIA AULAS CONCLUÍDAS', value: stats.avgLessons, icon: BookOpen },
          { label: 'MÉDIA USO DE IA', value: stats.avgAI, icon: Sparkles },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#f3f5f7] flex items-center justify-center">
                <Icon size={16} className="text-[#65758b]" />
              </div>
              <span className="text-[10px] font-bold text-[#65758b] uppercase tracking-wider leading-tight">{label}</span>
            </div>
            <p className="text-3xl font-bold text-[#1b2232]">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e1e7ef] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1e7ef]">
          <h2 className="text-base font-bold text-[#1b2232]">Desempenho individual</h2>
          <p className="text-[#0057b8] text-sm mt-0.5">{stats.total} aluno(s) encontrado(s)</p>
        </div>

        {students.length === 0 ? (
          <div className="px-6 py-16 text-center text-[#65758b] text-sm">
            Nenhum aluno cadastrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e1e7ef]">
                  {['Aluno', 'Country', 'Math classes', 'Online course', 'AI', 'SAT', 'College List'].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-[#65758b] uppercase tracking-wider whitespace-nowrap">
                      <span className="flex items-center gap-1">{col} <span className="opacity-50">↓</span></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-[#f3f5f7] last:border-0 hover:bg-[#f9fafb] transition-colors">
                    {/* Aluno */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1b2232]">{s.name}</p>
                      <div className={`flex items-center gap-1 text-xs mt-0.5 ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-red-500' : 'text-[#65758b]'}`}>
                        {s.trend === 'up' ? <ArrowUp size={10} /> : s.trend === 'down' ? <ArrowDown size={10} /> : null}
                        {s.trend === 'up' ? 'Subindo' : s.trend === 'down' ? 'Caindo' : '—'}
                      </div>
                    </td>
                    {/* Country */}
                    <td className="px-4 py-3 text-[#65758b]">{s.country}</td>
                    {/* Math classes */}
                    <td className="px-4 py-3">
                      <span className="text-[#1b2232] font-medium">{s.mathClasses}/{s.mathMax}</span>
                      <div className="w-20 h-1.5 bg-[#f3f5f7] rounded-full mt-1">
                        <div
                          className="h-full bg-[#1f2c47] rounded-full"
                          style={{ width: `${Math.min((s.mathClasses / s.mathMax) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    {/* Online course */}
                    <td className="px-4 py-3 text-[#1b2232] font-medium">{s.onlineCourses}</td>
                    {/* AI */}
                    <td className="px-4 py-3 text-[#1b2232] font-medium">{s.aiUsage}x</td>
                    {/* SAT */}
                    <td className="px-4 py-3">
                      {s.satScore ? (
                        <>
                          <span className={`font-bold ${s.satScore >= s.satTarget ? 'text-green-600' : 'text-red-500'}`}>
                            {s.satScore}
                          </span>
                          <p className="text-[#65758b] text-xs">Meta: {s.satTarget}</p>
                        </>
                      ) : (
                        <span className="text-[#65758b]">—</span>
                      )}
                    </td>
                    {/* College List */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.colleges.length > 0 ? (
                          s.colleges.map(c => (
                            <span key={c} className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#65758b] text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
