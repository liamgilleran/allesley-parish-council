import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

type Severity = 'info' | 'warning' | 'urgent'

interface Props {
  message: string
  severity: Severity
}

const config: Record<Severity, { bg: string; text: string; Icon: typeof Info }> = {
  info:    { bg: 'bg-blue-600',   text: 'text-white', Icon: Info },
  warning: { bg: 'bg-amber-500',  text: 'text-white', Icon: AlertTriangle },
  urgent:  { bg: 'bg-red-600',    text: 'text-white', Icon: AlertCircle },
}

export function EmergencyBanner({ message, severity }: Props) {
  const { bg, text, Icon } = config[severity]
  return (
    <div className={clsx(bg, text, 'py-2.5 px-4 text-sm')}>
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  )
}
