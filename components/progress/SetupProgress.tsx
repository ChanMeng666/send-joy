'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SetupStep {
  id: string
  title: string
  description: string
  isComplete: boolean
  href: string
}

const SETTINGS_KEY = 'email-platform-settings'
const CONTACTS_KEY = 'email-platform-contacts'
const EMAILS_SENT_KEY = 'email-platform-emails-sent'

export function SetupProgress() {
  const [steps, setSteps] = useState<SetupStep[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkCompletion = () => {
      let settings = { resendApiKey: '', senderEmail: '', senderName: '', audienceId: '' }
      let contacts: unknown[] = []
      let emailsSent = 0

      try {
        const settingsStr = localStorage.getItem(SETTINGS_KEY)
        if (settingsStr) settings = JSON.parse(settingsStr)

        const contactsStr = localStorage.getItem(CONTACTS_KEY)
        if (contactsStr) contacts = JSON.parse(contactsStr)

        const emailsSentStr = localStorage.getItem(EMAILS_SENT_KEY)
        if (emailsSentStr) emailsSent = parseInt(emailsSentStr, 10) || 0
      } catch (e) {
        console.error('Failed to check setup completion:', e)
      }

      setSteps([
        {
          id: 'api-key',
          title: 'Configure API Key',
          description: 'Get your Resend API key to enable email sending',
          isComplete: !!settings.resendApiKey,
          href: '/settings',
        },
        {
          id: 'sender-info',
          title: 'Set Up Sender Info',
          description: 'Configure your sender name and email address',
          isComplete: !!settings.senderEmail && !!settings.senderName,
          href: '/settings',
        },
        {
          id: 'add-contacts',
          title: 'Add Contacts',
          description: 'Add at least one recipient to send emails to',
          isComplete: contacts.length > 0,
          href: '/contacts',
        },
        {
          id: 'send-email',
          title: 'Send Your First Email',
          description: 'Send a test email to verify everything works',
          isComplete: emailsSent > 0,
          href: '/send',
        },
      ])
      setIsLoading(false)
    }

    checkCompletion()

    // Re-check when storage changes
    const handleStorageChange = () => checkCompletion()
    window.addEventListener('storage', handleStorageChange)

    // Also check periodically for same-tab changes
    const interval = setInterval(checkCompletion, 2000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (isLoading) return null

  const completedCount = steps.filter(s => s.isComplete).length
  const progress = (completedCount / steps.length) * 100

  // Hide when all steps are complete
  if (progress === 100) {
    return null
  }

  // Find the current (first incomplete) step
  const currentStepIndex = steps.findIndex(s => !s.isComplete)

  return (
    <div className="neo-card mb-8">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-gold text-white flex items-center justify-center neo-border font-black">
            {completedCount}/{steps.length}
          </div>
          <div>
            <h3 className="font-bold text-lg">Setup Progress</h3>
            <p className="text-sm text-gray-500">
              Complete these steps to start sending emails
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 mb-2">
        <div className="w-full h-3 bg-gray-200 neo-border overflow-hidden">
          <div
            className="h-full bg-neo-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {!isCollapsed && (
        <div className="mt-4 space-y-2">
          {steps.map((step, index) => {
            const isCurrent = index === currentStepIndex
            const isPast = step.isComplete
            const isFuture = !step.isComplete && index > currentStepIndex

            return (
              <Link key={step.id} href={step.href}>
                <div
                  className={cn(
                    'flex items-center gap-4 p-4 transition-all neo-border',
                    isPast && 'bg-green-50 border-neo-green',
                    isCurrent && 'bg-neo-cream border-black neo-shadow cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none',
                    isFuture && 'bg-gray-50 border-gray-200 opacity-60'
                  )}
                >
                  {/* Step indicator */}
                  <div
                    className={cn(
                      'w-8 h-8 flex items-center justify-center neo-border flex-shrink-0',
                      isPast && 'bg-neo-green text-white',
                      isCurrent && 'bg-neo-gold text-white',
                      isFuture && 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isPast ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-bold text-sm">{index + 1}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-bold text-sm',
                        isPast && 'text-neo-green',
                        isCurrent && 'text-black',
                        isFuture && 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for current step */}
                  {isCurrent && (
                    <ArrowRight className="w-5 h-5 text-neo-gold flex-shrink-0" />
                  )}

                  {/* Checkmark for completed */}
                  {isPast && (
                    <span className="text-xs text-neo-green font-medium">
                      Done
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
