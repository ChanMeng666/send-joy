'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Gift, Megaphone, Newspaper, Edit, Copy, Trash2, Check, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const TEMPLATES_STORAGE_KEY = 'email-platform-templates'

// Preset templates data
const presetTemplates = [
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

interface CustomTemplate {
  id: string
  name: string
  type: 'holiday' | 'marketing' | 'newsletter'
  description: string
  thumbnail: string
  color: string
  isPreset: false
  createdAt: string
  // Resend sync fields
  resendTemplateId?: string
  syncedAt?: string
  isPublished?: boolean
}

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'holiday' | 'marketing' | 'newsletter' | 'custom'>('all')
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  // Load custom templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Extract just the metadata for display
        const templates = Object.entries(parsed).map(([id, data]: [string, unknown]) => {
          const templateData = data as {
            name?: string
            type?: string
            createdAt?: string
            resendTemplateId?: string
            syncedAt?: string
            isPublished?: boolean
          }
          return {
            id,
            name: templateData.name || 'Untitled Template',
            type: (templateData.type as 'holiday' | 'marketing' | 'newsletter') || 'holiday',
            description: 'Custom template',
            thumbnail: '✨',
            color: 'bg-gray-500',
            isPreset: false as const,
            createdAt: templateData.createdAt || new Date().toISOString(),
            // Include sync fields
            resendTemplateId: templateData.resendTemplateId,
            syncedAt: templateData.syncedAt,
            isPublished: templateData.isPublished,
          }
        })
        setCustomTemplates(templates)
      } catch (e) {
        console.error('Failed to load custom templates:', e)
      }
    }
  }, [])

  // Combine preset and custom templates
  const allTemplates = [...presetTemplates, ...customTemplates]

  // Filter templates
  const filteredTemplates = activeFilter === 'all'
    ? allTemplates
    : activeFilter === 'custom'
      ? allTemplates.filter(t => 'isPreset' in t && !t.isPreset)
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
  const handleCopyTemplate = (template: typeof presetTemplates[0] | CustomTemplate) => {
    const newId = `custom-${Date.now()}`

    // For preset templates, we need to get the full template data
    // For custom templates, load from localStorage
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
    const templates = JSON.parse(saved)

    let sourceData: Record<string, unknown>

    if ('isPreset' in template && !template.isPreset) {
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

    // Update UI
    setCustomTemplates([...customTemplates, {
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

    setCustomTemplates(customTemplates.filter(t => t.id !== id))
  }

  const getFilterCount = (type: 'all' | 'holiday' | 'marketing' | 'newsletter' | 'custom') => {
    if (type === 'all') return allTemplates.length
    if (type === 'custom') return customTemplates.length
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
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onCopy={() => handleCopyTemplate(template)}
            onDelete={'isPreset' in template && !template.isPreset ? () => handleDeleteTemplate(template.id) : undefined}
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
  onClick
}: {
  label: string
  count: number
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 transition-all ${
        active
          ? 'bg-black text-white border-black'
          : 'bg-white text-black border-black hover:bg-gray-100'
      }`}
    >
      {label}
      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
        active ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    </button>
  )
}

function TemplateCard({
  template,
  onCopy,
  onDelete
}: {
  template: typeof presetTemplates[0] | CustomTemplate
  onCopy: () => void
  onDelete?: () => void
}) {
  const TypeIcon = typeIcons[template.type as keyof typeof typeIcons]
  const isCustom = 'isPreset' in template && !template.isPreset
  const isSynced = isCustom && 'resendTemplateId' in template && template.resendTemplateId

  return (
    <Card className="neo-border neo-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className={`${template.color} h-40 flex items-center justify-center relative`}>
        <span className="text-6xl">{template.thumbnail}</span>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {/* Custom badge */}
          {isCustom && (
            <div className="bg-black text-white text-xs px-2 py-1 font-bold uppercase">
              Custom
            </div>
          )}
          {/* Synced badge */}
          {isSynced && (
            <div
              className="bg-green-500 text-white text-xs px-2 py-1 font-bold uppercase flex items-center gap-1"
              title={`Synced: ${(template as CustomTemplate).syncedAt ? new Date((template as CustomTemplate).syncedAt!).toLocaleString() : 'Unknown'}`}
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
