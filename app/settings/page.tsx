'use client'

import { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

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
              <Label htmlFor="apiKey">Resend API Key</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceId">Audience ID (Optional)</Label>
              <Input
                id="audienceId"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={settings.audienceId}
                onChange={(e) => handleChange('audienceId', e.target.value)}
                className="neo-border"
              />
              <p className="text-xs text-gray-500">
                For syncing contacts with Resend Audience
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
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                placeholder="Your Name"
                value={settings.senderName}
                onChange={(e) => handleChange('senderName', e.target.value)}
                className="neo-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="hello@yourdomain.com"
                value={settings.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                className="neo-border"
              />
              <p className="text-xs text-gray-500">
                Must be a verified domain in your Resend account
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
      </div>
    </div>
  )
}
