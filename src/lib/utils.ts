import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const AI_ASSISTANTS = [
  {
    id: 'brighta',
    name: 'Brighta',
    description: 'Especialista em estratégias de estudo e planejamento acadêmico',
    specialty: 'Estratégia',
    color: '#0057B8',
    emoji: '⭐',
  },
  {
    id: 'gritty',
    name: 'Gritty',
    description: 'Focado em persistência e superação de desafios nos estudos',
    specialty: 'Motivação',
    color: '#F78490',
    emoji: '💪',
  },
  {
    id: 'smartle',
    name: 'Smartle',
    description: 'Especialista em matemática e raciocínio lógico',
    specialty: 'Matemática',
    color: '#FFCB22',
    emoji: '🧮',
  },
  {
    id: 'wan',
    name: 'Wan',
    description: 'Focado em inglês e preparação para o SAT verbal',
    specialty: 'Inglês',
    color: '#37B0DD',
    emoji: '📚',
  },
]

export const PLANS = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 99.90,
    period: 'mês',
    features: [
      'Acesso a todas as aulas',
      'Assistentes IA ilimitados',
      'Math Classes',
      'Diagnóstico completo',
      'Suporte por email',
    ],
    is_popular: false,
  },
  {
    id: 'semester',
    name: 'Semestral',
    price: 79.90,
    period: 'mês',
    total: 479.40,
    savings: '20% off',
    features: [
      'Acesso a todas as aulas',
      'Assistentes IA ilimitados',
      'Math Classes',
      'Diagnóstico completo',
      'Suporte prioritário',
      'Simulados SAT',
    ],
    is_popular: true,
  },
  {
    id: 'annual',
    name: 'Anual',
    price: 59.90,
    period: 'mês',
    total: 718.80,
    savings: '40% off',
    features: [
      'Acesso a todas as aulas',
      'Assistentes IA ilimitados',
      'Math Classes',
      'Diagnóstico completo',
      'Suporte VIP',
      'Simulados SAT',
      'Mentoria individual',
    ],
    is_popular: false,
  },
]
