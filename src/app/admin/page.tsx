import Link from 'next/link'
import { getGestorStudentsData, getTeachersData } from '@/lib/supabase/actions'
import { ArrowLeft } from 'lucide-react'
import AdminDashboard from './AdminDashboard'

export default async function GestorPage() {
  const [{ students }, { teachers }] = await Promise.all([
    getGestorStudentsData(),
    getTeachersData(),
  ])

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <Link href="/home" className="inline-flex items-center gap-1.5 text-sm text-[#65758b] hover:text-[#1b2232] mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to home
      </Link>

      <div className="bg-[#1f2c47] rounded-2xl px-8 py-6 mb-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#FFCB22] flex items-center justify-center shrink-0 text-2xl">👩‍💼</div>
        <div>
          <h1 className="text-white font-bold text-2xl">Manager Dashboard</h1>
          <p className="text-white/60 text-sm mt-0.5">Monitor student performance and engagement.</p>
        </div>
      </div>

      <AdminDashboard students={students} teachers={teachers} />
    </div>
  )
}
