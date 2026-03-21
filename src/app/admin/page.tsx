import { createClient } from '@/lib/supabase/server'
import { Users, BookOpen, Calculator, TrendingUp, Activity } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch basic stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: appointmentCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Total de Usuários', value: userCount?.toString() || '0', icon: Users, color: 'bg-[#0057b8]/20', iconColor: 'text-[#51a2ff]' },
    { label: 'Aulas Agendadas', value: appointmentCount?.toString() || '0', icon: Calculator, color: 'bg-[#ff9500]/20', iconColor: 'text-[#ff9500]' },
    { label: 'Planos Ativos', value: '—', icon: TrendingUp, color: 'bg-[#22c55e]/20', iconColor: 'text-[#22c55e]' },
    { label: 'Atividade Hoje', value: '—', icon: Activity, color: 'bg-[#8b5cf6]/20', iconColor: 'text-[#a78bfa]' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
      <p className="text-white/50 mb-10">Visão geral da plataforma Hop On Academy</p>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-[#141631] border border-white/5 rounded-2xl p-5">
            <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={iconColor} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-white/50">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#141631] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Gestão de Usuários</h2>
          <p className="text-white/50 text-sm mb-4">Visualize e gerencie contas de usuários, planos e acessos.</p>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors">Ver todos os usuários →</button>
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors">Gerenciar planos →</button>
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 transition-colors">Exportar dados →</button>
          </div>
        </div>

        <div className="bg-[#141631] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Conteúdo da Plataforma</h2>
          <p className="text-white/50 text-sm mb-4">Gerencie aulas, módulos, agendamentos e assistentes IA.</p>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors">Gerenciar aulas →</button>
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 border-b border-white/5 transition-colors">Ver agendamentos →</button>
            <button className="w-full text-left text-sm text-white/70 hover:text-white py-2 transition-colors">Configurar assistentes →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
