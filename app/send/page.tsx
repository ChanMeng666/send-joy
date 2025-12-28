'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Palette,
  Users,
  Mail,
  Eye,
  Send,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Cloud
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { SmartAlert } from '@/components/shared/SmartAlert'

const EMAILS_SENT_KEY = 'email-platform-emails-sent'

const TEMPLATES_STORAGE_KEY = 'email-platform-templates'
const CONTACTS_STORAGE_KEY = 'email-platform-contacts'
const SETTINGS_STORAGE_KEY = 'email-platform-settings'

interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface Block {
  id: string
  type: string
  props: Record<string, unknown>
  visible?: boolean
}

interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  borderColor: string
  borderWidth: number
  shadowOffset: number
}

interface TemplateData {
  id: string
  name: string
  type: string
  subject: string
  blocks: Block[]
  theme: Theme
  // Resend sync fields
  resendTemplateId?: string
  syncedAt?: string
  isPublished?: boolean
}

// Preset template data (same as in editor)
const presetTemplateData: Record<string, TemplateData> = {
  'christmas-classic': {
    id: 'christmas-classic',
    name: 'Classic Christmas',
    type: 'holiday',
    subject: 'Merry Christmas & Happy New Year!',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'Merry Christmas', subtitle: "Season's Greetings" }, visible: true },
      { id: 'image-1', type: 'image', props: { src: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600', alt: 'Christmas Scene' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nAs the holiday season approaches, we want to take a moment to express our heartfelt gratitude for your continued support throughout the year.' }, visible: true },
      { id: 'wishes-1', type: 'wishes', props: { title: 'Our Wishes for You', items: [{ icon: '🎄', text: 'Joy and happiness' }, { icon: '🌟', text: 'Peace and prosperity' }, { icon: '❄️', text: 'Magical moments with loved ones' }] }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'Warm Regards', senderName: '{{senderName}}' }, visible: true },
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
  },
  'new-year-2025': {
    id: 'new-year-2025',
    name: 'New Year 2025',
    type: 'holiday',
    subject: 'Happy New Year 2025!',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'Happy 2025', subtitle: 'New Year Wishes' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nAs we welcome the new year, we wish you endless opportunities, good health, and abundant happiness in 2025!' }, visible: true },
      { id: 'wishes-1', type: 'wishes', props: { title: 'New Year Blessings', items: [{ icon: '🎆', text: 'New adventures await' }, { icon: '✨', text: 'Dreams come true' }, { icon: '🥂', text: 'Cheers to success' }] }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'Best Wishes', senderName: '{{senderName}}' }, visible: true },
    ],
    theme: {
      primaryColor: '#7C3AED',
      secondaryColor: '#F59E0B',
      accentColor: '#EC4899',
      backgroundColor: '#1a1a2e',
      surfaceColor: '#FFFBEB',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 4,
      shadowOffset: 8,
    },
  },
  'chinese-new-year': {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    type: 'holiday',
    subject: 'Happy Chinese New Year!',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'Happy Lunar New Year', subtitle: 'Year of the Snake' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nWishing you prosperity, good fortune, and happiness in the Year of the Snake!' }, visible: true },
      { id: 'wishes-1', type: 'wishes', props: { title: 'New Year Blessings', items: [{ icon: '🧧', text: 'Prosperity and wealth' }, { icon: '🐍', text: 'Good health' }, { icon: '🏮', text: 'Family harmony' }] }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'Gong Xi Fa Cai', senderName: '{{senderName}}' }, visible: true },
    ],
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#F59E0B',
      accentColor: '#EAB308',
      backgroundColor: '#1a1a2e',
      surfaceColor: '#FEF3C7',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 4,
      shadowOffset: 8,
    },
  },
  'birthday': {
    id: 'birthday',
    name: 'Birthday Wishes',
    type: 'holiday',
    subject: 'Happy Birthday!',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'Happy Birthday!', subtitle: 'Celebrate Your Day' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nWishing you a fantastic birthday filled with love, laughter, and all your favorite things!' }, visible: true },
      { id: 'wishes-1', type: 'wishes', props: { title: 'Birthday Wishes', items: [{ icon: '🎂', text: 'Endless joy' }, { icon: '🎈', text: 'Beautiful memories' }, { icon: '🎁', text: 'All your wishes come true' }] }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'With Love', senderName: '{{senderName}}' }, visible: true },
    ],
    theme: {
      primaryColor: '#EC4899',
      secondaryColor: '#8B5CF6',
      accentColor: '#F59E0B',
      backgroundColor: '#1a1a2e',
      surfaceColor: '#FDF4FF',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 4,
      shadowOffset: 8,
    },
  },
  'product-launch': {
    id: 'product-launch',
    name: 'Product Launch',
    type: 'marketing',
    subject: 'Introducing Our Latest Innovation!',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'New Product Launch', subtitle: 'Be the First to Know' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nWe are excited to announce our latest product! Be among the first to experience innovation at its finest.' }, visible: true },
      { id: 'button-1', type: 'button', props: { text: 'Learn More', url: 'https://example.com' }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'From', senderName: '{{senderName}}' }, visible: true },
    ],
    theme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#3B82F6',
      accentColor: '#10B981',
      backgroundColor: '#1a1a2e',
      surfaceColor: '#FFFBEB',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 4,
      shadowOffset: 8,
    },
  },
  'newsletter': {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    type: 'newsletter',
    subject: 'Your Weekly Update',
    blocks: [
      { id: 'header-1', type: 'header', props: { title: 'Weekly Newsletter', subtitle: 'Your Weekly Digest' }, visible: true },
      { id: 'text-1', type: 'text', props: { content: 'Dear {{recipientName}},\n\nHere are this week\'s highlights and updates you don\'t want to miss!' }, visible: true },
      { id: 'divider-1', type: 'divider', props: {}, visible: true },
      { id: 'text-2', type: 'text', props: { content: 'Stay tuned for more exciting updates coming soon.' }, visible: true },
      { id: 'footer-1', type: 'footer', props: { senderLabel: 'Best', senderName: '{{senderName}}' }, visible: true },
    ],
    theme: {
      primaryColor: '#16A34A',
      secondaryColor: '#3B82F6',
      accentColor: '#F59E0B',
      backgroundColor: '#1a1a2e',
      surfaceColor: '#F0FDF4',
      textColor: '#000000',
      borderColor: '#000000',
      borderWidth: 4,
      shadowOffset: 8,
    },
  },
}

const steps = [
  { id: 1, name: 'Template', icon: Palette },
  { id: 2, name: 'Recipients', icon: Users },
  { id: 3, name: 'Subject', icon: Mail },
  { id: 4, name: 'Preview', icon: Eye },
  { id: 5, name: 'Send', icon: Send },
]

export default function SendPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [templates, setTemplates] = useState<{ id: string; name: string; emoji: string; resendTemplateId?: string; syncedAt?: string }[]>([])

  // Load contacts and templates from localStorage
  useEffect(() => {
    // Load contacts
    const savedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY)
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts))
      } catch (e) {
        console.error('Failed to load contacts:', e)
      }
    }

    // Load custom templates and combine with presets
    const templateList: { id: string; name: string; emoji: string; resendTemplateId?: string; syncedAt?: string }[] = [
      { id: 'christmas-classic', name: 'Classic Christmas', emoji: '🎄' },
      { id: 'new-year-2025', name: 'New Year 2025', emoji: '🎆' },
      { id: 'chinese-new-year', name: 'Chinese New Year', emoji: '🧧' },
      { id: 'birthday', name: 'Birthday Wishes', emoji: '🎂' },
      { id: 'product-launch', name: 'Product Launch', emoji: '🚀' },
      { id: 'newsletter', name: 'Newsletter', emoji: '📰' },
    ]

    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (savedTemplates) {
      try {
        const customTemplates = JSON.parse(savedTemplates)
        Object.entries(customTemplates).forEach(([id, data]) => {
          const template = data as { name?: string; resendTemplateId?: string; syncedAt?: string }
          if (!templateList.find(t => t.id === id)) {
            templateList.push({
              id,
              name: template.name || 'Custom Template',
              emoji: '✨',
              resendTemplateId: template.resendTemplateId,
              syncedAt: template.syncedAt,
            })
          }
        })
      } catch (e) {
        console.error('Failed to load templates:', e)
      }
    }

    setTemplates(templateList)
  }, [])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null
      case 2:
        return selectedContacts.length > 0
      case 3:
        return subject.trim().length > 0
      default:
        return true
    }
  }

  const getSelectedContacts = () => {
    return contacts.filter(c => selectedContacts.includes(c.id))
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
          Send Email
        </h1>
        <p className="text-gray-600">
          Follow the wizard to send your email campaign
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-none neo-border
                ${currentStep > step.id
                  ? 'bg-neo-green text-white'
                  : currentStep === step.id
                    ? 'bg-neo-red text-white'
                    : 'bg-white text-gray-400'
                }
              `}>
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep >= step.id ? 'text-black' : 'text-gray-400'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-1 w-12 ${
                  currentStep > step.id ? 'bg-neo-green' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="neo-border neo-shadow p-8 mb-8">
        {currentStep === 1 && (
          <StepTemplate
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
            templates={templates}
          />
        )}
        {currentStep === 2 && (
          <StepRecipients
            contacts={contacts}
            selected={selectedContacts}
            onSelect={setSelectedContacts}
          />
        )}
        {currentStep === 3 && (
          <StepSubject
            value={subject}
            onChange={setSubject}
            templateId={selectedTemplate}
          />
        )}
        {currentStep === 4 && (
          <StepPreview
            templateId={selectedTemplate}
            contacts={getSelectedContacts()}
            subject={subject}
          />
        )}
        {currentStep === 5 && (
          <StepSend
            templateId={selectedTemplate}
            contacts={getSelectedContacts()}
            subject={subject}
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="neo-border"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 5 && (
          <Button
            className="neo-button bg-neo-red text-white"
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

function StepTemplate({
  selected,
  onSelect,
  templates
}: {
  selected: string | null
  onSelect: (id: string) => void
  templates: { id: string; name: string; emoji: string; resendTemplateId?: string; syncedAt?: string }[]
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-3 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`p-6 neo-border text-center transition-all relative ${
              selected === template.id
                ? 'bg-neo-cream neo-shadow-green'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {/* Sync badge */}
            {template.resendTemplateId && (
              <div
                className="absolute top-2 right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 flex items-center gap-1 rounded-sm"
                title={`Synced: ${template.syncedAt ? new Date(template.syncedAt).toLocaleString() : 'Unknown'}`}
              >
                <Cloud className="w-3 h-3" />
              </div>
            )}
            <span className="text-4xl block mb-2">{template.emoji}</span>
            <span className="font-bold">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepRecipients({
  contacts,
  selected,
  onSelect
}: {
  contacts: Contact[]
  selected: string[]
  onSelect: (ids: string[]) => void
}) {
  const toggleContact = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter(i => i !== id))
    } else {
      onSelect([...selected, id])
    }
  }

  const toggleAll = () => {
    if (selected.length === contacts.length) {
      onSelect([])
    } else {
      onSelect(contacts.map(c => c.id))
    }
  }

  if (contacts.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Select Recipients</h2>
        <SmartAlert errorCode="NO_CONTACTS" className="mb-4" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Select Recipients</h2>
        <Button
          variant="outline"
          size="sm"
          className="neo-border"
          onClick={toggleAll}
        >
          {selected.length === contacts.length ? 'Deselect All' : 'Select All'}
        </Button>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {contacts.map(contact => (
          <button
            key={contact.id}
            onClick={() => toggleContact(contact.id)}
            className={`w-full flex items-center gap-3 p-3 neo-border transition-all ${
              selected.includes(contact.id)
                ? 'bg-neo-cream neo-shadow-green'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 neo-border flex items-center justify-center ${
              selected.includes(contact.id) ? 'bg-neo-green text-white' : 'bg-white'
            }`}>
              {selected.includes(contact.id) && <Check className="w-4 h-4" />}
            </div>
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{contact.email}</span>
            {(contact.firstName || contact.lastName) && (
              <span className="text-gray-500">
                ({contact.firstName} {contact.lastName})
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {selected.length} of {contacts.length} contacts selected
      </p>
    </div>
  )
}

function StepSubject({
  value,
  onChange,
  templateId
}: {
  value: string
  onChange: (v: string) => void
  templateId: string | null
}) {
  // Set default subject from template when component mounts
  useEffect(() => {
    if (!value && templateId) {
      const preset = presetTemplateData[templateId]
      if (preset) {
        onChange(preset.subject)
      } else {
        // Check custom templates
        const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
        if (saved) {
          try {
            const templates = JSON.parse(saved)
            if (templates[templateId]?.subject) {
              onChange(templates[templateId].subject)
            }
          } catch (e) {
            console.error('Failed to load template subject:', e)
          }
        }
      }
    }
  }, [templateId, value, onChange])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Email Subject</h2>
      <Input
        placeholder="Enter email subject..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="neo-border text-lg p-4"
      />
      <p className="text-gray-500 text-sm mt-2">
        Tip: Use {"{{recipientName}}"} to personalize the subject
      </p>
    </div>
  )
}

function StepPreview({
  templateId,
  contacts,
  subject
}: {
  templateId: string | null
  contacts: Contact[]
  subject: string
}) {
  const [previewHtml, setPreviewHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [settings, setSettings] = useState<{ senderName?: string }>({})

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }

    if (contacts.length > 0) {
      setSelectedContact(contacts[0])
    }
  }, [contacts])

  useEffect(() => {
    if (!templateId || !selectedContact) return

    const loadPreview = async () => {
      setLoading(true)

      // Get template data - prioritize localStorage (user modifications) over presets
      let blocks: Block[] = []
      let theme: Theme | null = null
      let foundInStorage = false

      // First, try to load from localStorage (saved user modifications)
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
      if (saved) {
        try {
          const templates = JSON.parse(saved)
          if (templates[templateId]) {
            blocks = templates[templateId].blocks || []
            theme = templates[templateId].theme
            foundInStorage = true
          }
        } catch (e) {
          console.error('Failed to load template from localStorage:', e)
        }
      }

      // If not found in localStorage, use preset data
      if (!foundInStorage && presetTemplateData[templateId]) {
        blocks = presetTemplateData[templateId].blocks
        theme = presetTemplateData[templateId].theme
      }

      try {
        const response = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks,
            theme,
            variables: {
              recipientName: selectedContact.firstName || selectedContact.email.split('@')[0],
              senderName: settings.senderName || 'Your Name',
            },
          }),
        })

        const data = await response.json()
        if (data.success) {
          setPreviewHtml(data.html)
        } else {
          setPreviewHtml('<p style="color:red;padding:20px;">Failed to render preview</p>')
        }
      } catch (e) {
        console.error('Preview error:', e)
        setPreviewHtml('<p style="color:red;padding:20px;">Failed to render preview</p>')
      } finally {
        setLoading(false)
      }
    }

    loadPreview()
  }, [templateId, selectedContact, settings])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preview</h2>

      {/* Contact selector for preview */}
      {contacts.length > 1 && (
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Preview for:</label>
          <select
            className="neo-border p-2 w-full max-w-xs"
            value={selectedContact?.id || ''}
            onChange={(e) => {
              const contact = contacts.find(c => c.id === e.target.value)
              if (contact) setSelectedContact(contact)
            }}
          >
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.firstName || contact.email} ({contact.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Subject preview */}
      <div className="mb-4 p-3 bg-gray-100 neo-border">
        <span className="text-sm font-medium">Subject: </span>
        <span>{subject.replace(/\{\{recipientName\}\}/g, selectedContact?.firstName || selectedContact?.email.split('@')[0] || 'Friend')}</span>
      </div>

      {/* Email preview */}
      <div className="neo-border bg-gray-100" style={{ height: '400px' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full"
            title="Email Preview"
          />
        )}
      </div>
    </div>
  )
}

function StepSend({
  templateId,
  contacts,
  subject
}: {
  templateId: string | null
  contacts: Contact[]
  subject: string
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [results, setResults] = useState<{ email: string; success: boolean; error?: string }[]>([])
  const [progress, setProgress] = useState(0)
  const [settings, setSettings] = useState<{ resendApiKey?: string; senderEmail?: string; senderName?: string }>({})
  const [error, setError] = useState<string | null>(null)
  const [templateData, setTemplateData] = useState<TemplateData | null>(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }

    // Load template data to check for Resend sync status
    // Prioritize localStorage (user modifications) over presets
    if (templateId) {
      let foundInStorage = false
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
      if (saved) {
        try {
          const templates = JSON.parse(saved)
          if (templates[templateId]) {
            setTemplateData(templates[templateId])
            foundInStorage = true
          }
        } catch (e) {
          console.error('Failed to load template:', e)
        }
      }

      if (!foundInStorage && presetTemplateData[templateId]) {
        setTemplateData(presetTemplateData[templateId])
      }
    }
  }, [templateId])

  const handleSend = async () => {
    if (!settings.resendApiKey) {
      setError('Please configure your Resend API Key in Settings')
      return
    }
    if (!settings.senderEmail) {
      setError('Please configure your sender email in Settings')
      return
    }

    setSending(true)
    setError(null)
    setResults([])
    setProgress(0)

    // Get template data - prioritize localStorage (user modifications) over presets
    let blocks: Block[] = []
    let theme: Theme | null = null
    let foundInStorage = false

    // First, try to load from localStorage (saved user modifications)
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (saved) {
      try {
        const templates = JSON.parse(saved)
        if (templates[templateId!]) {
          blocks = templates[templateId!].blocks || []
          theme = templates[templateId!].theme
          foundInStorage = true
        }
      } catch (e) {
        console.error('Failed to load template from localStorage:', e)
      }
    }

    // If not found in localStorage, use preset data
    if (!foundInStorage && presetTemplateData[templateId!]) {
      blocks = presetTemplateData[templateId!].blocks
      theme = presetTemplateData[templateId!].theme
    }

    const sendResults: { email: string; success: boolean; error?: string }[] = []

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i]
      const recipientName = contact.firstName || contact.email.split('@')[0]

      try {
        // Render personalized HTML
        const previewResponse = await fetch('/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks,
            theme,
            variables: {
              recipientName,
              senderName: settings.senderName || 'Your Name',
            },
          }),
        })

        const previewData = await previewResponse.json()
        if (!previewData.success) {
          throw new Error('Failed to render email')
        }

        // Send email
        const sendResponse = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: settings.resendApiKey,
            from: settings.senderEmail,
            to: contact.email,
            subject: subject.replace(/\{\{recipientName\}\}/g, recipientName),
            html: previewData.html,
          }),
        })

        const sendData = await sendResponse.json()

        if (sendData.success) {
          sendResults.push({ email: contact.email, success: true })
        } else {
          sendResults.push({ email: contact.email, success: false, error: sendData.error })
        }
      } catch (e) {
        sendResults.push({
          email: contact.email,
          success: false,
          error: e instanceof Error ? e.message : 'Unknown error',
        })
      }

      setProgress(Math.round(((i + 1) / contacts.length) * 100))
      setResults([...sendResults])

      // Add delay between emails to avoid rate limiting
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }

    setSending(false)
    setSent(true)

    // Track successful sends for progress tracking
    const successfulSends = sendResults.filter(r => r.success).length
    if (successfulSends > 0) {
      try {
        const current = parseInt(localStorage.getItem(EMAILS_SENT_KEY) || '0', 10)
        localStorage.setItem(EMAILS_SENT_KEY, String(current + successfulSends))
      } catch (e) {
        console.error('Failed to track emails sent:', e)
      }
    }
  }

  if (!sent) {
    return (
      <div className="text-center">
        {error && (
          <SmartAlert
            message={{
              title: 'Configuration Required',
              description: error,
              severity: 'error',
              action: { text: 'Go to Settings', href: '/settings' },
            }}
            className="mb-6 text-left"
          />
        )}

        {!settings.resendApiKey && !error && (
          <SmartAlert errorCode="API_KEY_MISSING" className="mb-6 text-left" />
        )}

        <Send className="w-16 h-16 mx-auto mb-4 text-neo-green" />
        <h2 className="text-xl font-bold mb-2">Ready to Send</h2>
        <p className="text-gray-600 mb-6">
          You are about to send emails to {contacts.length} recipient{contacts.length !== 1 ? 's' : ''}
        </p>

        <div className="bg-gray-50 p-4 neo-border inline-block text-left mb-6">
          <p className="font-mono text-sm">
            <strong>From:</strong> {settings.senderEmail || 'Not configured'}<br />
            <strong>Subject:</strong> {subject}<br />
            <strong>Recipients:</strong> {contacts.length}
            {templateData?.resendTemplateId && (
              <>
                <br />
                <span className="inline-flex items-center gap-1 text-green-600">
                  <Cloud className="w-3 h-3" />
                  <strong>Synced to Resend</strong>
                  {templateData.isPublished && ' (Published)'}
                </span>
              </>
            )}
          </p>
        </div>

        {sending ? (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neo-red" />
            <p className="text-gray-600">Sending emails... {progress}%</p>
            <div className="w-full bg-gray-200 h-2 neo-border">
              <div
                className="bg-neo-green h-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <Button
            className="neo-button bg-neo-green text-white"
            onClick={handleSend}
            disabled={!settings.resendApiKey || !settings.senderEmail}
          >
            <Send className="w-4 h-4 mr-2" />
            Send {contacts.length} Email{contacts.length !== 1 ? 's' : ''}
          </Button>
        )}
      </div>
    )
  }

  // Results view
  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return (
    <div>
      <div className="text-center mb-6">
        {failCount === 0 ? (
          <>
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-neo-green" />
            <h2 className="text-xl font-bold mb-2">All Emails Sent!</h2>
            <p className="text-gray-600">
              Successfully sent {successCount} email{successCount !== 1 ? 's' : ''}
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-bold mb-2">Sending Complete</h2>
            <p className="text-gray-600">
              {successCount} succeeded, {failCount} failed
            </p>
          </>
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 neo-border ${
              result.success ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{result.email}</span>
            {result.error && (
              <span className="text-red-600 text-sm ml-auto">{result.error}</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/">
          <Button className="neo-button bg-neo-green text-white">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
