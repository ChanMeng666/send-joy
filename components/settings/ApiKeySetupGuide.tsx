'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepProps {
  number: number
  title: string
  description: string
  link?: string
  linkText?: string
  highlight?: boolean
}

function Step({ number, title, description, link, linkText, highlight }: StepProps) {
  return (
    <div
      className={cn(
        'flex gap-4 p-4 neo-border',
        highlight ? 'bg-amber-50 border-amber-400' : 'bg-white'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 flex-shrink-0 flex items-center justify-center neo-border font-bold text-sm',
          highlight ? 'bg-amber-400 text-white' : 'bg-neo-cream text-gray-700'
        )}
      >
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-sm text-neo-red hover:underline font-medium"
          >
            {linkText || 'Open Link'}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

export function ApiKeySetupGuide() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mt-4 neo-border bg-neo-cream overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-neo-gold" />
          <span className="font-bold text-sm">
            First time? Follow these steps to get your API key
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Introduction */}
          <div className="p-4 bg-white neo-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-neo-red/10 neo-border flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-neo-red" />
              </div>
              <div>
                <h3 className="font-bold mb-1">What is Resend?</h3>
                <p className="text-sm text-gray-600">
                  Resend is a professional email delivery service. We use it to ensure your emails
                  are delivered reliably. Creating an account is free and takes less than a minute.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <Step
              number={1}
              title="Create a Resend Account"
              description="Visit Resend.com and sign up for a free account. You just need an email address to get started."
              link="https://resend.com/signup"
              linkText="Go to Resend Sign Up"
            />

            <Step
              number={2}
              title="Verify Your Email"
              description="Check your inbox for a verification email from Resend and click the verification link."
            />

            <Step
              number={3}
              title="Navigate to API Keys"
              description="After logging in, click 'API Keys' in the left sidebar menu of your Resend dashboard."
              link="https://resend.com/api-keys"
              linkText="Go to API Keys Page"
            />

            <Step
              number={4}
              title="Create a New API Key"
              description="Click the 'Create API Key' button. Give your key a name like 'Email Platform' and select 'Sending access' for permissions."
            />

            <Step
              number={5}
              title="Copy Your API Key"
              description="After creating the key, copy it immediately. The key starts with 're_' and will only be shown once!"
              highlight={true}
            />

            <Step
              number={6}
              title="Paste It Above"
              description="Paste the API key you copied into the 'Resend API Key' field above, then click 'Save Settings'."
            />
          </div>

          {/* Security Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 neo-border border-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-800 mb-1">
                Keep Your API Key Private
              </h4>
              <p className="text-sm text-amber-700">
                Your API key is like a password. Never share it publicly or with anyone
                you don&apos;t trust. If you think your key has been compromised, delete it
                in Resend and create a new one.
              </p>
            </div>
          </div>

          {/* Tip for testing */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 neo-border border-blue-300">
            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-blue-800 mb-1">
                Testing Without Your Own Domain
              </h4>
              <p className="text-sm text-blue-700">
                If you don&apos;t have your own domain yet, you can use{' '}
                <code className="bg-blue-100 px-1 rounded">delivered@resend.dev</code>{' '}
                as the sender email for testing. This allows you to test the platform
                before setting up your own domain.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
