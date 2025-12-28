'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ApiKeySetupGuide } from '@/components/settings/ApiKeySetupGuide'
import { HelpButton } from '@/components/help/HelpButton'

interface Settings {
  resendApiKey: string
  senderEmail: string
  senderName: string
  audienceId: string
}

const STORAGE_KEY = 'email-platform-settings'

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>({
    resendApiKey: '',
    senderEmail: '',
    senderName: '',
    audienceId: '',
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // 从 localStorage 加载设置
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleSave = () => {
    setIsLoading(true)

    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
        variant: 'default',
      })

      setTimeout(() => setIsSaved(false), 3000)
    }, 500)
  }

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-gray-600">
          Configure your Resend API and sender information
        </p>
      </div>

      <div className="space-y-6">
        {/* Resend API Configuration */}
        <Card className="neo-border neo-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-neo-red text-white flex items-center justify-center neo-border text-sm font-bold">
                1
              </span>
              Resend API Configuration
            </CardTitle>
            <CardDescription>
              Enter your Resend API key to enable email sending.{' '}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neo-red underline hover:no-underline"
              >
                Get your API key
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="apiKey">Resend API Key</Label>
                <HelpButton topic="resend-api-key" />
              </div>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={settings.resendApiKey}
                  onChange={(e) => handleChange('resendApiKey', e.target.value)}
                  className="neo-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {/* Show setup guide when API key is empty */}
              {!settings.resendApiKey && <ApiKeySetupGuide />}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="audienceId">Segment ID (Optional)</Label>
                <HelpButton topic="audience-id" />
              </div>
              <Input
                id="audienceId"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={settings.audienceId}
                onChange={(e) => handleChange('audienceId', e.target.value)}
                className="neo-border"
              />
              <p className="text-xs text-gray-500">
                For syncing contacts with Resend Segments. Find it at{' '}
                <a
                  href="https://resend.com/audience"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neo-red underline hover:no-underline"
                >
                  resend.com/audience
                </a>
                {' → Segments → Your Segment → ID'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sender Information */}
        <Card className="neo-border neo-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-neo-green text-white flex items-center justify-center neo-border text-sm font-bold">
                2
              </span>
              Sender Information
            </CardTitle>
            <CardDescription>
              Configure the sender name and email address for your emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <HelpButton topic="sender-name" />
              </div>
              <Input
                id="senderName"
                placeholder="Your Name"
                value={settings.senderName}
                onChange={(e) => handleChange('senderName', e.target.value)}
                className="neo-border"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <HelpButton topic="sender-email" />
              </div>
              <Input
                id="senderEmail"
                type="email"
                placeholder="hello@yourdomain.com"
                value={settings.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                className="neo-border"
              />
              <p className="text-xs text-gray-500">
                Must be a verified domain in your Resend account.
                For testing, you can use <code className="bg-gray-100 px-1 rounded">delivered@resend.dev</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="neo-button bg-neo-red text-white px-8"
          >
            {isLoading ? (
              'Saving...'
            ) : isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          {!settings.resendApiKey && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">API key required to send emails</span>
            </div>
          )}
        </div>

        {/* Privacy & Security Notice */}
        <Card className="neo-border bg-green-50 border-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <ShieldCheck className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-green-800">Your Data Stays on Your Device</h4>
                <p className="text-sm text-green-700">
                  All your settings, API keys, and contact information are stored exclusively in your
                  browser&apos;s local storage. This data never leaves your device and is never transmitted
                  to our servers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-green-800">Direct Communication with Resend</h4>
                <p className="text-sm text-green-700">
                  When you send emails or sync contacts, your browser communicates directly with the
                  Resend API using your API key. We do not intercept, store, or have access to your
                  API key or any data you process.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-green-800">Open Source & Transparent</h4>
                <p className="text-sm text-green-700">
                  This project is open source. You can review the code to verify our privacy claims at{' '}
                  <a
                    href="https://github.com/ChanMeng666/christmas-greeting-email"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline font-medium"
                  >
                    GitHub
                  </a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
