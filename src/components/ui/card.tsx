import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-[#EDEFF3] shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('p-6 border-b border-[#EDEFF3]', className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: CardProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn('text-lg font-bold text-[#1B2232]', className)}>
      {children}
    </h3>
  )
}
