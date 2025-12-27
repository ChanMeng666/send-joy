'use client'

import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  X,
} from 'lucide-react'
import { getErrorMessage, ErrorMessage, ErrorSeverity } from '@/lib/error-messages'
import { cn } from '@/lib/utils'

interface SmartAlertProps {
  errorCode?: string
  message?: ErrorMessage
  onDismiss?: () => void
  className?: string
}

const severityConfig: Record<
  ErrorSeverity,
  {
    bgColor: string
    borderColor: string
    textColor: string
    icon: typeof AlertCircle
  }
> = {
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    icon: Info,
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-700',
    icon: AlertTriangle,
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-700',
    icon: AlertCircle,
  },
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-700',
    icon: CheckCircle,
  },
}

export function SmartAlert({
  errorCode,
  message: customMessage,
  onDismiss,
  className,
}: SmartAlertProps) {
  const message = customMessage || (errorCode ? getErrorMessage(errorCode) : null)

  if (!message) return null

  const config = severityConfig[message.severity]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'relative neo-border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.textColor)} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className={cn('font-bold text-sm', config.textColor)}>
            {message.title}
          </h4>

          {/* Description */}
          <p className={cn('text-sm mt-1', config.textColor, 'opacity-90')}>
            {message.description}
          </p>

          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <ul className={cn('mt-3 space-y-1', config.textColor, 'opacity-80')}>
              {message.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          )}

          {/* Action button */}
          {message.action && (
            <div className="mt-3">
              {message.action.href ? (
                <Link
                  href={message.action.href}
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium',
                    config.textColor,
                    'hover:underline'
                  )}
                >
                  {message.action.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : message.action.onClick ? (
                <button
                  onClick={message.action.onClick}
                  className={cn(
                    'inline-flex items-center gap-1 text-sm font-medium',
                    config.textColor,
                    'hover:underline'
                  )}
                >
                  {message.action.text}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Convenience components for common use cases
export function InfoAlert({
  title,
  description,
  action,
  className,
}: {
  title: string
  description: string
  action?: { text: string; href: string }
  className?: string
}) {
  return (
    <SmartAlert
      message={{
        title,
        description,
        severity: 'info',
        action,
      }}
      className={className}
    />
  )
}

export function WarningAlert({
  title,
  description,
  action,
  className,
}: {
  title: string
  description: string
  action?: { text: string; href: string }
  className?: string
}) {
  return (
    <SmartAlert
      message={{
        title,
        description,
        severity: 'warning',
        action,
      }}
      className={className}
    />
  )
}

export function ErrorAlert({
  title,
  description,
  suggestions,
  className,
}: {
  title: string
  description: string
  suggestions?: string[]
  className?: string
}) {
  return (
    <SmartAlert
      message={{
        title,
        description,
        severity: 'error',
        suggestions,
      }}
      className={className}
    />
  )
}

export function SuccessAlert({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <SmartAlert
      message={{
        title,
        description,
        severity: 'success',
      }}
      className={className}
    />
  )
}
