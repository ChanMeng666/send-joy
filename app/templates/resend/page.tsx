'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Cloud,
  RefreshCw,
  Trash2,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
  Check,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const SETTINGS_STORAGE_KEY = 'email-platform-settings'

interface ResendTemplate {
  id: string
  name: string
  created_at: string
}

export default function ResendTemplatesPage() {
  const [templates, setTemplates] = useState<ResendTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load API key and fetch templates
  useEffect(() => {
    const settings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (settings) {
      try {
        const parsed = JSON.parse(settings)
        if (parsed.resendApiKey) {
          setApiKey(parsed.resendApiKey)
          fetchTemplates(parsed.resendApiKey)
        } else {
          setError('API key not configured')
          setLoading(false)
        }
      } catch (e) {
        console.error('Failed to load settings:', e)
        setError('Failed to load settings')
        setLoading(false)
      }
    } else {
      setError('API key not configured')
      setLoading(false)
    }
  }, [])

  const fetchTemplates = async (key: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/resend-templates?apiKey=${encodeURIComponent(key)}`)
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates || [])
      } else {
        setError(data.error || 'Failed to fetch templates')
      }
    } catch (e) {
      console.error('Fetch templates error:', e)
      setError('Failed to fetch templates from Resend')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (apiKey) {
      fetchTemplates(apiKey)
    }
  }

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!confirm(`Are you sure you want to delete "${templateName}" from Resend?`)) {
      return
    }

    setActionLoading(templateId)
    try {
      const response = await fetch(`/api/resend-templates/${templateId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (data.success) {
        setTemplates(templates.filter(t => t.id !== templateId))
        setMessage({ type: 'success', text: `"${templateName}" deleted successfully` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete template' })
      }
    } catch (e) {
      console.error('Delete template error:', e)
      setMessage({ type: 'error', text: 'Failed to delete template' })
    } finally {
      setActionLoading(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDuplicate = async (templateId: string, templateName: string) => {
    setActionLoading(templateId)
    try {
      const response = await fetch(`/api/resend-templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the list to show the new template
        if (apiKey) fetchTemplates(apiKey)
        setMessage({ type: 'success', text: `"${templateName}" duplicated successfully` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to duplicate template' })
      }
    } catch (e) {
      console.error('Duplicate template error:', e)
      setMessage({ type: 'error', text: 'Failed to duplicate template' })
    } finally {
      setActionLoading(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/templates" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Link>
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-neo-green" />
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">
                Resend Templates
              </h1>
              <p className="text-gray-600">
                Manage templates stored on Resend cloud
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="neo-border"
          onClick={handleRefresh}
          disabled={loading || !apiKey}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 neo-border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="neo-border neo-shadow p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <h2 className="text-xl font-bold mb-2">Cannot Load Templates</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {!apiKey && (
            <Link href="/settings">
              <Button className="neo-button bg-neo-green text-white">
                Configure API Key
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="neo-border neo-shadow p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Loading Templates</h2>
          <p className="text-gray-600">Fetching templates from Resend...</p>
        </Card>
      )}

      {/* Templates List */}
      {!loading && !error && (
        <>
          {templates.length === 0 ? (
            <Card className="neo-border neo-shadow p-8 text-center">
              <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-bold mb-2">No Templates on Resend</h2>
              <p className="text-gray-600 mb-4">
                You haven&apos;t synced any templates to Resend yet.
              </p>
              <Link href="/templates">
                <Button className="neo-button bg-neo-green text-white">
                  Go to Templates
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                {templates.length} template{templates.length !== 1 ? 's' : ''} found on Resend
              </p>
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="neo-border neo-shadow p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neo-cream neo-border flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-neo-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(template.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        ID: {template.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="neo-border"
                      onClick={() => handleDuplicate(template.id, template.name)}
                      disabled={actionLoading === template.id}
                    >
                      {actionLoading === template.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="neo-border text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(template.id, template.name)}
                      disabled={actionLoading === template.id}
                    >
                      {actionLoading === template.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                    <a
                      href={`https://resend.com/templates/${template.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline" className="neo-border">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-gray-50 neo-border">
        <h3 className="font-bold mb-2">About Resend Templates</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Templates synced here are stored on Resend&apos;s cloud servers</li>
          <li>• You can sync templates from the Template Editor using the &quot;Sync to Resend&quot; button</li>
          <li>• Synced templates show a green cloud badge in the Templates list</li>
          <li>• Click the external link icon to view templates in Resend&apos;s dashboard</li>
        </ul>
      </div>
    </div>
  )
}
