'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'email-platform-onboarding'
const SETTINGS_KEY = 'email-platform-settings'
const CONTACTS_KEY = 'email-platform-contacts'
const EMAILS_SENT_KEY = 'email-platform-emails-sent'

export interface OnboardingState {
  isFirstVisit: boolean
  hasCompletedWelcome: boolean
  completedSteps: string[]
  dismissedAt?: string
}

export interface SetupStep {
  id: string
  title: string
  description: string
  isComplete: boolean
  href: string
}

const defaultState: OnboardingState = {
  isFirstVisit: true,
  hasCompletedWelcome: false,
  completedSteps: [],
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(defaultState)
  const [isLoading, setIsLoading] = useState(true)

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState({
          ...defaultState,
          ...parsed,
          isFirstVisit: false, // If we have saved state, it's not first visit
        })
      } catch (e) {
        console.error('Failed to load onboarding state:', e)
      }
    }
    setIsLoading(false)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoading])

  // Check which setup steps are complete based on actual data
  const checkSetupCompletion = useCallback((): SetupStep[] => {
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

    return [
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
    ]
  }, [])

  // Mark welcome as completed
  const completeWelcome = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFirstVisit: false,
      hasCompletedWelcome: true,
    }))
  }, [])

  // Skip welcome (user already knows how to use)
  const skipWelcome = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFirstVisit: false,
      hasCompletedWelcome: true,
      dismissedAt: new Date().toISOString(),
    }))
  }, [])

  // Mark a specific step as completed
  const markStepComplete = useCallback((stepId: string) => {
    setState(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId],
    }))
  }, [])

  // Increment emails sent counter
  const incrementEmailsSent = useCallback((count: number = 1) => {
    try {
      const current = parseInt(localStorage.getItem(EMAILS_SENT_KEY) || '0', 10)
      localStorage.setItem(EMAILS_SENT_KEY, String(current + count))
    } catch (e) {
      console.error('Failed to increment emails sent:', e)
    }
  }, [])

  // Reset onboarding (for testing)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(EMAILS_SENT_KEY)
    setState(defaultState)
  }, [])

  return {
    state,
    isLoading,
    checkSetupCompletion,
    completeWelcome,
    skipWelcome,
    markStepComplete,
    incrementEmailsSent,
    resetOnboarding,
  }
}
