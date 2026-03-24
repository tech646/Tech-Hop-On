'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts'
import * as XLSX from 'xlsx'
import { Download, ArrowUp, ArrowDown, Users, TrendingUp, BookOpen, Sparkles } from 'lucide-react'

type Student = {
  id: string
  name: string
  country: string
  city: string
  avatarUrl: string | null
  mathClasses: number
  mathMax: number
  onlineCourses: number
  aiUsage: number
  satScore: number | null
  satTarget: number
  trend: string
  colleges: string[]
}

const PIE_COLORS = ['#0057b8', '#ff9500', '#22c55e', '#ef467c', '#8b5cf6', '#06b6d4', '#f59e0b', '#1f2c47']

export default function AdminDashboard({ students: all }: { students: Student[] }) {
  const [filters, setFilters] = useState({
    country: '', city: '', minSAT: '', minLessons: '', minAI: '', minMath: '',
  })

  const countries = useMemo(() =>
    [...new Set(all.map(s => s.country).filter(Boolean))].sort(), [all])
  const cities = useMemo(() =>
    [...new Set(all.map(s => s.city).filter(Boolean))].sort(), [all])

  const filtered = useMemo(() => all.filter(s => {
    if (filters.country && s.country !== filters.country) return false
    if (filters.city && s.city !== filters.city) return false
    if (filters.minSAT && (s.satScore ?? 0) < Number(filters.minSAT)) return false
    if (filters.minLessons && s.onlineCourses < Number(filters.minLessons)) return false
    if (filters.minAI && s.aiUsage < Number(filters.minAI)) return false
    if (filters.minMath && s.mathClasses < Number(filters.minMath)) return false
    return true
  }), [all, filters])

  const hasFilters = Object.values(filters).some(Boolean)

  // Derived stats
  const stats = useMemo(() => {
    const withSAT = filtered.filter(s => s.satScore)
    return {
      total: filtered.length,
      avgSAT: withSAT.length
        ? Math.round(withSAT.reduce((a, s) => a + (s.satScore ?? 0), 0) / withSAT.length)
        : 0,
      avgLessons: filtered.length
        ? Math.round(filtered.reduce((a, s) => a + s.onlineCourses, 0) / filtered.length)
        : 0,
      avgAI: filtered.length
        ? Math.round(filtered.reduce((a, s) => a + s.aiUsage, 0) / filtered.length)
        : 0,
    }
  }, [filtered])

  // Chart data
  const countryBar = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach(s => { map[s.country] = (map[s.country] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  const satBar = useMemo(() =>
    filtered
      .filter(s => s.satScore)
      .map(s => ({ name: s.name.split(' ')[0], score: s.satScore, target: s.satTarget }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  , [filtered])

  const activityBar = useMemo(() =>
    filtered.map(s => ({
      name: s.name.split(' ')[0],
      Lessons: s.onlineCourses,
      'AI Messages': s.aiUsage,
      'Math Classes': s.mathClasses,
    }))
  , [filtered])

  // Downloads
  function downloadXLSX() {
    const rows = filtered.map(s => ({
      Name: s.name,
      Country: s.country,
      City: s.city,
      'SAT Score': s.satScore ?? '',
      'SAT Target': s.satTarget,
      'Lessons Completed': s.onlineCourses,
      'AI Usage': s.aiUsage,
      'Math Classes': s.mathClasses,
      'College List': s.colleges.join(', '),
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, 'hop-on-students.xlsx')
  }

  function downloadCSV() {
    const header = ['Name', 'Country', 'City', 'SAT Score', 'SAT Target', 'Lessons', 'AI Usage', 'Math Classes', 'College List']
    const rows = filtered.map(s => [
      s.name, s.country, s.city, s.satScore ?? '', s.satTarget,
      s.onlineCourses, s.aiUsage, s.mathClasses, s.colleges.join('; '),
    ])
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'hop-on-students.csv'
    a.click()
  }

  return (
    <div className="space-y-5">

      {/* Filters + Download */}
      <div className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-[#1b2232]">Filters</p>
          <div className="flex gap-2">
            <button onClick={downloadCSV}
              className="flex items-center gap-1.5 text-sm border border-[#e1e7ef] text-[#65758b] px-3 py-1.5 rounded-xl hover:bg-[#f3f5f7] transition-colors">
              <Download size={14} /> CSV
            </button>
            <button onClick={downloadXLSX}
              className="flex items-center gap-1.5 text-sm bg-[#0057b8] text-white px-3 py-1.5 rounded-xl hover:bg-[#0046a0] transition-colors">
              <Download size={14} /> XLSX
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'country', label: 'Country', type: 'select', options: countries },
            { key: 'city',    label: 'City',    type: 'select', options: cities },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <label className="text-xs text-[#65758b] font-medium block mb-1">{label}</label>
              <select
                value={filters[key as keyof typeof filters]}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-[#e1e7ef] rounded-xl px-3 py-2 text-sm text-[#1b2232] bg-white outline-none focus:border-[#0057b8]"
              >
                <option value="">All</option>
                {options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          {[
            { key: 'minSAT',     label: 'Min SAT',          placeholder: '1200' },
            { key: 'minLessons', label: 'Min Lessons',       placeholder: '5'    },
            { key: 'minAI',      label: 'Min AI Messages',   placeholder: '10'   },
            { key: 'minMath',    label: 'Min Math Classes',  placeholder: '2'    },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-[#65758b] font-medium block mb-1">{label}</label>
              <input
                type="number"
                value={filters[key as keyof typeof filters]}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-[#e1e7ef] rounded-xl px-3 py-2 text-sm text-[#1b2232] outline-none focus:border-[#0057b8]"
              />
            </div>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => setFilters({ country: '', city: '', minSAT: '', minLessons: '', minAI: '', minMath: '' })}
            className="mt-3 text-xs text-[#65758b] hover:text-[#1b2232]"
          >
            ✕ Clear filters · showing {filtered.length} of {all.length} students
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'STUDENTS',          value: stats.total,             icon: Users,      color: 'bg-[#0057b8]/10' },
          { label: 'AVG SAT SCORE',     value: stats.avgSAT || '—',     icon: TrendingUp, color: 'bg-[#ff9500]/10' },
          { label: 'AVG LESSONS DONE',  value: stats.avgLessons,        icon: BookOpen,   color: 'bg-[#22c55e]/10' },
          { label: 'AVG AI USAGE',      value: stats.avgAI,             icon: Sparkles,   color: 'bg-[#8b5cf6]/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
                <Icon size={16} className="text-[#1b2232]" />
              </div>
              <span className="text-[10px] font-bold text-[#65758b] uppercase tracking-wider leading-tight">{label}</span>
            </div>
            <p className="text-3xl font-bold text-[#1b2232]">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Country bar */}
        <div className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
          <p className="font-bold text-[#1b2232] mb-1">Students by Country</p>
          <p className="text-xs text-[#65758b] mb-4">{filtered.length} students in current selection</p>
          {countryBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={countryBar} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [v, 'Students']} />
                <Bar dataKey="value" name="Students" fill="#0057b8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Country donut */}
        <div className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
          <p className="font-bold text-[#1b2232] mb-1">Country Distribution</p>
          <p className="text-xs text-[#65758b] mb-4">Share of students per country</p>
          {countryBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={countryBar}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  dataKey="value" nameKey="name"
                  paddingAngle={2}
                >
                  {countryBar.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* SAT scores */}
        <div className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
          <p className="font-bold text-[#1b2232] mb-1">SAT Scores</p>
          <p className="text-xs text-[#65758b] mb-4">Score vs. target per student</p>
          {satBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={satBar} margin={{ right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1600]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="score" name="Score"  fill="#0057b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#e1e7ef" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No SAT data yet" />
          )}
        </div>

        {/* Activity */}
        <div className="bg-white border border-[#e1e7ef] rounded-2xl p-5">
          <p className="font-bold text-[#1b2232] mb-1">Activity per Student</p>
          <p className="text-xs text-[#65758b] mb-4">Lessons, AI usage and Math classes</p>
          {activityBar.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={activityBar} margin={{ right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Lessons"      fill="#0057b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="AI Messages"  fill="#ff9500" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Math Classes" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e1e7ef] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1e7ef] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1b2232]">Individual performance</h2>
            <p className="text-[#0057b8] text-sm mt-0.5">{filtered.length} student(s) found</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-[#65758b] text-sm">No students match the current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e1e7ef]">
                  {['Student', 'Country', 'Math classes', 'Online course', 'AI', 'SAT', 'College List'].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-xs font-semibold text-[#65758b] uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-[#f3f5f7] last:border-0 hover:bg-[#f9fafb] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#f3f5f7] overflow-hidden shrink-0 flex items-center justify-center text-sm">
                          {s.avatarUrl
                            ? <Image src={s.avatarUrl} alt={s.name} width={32} height={32} className="w-full h-full object-cover" unoptimized />
                            : '👤'}
                        </div>
                        <div>
                          <p className="font-medium text-[#1b2232]">{s.name}</p>
                          <div className={`flex items-center gap-1 text-xs mt-0.5 ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-red-500' : 'text-[#65758b]'}`}>
                            {s.trend === 'up' ? <ArrowUp size={10} /> : s.trend === 'down' ? <ArrowDown size={10} /> : null}
                            {s.trend === 'up' ? 'Improving' : s.trend === 'down' ? 'Declining' : '—'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#65758b]">
                      <div>{s.country}</div>
                      {s.city && <div className="text-xs">{s.city}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#1b2232] font-medium">{s.mathClasses}/{s.mathMax}</span>
                      <div className="w-20 h-1.5 bg-[#f3f5f7] rounded-full mt-1">
                        <div className="h-full bg-[#1f2c47] rounded-full" style={{ width: `${Math.min((s.mathClasses / s.mathMax) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1b2232] font-medium">{s.onlineCourses}</td>
                    <td className="px-4 py-3 text-[#1b2232] font-medium">{s.aiUsage}x</td>
                    <td className="px-4 py-3">
                      {s.satScore ? (
                        <>
                          <span className={`font-bold ${s.satScore >= s.satTarget ? 'text-green-600' : 'text-red-500'}`}>{s.satScore}</span>
                          <p className="text-[#65758b] text-xs">Target: {s.satTarget}</p>
                        </>
                      ) : <span className="text-[#65758b]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.colleges.length > 0
                          ? s.colleges.map(c => (
                            <span key={c} className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">{c}</span>
                          ))
                          : <span className="text-[#65758b] text-xs">—</span>}
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

function EmptyChart({ label = 'No data yet' }: { label?: string }) {
  return (
    <div className="h-[220px] flex items-center justify-center text-[#65758b] text-sm">
      {label}
    </div>
  )
}
