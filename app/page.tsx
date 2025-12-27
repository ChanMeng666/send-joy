'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Mail,
  Users,
  Palette,
  Send,
  ArrowRight,
  Sparkles,
  Gift,
  Megaphone,
  Newspaper
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WelcomeModal } from '@/components/onboarding/WelcomeModal'
import { SetupProgress } from '@/components/progress/SetupProgress'

const ONBOARDING_KEY = 'email-platform-onboarding'

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const saved = localStorage.getItem(ONBOARDING_KEY)
    if (!saved) {
      setShowWelcome(true)
    }
  }, [])

  const handleWelcomeComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify({
      hasCompletedWelcome: true,
      completedAt: new Date().toISOString(),
    }))
    setShowWelcome(false)
  }

  return (
    <div className="p-8">
      {/* Welcome Modal for first-time visitors */}
      {showWelcome && (
        <WelcomeModal
          onGetStarted={handleWelcomeComplete}
          onSkip={handleWelcomeComplete}
        />
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
          Email Template Platform
        </h1>
        <p className="text-gray-600 text-lg">
          Create beautiful emails for holidays, marketing, and newsletters
        </p>
      </div>

      {/* Setup Progress - shows until all steps are complete */}
      <SetupProgress />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <QuickActionCard
          icon={<Palette className="w-8 h-8" />}
          title="Templates"
          description="Browse and edit email templates"
          href="/templates"
          color="bg-neo-red"
        />
        <QuickActionCard
          icon={<Users className="w-8 h-8" />}
          title="Contacts"
          description="Manage your recipients"
          href="/contacts"
          color="bg-neo-green"
        />
        <QuickActionCard
          icon={<Send className="w-8 h-8" />}
          title="Send Email"
          description="Start sending wizard"
          href="/send"
          color="bg-neo-gold"
        />
        <QuickActionCard
          icon={<Mail className="w-8 h-8" />}
          title="Settings"
          description="Configure API and sender"
          href="/settings"
          color="bg-purple-500"
        />
      </div>

      {/* 模板类型展示 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Template Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TemplateTypeCard
            icon={<Gift className="w-12 h-12" />}
            title="Holiday Greetings"
            description="Christmas, New Year, Birthday and more"
            count={4}
            color="bg-red-100 text-neo-red"
          />
          <TemplateTypeCard
            icon={<Megaphone className="w-12 h-12" />}
            title="Marketing"
            description="Product launches, promotions, announcements"
            count={2}
            color="bg-yellow-100 text-neo-gold"
          />
          <TemplateTypeCard
            icon={<Newspaper className="w-12 h-12" />}
            title="Newsletter"
            description="Weekly digest, company updates"
            count={2}
            color="bg-green-100 text-neo-green"
          />
        </div>
      </div>

      {/* 快速开始指南 */}
      <div className="neo-card">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neo-cream rounded-lg">
            <Sparkles className="w-6 h-6 text-neo-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
              <li>Go to <strong>Settings</strong> and configure your Resend API Key</li>
              <li>Add your <strong>Contacts</strong> or sync from Resend Audience</li>
              <li>Choose a <strong>Template</strong> and customize it</li>
              <li>Use the <strong>Send Wizard</strong> to deliver your emails</li>
            </ol>
            <Link href="/settings">
              <Button className="neo-button bg-neo-red text-white">
                Configure Settings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <div className="neo-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer h-full">
        <div className={`w-14 h-14 ${color} text-white rounded-lg flex items-center justify-center mb-4 neo-border`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  )
}

function TemplateTypeCard({
  icon,
  title,
  description,
  count,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  count: number
  color: string
}) {
  return (
    <div className="neo-card">
      <div className={`w-20 h-20 ${color} rounded-lg flex items-center justify-center mb-4 neo-border`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
        {count} templates
      </span>
    </div>
  )
}
