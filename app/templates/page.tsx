'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Gift, Megaphone, Newspaper, Edit, Copy, Trash2, Check, Cloud, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const TEMPLATES_STORAGE_KEY = 'email-platform-templates'
const SETTINGS_STORAGE_KEY = 'email-platform-settings'

// Preset template IDs for reference
const PRESET_TEMPLATE_IDS = [
  'christmas-classic',
  'new-year-2025',
  'chinese-new-year',
  'birthday',
  'product-launch',
  'newsletter',
]

interface TemplateWithSync {
  id: string
  name: string
  type: 'holiday' | 'marketing' | 'newsletter'
  description: string
  thumbnail: string
  color: string
  isPreset: boolean
  isResendCloud?: boolean // Template from Resend cloud (not local)
  createdAt?: string
  // Resend sync fields
  resendTemplateId?: string
  syncedAt?: string
  isPublished?: boolean
}

interface ResendCloudTemplate {
  id: string
  name: string
  created_at: string
}

// Preset templates data
const presetTemplates: TemplateWithSync[] = [
  {
    id: 'christmas-classic',
    name: 'Classic Christmas',
    type: 'holiday',
    description: 'Neobrutalism-styled Christmas greeting',
    thumbnail: '🎄',
    color: 'bg-neo-red',
    isPreset: true,
  },
  {
    id: 'new-year-2025',
    name: 'New Year 2025',
    type: 'holiday',
    description: 'Celebrate the new year in style',
    thumbnail: '🎆',
    color: 'bg-purple-500',
    isPreset: true,
  },
  {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    type: 'holiday',
    description: 'Traditional red and gold theme',
    thumbnail: '🧧',
    color: 'bg-red-600',
    isPreset: true,
  },
  {
    id: 'birthday',
    name: 'Birthday Wishes',
    type: 'holiday',
    description: 'Colorful birthday celebration',
    thumbnail: '🎂',
    color: 'bg-pink-500',
    isPreset: true,
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    type: 'marketing',
    description: 'Announce your new product',
    thumbnail: '🚀',
    color: 'bg-neo-gold',
    isPreset: true,
  },
  {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    type: 'newsletter',
    description: 'Clean and professional digest',
    thumbnail: '📰',
    color: 'bg-neo-green',
    isPreset: true,
  },
]

const typeIcons = {
  holiday: Gift,
  marketing: Megaphone,
  newsletter: Newspaper,
}

const typeLabels = {
  holiday: 'Holiday',
  marketing: 'Marketing',
  newsletter: 'Newsletter',
}

export default function TemplatesPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<'all' | 'holiday' | 'marketing' | 'newsletter' | 'custom' | 'resend'>('all')
  const [localTemplates, setLocalTemplates] = useState<TemplateWithSync[]>([])
  const [resendCloudTemplates, setResendCloudTemplates] = useState<TemplateWithSync[]>([])
  const [loadingResend, setLoadingResend] = useState(false)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  // Load local templates from localStorage and merge with presets
  useEffect(() => {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    const savedData: Record<string, {
      name?: string
      type?: string
      createdAt?: string
      resendTemplateId?: string
      syncedAt?: string
      isPublished?: boolean
    }> = saved ? JSON.parse(saved) : {}

    // Update preset templates with sync info from localStorage
    const presetsWithSyncInfo: TemplateWithSync[] = presetTemplates.map(preset => {
      const storedData = savedData[preset.id]
      if (storedData) {
        return {
          ...preset,
          resendTemplateId: storedData.resendTemplateId,
          syncedAt: storedData.syncedAt,
          isPublished: storedData.isPublished,
        }
      }
      return preset
    })

    // Load truly custom templates (non-preset IDs, excluding Resend cloud template IDs)
    const customTemplates: TemplateWithSync[] = Object.entries(savedData)
      .filter(([id]) => !PRESET_TEMPLATE_IDS.includes(id))
      .map(([id, data]) => ({
        id,
        name: data.name || 'Untitled Template',
        type: (data.type as 'holiday' | 'marketing' | 'newsletter') || 'holiday',
        description: 'Custom template',
        thumbnail: '✨',
        color: 'bg-gray-500',
        isPreset: false,
        createdAt: data.createdAt || new Date().toISOString(),
        resendTemplateId: data.resendTemplateId,
        syncedAt: data.syncedAt,
        isPublished: data.isPublished,
      }))

    setLocalTemplates([...presetsWithSyncInfo, ...customTemplates])
  }, [])

  // Load Resend cloud templates
  const fetchResendTemplates = useCallback(async () => {
    const settings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!settings) return

    try {
      const parsed = JSON.parse(settings)
      if (!parsed.resendApiKey) return

      setLoadingResend(true)
      const response = await fetch(`/api/resend-templates?apiKey=${encodeURIComponent(parsed.resendApiKey)}`)
      const data = await response.json()

      if (data.success && data.templates) {
        // Get all local resendTemplateIds to avoid duplicates
        const localResendIds = new Set(
          localTemplates
            .filter(t => t.resendTemplateId)
            .map(t => t.resendTemplateId)
        )

        // Convert Resend cloud templates to our format, excluding duplicates
        const cloudTemplates: TemplateWithSync[] = (data.templates as ResendCloudTemplate[])
          .filter(t => !localResendIds.has(t.id))
          .map(t => ({
            id: `resend-${t.id}`,
            name: t.name,
            type: 'holiday' as const, // Default type for cloud templates
            description: 'Template from Resend cloud',
            thumbnail: '☁️',
            color: 'bg-blue-500',
            isPreset: false,
            isResendCloud: true,
            createdAt: t.created_at,
            resendTemplateId: t.id,
          }))

        setResendCloudTemplates(cloudTemplates)
      }
    } catch (e) {
      console.error('Failed to fetch Resend templates:', e)
    } finally {
      setLoadingResend(false)
    }
  }, [localTemplates])

  useEffect(() => {
    fetchResendTemplates()
  }, [fetchResendTemplates])

  // Combine all templates
  const allTemplates = [...localTemplates, ...resendCloudTemplates]

  // Filter templates
  const filteredTemplates = activeFilter === 'all'
    ? allTemplates
    : activeFilter === 'custom'
      ? allTemplates.filter(t => !t.isPreset && !t.isResendCloud)
      : activeFilter === 'resend'
        ? allTemplates.filter(t => t.isResendCloud || t.resendTemplateId)
        : allTemplates.filter(t => t.type === activeFilter)

  // Create new template
  const handleCreateTemplate = () => {
    const newId = `custom-${Date.now()}`
    const newTemplate = {
      id: newId,
      name: 'New Template',
      type: 'holiday' as const,
      subject: 'Email Subject',
      createdAt: new Date().toISOString(),
      blocks: [
        {
          id: 'header-1',
          type: 'header',
          props: {
            title: 'Your Title Here',
            subtitle: 'Subtitle',
          },
          visible: true,
        },
        {
          id: 'text-1',
          type: 'text',
          props: {
            content: 'Dear {{recipientName}},\n\nStart writing your message here...',
          },
          visible: true,
        },
        {
          id: 'footer-1',
          type: 'footer',
          props: {
            senderLabel: 'Best Regards',
            senderName: '{{senderName}}',
          },
          visible: true,
        },
      ],
      theme: {
        primaryColor: '#DC2626',
        secondaryColor: '#16A34A',
        accentColor: '#F59E0B',
        backgroundColor: '#1a1a2e',
        surfaceColor: '#FFFBEB',
        textColor: '#000000',
        borderColor: '#000000',
        borderWidth: 4,
        shadowOffset: 8,
      },
    }

    // Save to localStorage
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
    const templates = JSON.parse(saved)
    templates[newId] = newTemplate
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))

    // Navigate to editor
    router.push(`/templates/${newId}/edit`)
  }

  // Copy template
  const handleCopyTemplate = (template: TemplateWithSync) => {
    const newId = `custom-${Date.now()}`

    // For preset templates, we need to get the full template data
    // For custom templates, load from localStorage
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
    const templates = JSON.parse(saved)

    let sourceData: Record<string, unknown>

    if (!template.isPreset) {
      // Custom template - copy from localStorage
      sourceData = templates[template.id] || {}
    } else {
      // Preset template - we'll create a copy with default structure
      // The editor will load the preset data
      sourceData = {
        name: template.name,
        type: template.type,
      }
    }

    const newTemplate = {
      ...sourceData,
      id: newId,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
    }

    templates[newId] = newTemplate
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))

    // Update UI - add new custom template to the list
    setLocalTemplates(prev => [...prev, {
      id: newId,
      name: `${template.name} (Copy)`,
      type: template.type as 'holiday' | 'marketing' | 'newsletter',
      description: 'Custom template',
      thumbnail: '✨',
      color: 'bg-gray-500',
      isPreset: false,
      createdAt: new Date().toISOString(),
    }])

    // Show message
    setCopyMessage(`"${template.name}" copied successfully`)
    setTimeout(() => setCopyMessage(null), 3000)
  }

  // Delete custom template
  const handleDeleteTemplate = (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
    const templates = JSON.parse(saved)
    delete templates[id]
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))

    setLocalTemplates(prev => prev.filter(t => t.id !== id))
  }

  // Get count for each filter type
  const getFilterCount = (type: 'all' | 'holiday' | 'marketing' | 'newsletter' | 'custom' | 'resend') => {
    if (type === 'all') return allTemplates.length
    if (type === 'custom') return allTemplates.filter(t => !t.isPreset && !t.isResendCloud).length
    if (type === 'resend') return allTemplates.filter(t => t.isResendCloud || t.resendTemplateId).length
    return allTemplates.filter(t => t.type === type).length
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
            Templates
          </h1>
          <p className="text-gray-600">
            Choose a template to customize or create your own
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/templates/resend">
            <Button variant="outline" className="neo-border">
              <Cloud className="w-4 h-4 mr-2" />
              Resend Cloud
            </Button>
          </Link>
          <Button
            className="neo-button bg-neo-green text-white"
            onClick={handleCreateTemplate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Copy Success Message */}
      {copyMessage && (
        <div className="mb-6 p-4 neo-border bg-green-50 text-green-800 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {copyMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <FilterTab
          label="All"
          count={getFilterCount('all')}
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        <FilterTab
          label="Holiday"
          count={getFilterCount('holiday')}
          active={activeFilter === 'holiday'}
          onClick={() => setActiveFilter('holiday')}
        />
        <FilterTab
          label="Marketing"
          count={getFilterCount('marketing')}
          active={activeFilter === 'marketing'}
          onClick={() => setActiveFilter('marketing')}
        />
        <FilterTab
          label="Newsletter"
          count={getFilterCount('newsletter')}
          active={activeFilter === 'newsletter'}
          onClick={() => setActiveFilter('newsletter')}
        />
        <FilterTab
          label="Custom"
          count={getFilterCount('custom')}
          active={activeFilter === 'custom'}
          onClick={() => setActiveFilter('custom')}
        />
        <FilterTab
          label="Resend"
          count={getFilterCount('resend')}
          active={activeFilter === 'resend'}
          onClick={() => setActiveFilter('resend')}
          loading={loadingResend}
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onCopy={() => handleCopyTemplate(template)}
            onDelete={!template.isPreset ? () => handleDeleteTemplate(template.id) : undefined}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found in this category.</p>
        </div>
      )}
    </div>
  )
}

function FilterTab({
  label,
  count,
  active = false,
  onClick,
  loading = false
}: {
  label: string
  count: number
  active?: boolean
  onClick: () => void
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 transition-all flex items-center gap-1 ${
        active
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-black hover:bg-gray-100'
      }`}
    >
      {label}
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin ml-1" />
      ) : (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}

function TemplateCard({
  template,
  onCopy,
  onDelete
}: {
  template: TemplateWithSync
  onCopy: () => void
  onDelete?: () => void
}) {
  const TypeIcon = typeIcons[template.type as keyof typeof typeIcons]
  const isCustom = !template.isPreset && !template.isResendCloud
  const isSynced = !!template.resendTemplateId && !template.isResendCloud
  const isCloud = !!template.isResendCloud

  return (
    <Card className="neo-border neo-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className={`${template.color} h-40 flex items-center justify-center relative`}>
        <span className="text-6xl">{template.thumbnail}</span>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {/* Cloud badge - for Resend cloud templates */}
          {isCloud && (
            <div className="bg-blue-500 text-white text-xs px-2 py-1 font-bold uppercase flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Resend
            </div>
          )}
          {/* Custom badge */}
          {isCustom && (
            <div className="bg-black text-white text-xs px-2 py-1 font-bold uppercase">
              Custom
            </div>
          )}
          {/* Synced badge - for local templates synced to Resend */}
          {isSynced && (
            <div
              className="bg-green-500 text-white text-xs px-2 py-1 font-bold uppercase flex items-center gap-1"
              title={`Synced: ${template.syncedAt ? new Date(template.syncedAt).toLocaleString() : 'Unknown'}`}
            >
              <Cloud className="w-3 h-3" />
              Synced
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/templates/${template.id}/edit`}>
            <Button size="sm" className="neo-button bg-white text-black">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.preventDefault()
              onCopy()
            }}
          >
            <Copy className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:bg-red-500/20"
              onClick={(e) => {
                e.preventDefault()
                onDelete()
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TypeIcon className="w-4 h-4 text-gray-500" />
          <span className="text-xs uppercase tracking-wide text-gray-500">
            {typeLabels[template.type as keyof typeof typeLabels]}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-1">{template.name}</h3>
        <p className="text-gray-600 text-sm">{template.description}</p>
      </div>
    </Card>
  )
}
