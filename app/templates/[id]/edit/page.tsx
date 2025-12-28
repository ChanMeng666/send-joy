'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowLeft,
  Save,
  Eye,
  Undo,
  Redo,
  Monitor,
  Smartphone,
  Plus,
  GripVertical,
  Trash2,
  Type,
  Image,
  MousePointer2,
  List,
  Minus,
  FileSignature,
  Check,
  X,
  Loader2,
  Cloud,
  CloudOff,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const TEMPLATES_STORAGE_KEY = 'email-platform-templates'

const blockTypes = [
  { type: 'header', icon: Type, label: 'Header' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'button', icon: MousePointer2, label: 'Button' },
  { type: 'wishes', icon: List, label: 'Wishes List' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'footer', icon: FileSignature, label: 'Footer' },
]

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
  createdAt?: string
}

// Preset template configurations
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

const defaultTheme: Theme = {
  primaryColor: '#DC2626',
  secondaryColor: '#16A34A',
  accentColor: '#F59E0B',
  backgroundColor: '#1a1a2e',
  surfaceColor: '#FFFBEB',
  textColor: '#000000',
  borderColor: '#000000',
  borderWidth: 4,
  shadowOffset: 8,
}

// Sortable Block Item Component
function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onDelete,
}: {
  block: Block
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-neo-cream neo-border'
          : 'hover:bg-gray-100 border-2 border-transparent'
      } ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <span className="text-sm flex-1 capitalize">{block.type}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function TemplateEditorPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id as string

  const [templateName, setTemplateName] = useState('New Template')
  const [templateSubject, setTemplateSubject] = useState('Email Subject')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Resend sync state
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [resendTemplateId, setResendTemplateId] = useState<string | null>(null)
  const [syncedAt, setSyncedAt] = useState<string | null>(null)
  const [isPublished, setIsPublished] = useState(false)

  // Undo/Redo history
  const [history, setHistory] = useState<Block[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load template data
  useEffect(() => {
    // First, try to load from localStorage (saved user modifications)
    const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY)
    if (saved) {
      try {
        const templates = JSON.parse(saved)
        if (templates[templateId]) {
          const template = templates[templateId]
          setTemplateName(template.name || 'Untitled')
          setTemplateSubject(template.subject || 'Email Subject')
          setBlocks(template.blocks || [])
          setTheme({ ...defaultTheme, ...template.theme })
          setHistory([template.blocks || []])
          setHistoryIndex(0)
          // Load Resend sync fields
          if (template.resendTemplateId) setResendTemplateId(template.resendTemplateId)
          if (template.syncedAt) setSyncedAt(template.syncedAt)
          if (template.isPublished) setIsPublished(template.isPublished)
          if (template.resendTemplateId && template.syncedAt) setSyncStatus('synced')
          return // Found saved template, stop here
        }
      } catch (e) {
        console.error('Failed to load template from localStorage:', e)
      }
    }

    // If no saved version found, check if it's a preset template
    if (presetTemplateData[templateId]) {
      const preset = presetTemplateData[templateId]
      setTemplateName(preset.name)
      setTemplateSubject(preset.subject)
      setBlocks(preset.blocks)
      setTheme(preset.theme)
      setHistory([preset.blocks])
      setHistoryIndex(0)
    }
  }, [templateId])

  // Add to history
  const addToHistory = useCallback((newBlocks: Block[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newBlocks)
      return newHistory.slice(-50) // Keep last 50 states
    })
    setHistoryIndex(prev => Math.min(prev + 1, 49))
  }, [historyIndex])

  // Handle drag end to reorder blocks
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id)
      const newIndex = blocks.findIndex((block) => block.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)
      addToHistory(newBlocks)
    }
  }, [blocks, addToHistory])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setBlocks(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setBlocks(history[historyIndex + 1])
    }
  }

  const handleAddBlock = (type: string) => {
    const defaultProps: Record<string, Record<string, unknown>> = {
      header: { title: 'Your Title', subtitle: 'Subtitle' },
      text: { content: 'Enter your text here...' },
      image: { src: '', alt: 'Image' },
      button: { text: 'Click Here', url: '#' },
      wishes: { title: 'My Wishes', items: [{ icon: '⭐', text: 'Wish item' }] },
      divider: {},
      footer: { senderLabel: 'Best Regards', senderName: '{{senderName}}' },
    }

    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      props: defaultProps[type] || {},
      visible: true,
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    addToHistory(newBlocks)
    setSelectedBlockId(newBlock.id)
  }

  const handleDeleteBlock = (id: string) => {
    const newBlocks = blocks.filter(b => b.id !== id)
    setBlocks(newBlocks)
    addToHistory(newBlocks)
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
    }
  }

  const handleUpdateBlock = (id: string, props: Record<string, unknown>) => {
    const newBlocks = blocks.map(b =>
      b.id === id ? { ...b, props: { ...b.props, ...props } } : b
    )
    setBlocks(newBlocks)
    addToHistory(newBlocks)
  }

  const handleUpdateTheme = (updates: Partial<Theme>) => {
    setTheme(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    setSaveStatus('saving')

    try {
      const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
      const templates = JSON.parse(saved)

      templates[templateId] = {
        id: templateId,
        name: templateName,
        type: 'holiday',
        subject: templateSubject,
        blocks,
        theme,
        updatedAt: new Date().toISOString(),
        createdAt: templates[templateId]?.createdAt || new Date().toISOString(),
        // Resend sync fields
        resendTemplateId,
        syncedAt,
        isPublished,
      }

      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (e) {
      console.error('Failed to save template:', e)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handlePreview = async () => {
    setPreviewLoading(true)
    setShowPreview(true)

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          theme,
          variables: {
            recipientName: 'John',
            senderName: 'Your Name',
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
      setPreviewLoading(false)
    }
  }

  const handleSyncToResend = async (publish: boolean = true) => {
    // Get API key from settings
    const settingsStr = localStorage.getItem('email-platform-settings')
    if (!settingsStr) {
      alert('Please configure your Resend API key in Settings first.')
      return
    }

    const settings = JSON.parse(settingsStr)
    if (!settings.resendApiKey) {
      alert('Please configure your Resend API key in Settings first.')
      return
    }

    setSyncStatus('syncing')

    try {
      // First, render the template to HTML
      const previewResponse = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks,
          theme,
          variables: {
            recipientName: '{{{RECIPIENT_NAME}}}',
            senderName: '{{{SENDER_NAME}}}',
          },
        }),
      })

      const previewData = await previewResponse.json()
      if (!previewData.success) {
        throw new Error('Failed to render template')
      }

      // Extract variables from template (convert {{var}} to Resend format)
      const resendVariables = [
        { key: 'RECIPIENT_NAME', type: 'string' as const, fallbackValue: 'Friend' },
        { key: 'SENDER_NAME', type: 'string' as const, fallbackValue: 'Your Name' },
      ]

      let result
      if (resendTemplateId) {
        // Update existing template
        const updateResponse = await fetch(`/api/resend-templates/${resendTemplateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: settings.resendApiKey,
            name: templateName,
            html: previewData.html,
          }),
        })
        result = await updateResponse.json()

        // Publish if requested
        if (publish && result.success) {
          await fetch(`/api/resend-templates/${resendTemplateId}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: settings.resendApiKey }),
          })
        }
      } else {
        // Create new template
        const createResponse = await fetch('/api/resend-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: settings.resendApiKey,
            name: templateName,
            html: previewData.html,
            variables: resendVariables,
            publish,
          }),
        })
        result = await createResponse.json()
      }

      if (result.success) {
        const newTemplateId = result.template?.id || resendTemplateId
        const now = new Date().toISOString()

        setResendTemplateId(newTemplateId)
        setSyncedAt(now)
        setIsPublished(publish)
        setSyncStatus('synced')

        // Save to localStorage
        const saved = localStorage.getItem(TEMPLATES_STORAGE_KEY) || '{}'
        const templates = JSON.parse(saved)
        templates[templateId] = {
          ...templates[templateId],
          resendTemplateId: newTemplateId,
          syncedAt: now,
          isPublished: publish,
        }
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))

        setTimeout(() => setSyncStatus('idle'), 2000)
      } else {
        throw new Error(result.error || 'Sync failed')
      }
    } catch (e) {
      console.error('Sync error:', e)
      setSyncStatus('error')
      alert(`Failed to sync: ${e instanceof Error ? e.message : 'Unknown error'}`)
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b-4 border-black bg-white">
        <div className="flex items-center gap-4">
          <Link href="/templates" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="font-bold text-lg border-0 p-0 h-auto focus-visible:ring-0"
            />
            <Input
              value={templateSubject}
              onChange={(e) => setTemplateSubject(e.target.value)}
              className="text-sm text-gray-500 border-0 p-0 h-auto focus-visible:ring-0"
              placeholder="Email subject..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Device Toggle */}
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Preview & Save & Sync */}
          <Button
            variant="outline"
            className="neo-border"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            className="neo-button bg-neo-green text-white"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Sync to Resend */}
          <Button
            variant="outline"
            className={`neo-border ${syncStatus === 'synced' ? 'border-green-500' : ''}`}
            onClick={() => handleSyncToResend(true)}
            disabled={syncStatus === 'syncing'}
            title={syncedAt ? `Last synced: ${new Date(syncedAt).toLocaleString()}` : 'Sync to Resend cloud'}
          >
            {syncStatus === 'syncing' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : syncStatus === 'synced' ? (
              <Cloud className="w-4 h-4 mr-2 text-green-500" />
            ) : resendTemplateId ? (
              <Upload className="w-4 h-4 mr-2" />
            ) : (
              <CloudOff className="w-4 h-4 mr-2" />
            )}
            {syncStatus === 'syncing' ? 'Syncing...' :
             syncStatus === 'synced' ? 'Synced!' :
             resendTemplateId ? 'Update' : 'Sync to Resend'}
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Block Palette */}
        <div className="w-64 border-r-4 border-black bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4">
              Add Blocks
            </h3>
            <div className="space-y-2">
              {blockTypes.map((block) => (
                <button
                  key={block.type}
                  onClick={() => handleAddBlock(block.type)}
                  className="w-full flex items-center gap-3 p-3 neo-border bg-white hover:bg-gray-50 transition-colors"
                >
                  <block.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{block.label}</span>
                  <Plus className="w-4 h-4 ml-auto text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="border-t-4 border-black p-4">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4">
              Blocks in Template
            </h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {blocks.map((block) => (
                    <SortableBlockItem
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onDelete={() => handleDeleteBlock(block.id)}
                    />
                  ))}
                  {blocks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No blocks yet. Add some!
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto p-8">
          <div
            className={`mx-auto bg-white neo-border neo-shadow ${
              deviceMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'
            }`}
          >
            {/* Email Preview */}
            <div className="min-h-[600px]">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-[600px] text-gray-400">
                  <div className="text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <p>Add blocks to start building your template</p>
                  </div>
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`relative cursor-pointer transition-all ${
                      selectedBlockId === block.id
                        ? 'ring-2 ring-neo-red ring-offset-2'
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    <BlockPreview block={block} theme={theme} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l-4 border-black bg-white overflow-y-auto">
          <div className="p-4">
            {selectedBlock ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    Edit {selectedBlock.type}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedBlockId(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <BlockEditor
                  block={selectedBlock}
                  onUpdate={(props) => handleUpdateBlock(selectedBlock.id, props)}
                />
              </>
            ) : (
              <>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-4">
                  Theme Settings
                </h3>
                <ThemeEditor theme={theme} onUpdate={handleUpdateTheme} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white neo-border neo-shadow max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-4 border-black">
              <h3 className="font-bold text-lg">Email Preview</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {previewLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-full min-h-[600px] bg-white"
                  title="Email Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BlockPreview({ block, theme }: { block: Block; theme: Theme }) {
  switch (block.type) {
    case 'header':
      return (
        <div
          className="text-white p-8 text-center"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
            {(block.props.subtitle as string) || "Season's Greetings"}
          </p>
          <h1 className="text-3xl font-black uppercase">
            {(block.props.title as string) || 'Merry Christmas'}
          </h1>
        </div>
      )
    case 'text':
      return (
        <div className="p-6">
          <p className="whitespace-pre-wrap" style={{ color: theme.textColor }}>
            {(block.props.content as string) || 'Enter your text here...'}
          </p>
        </div>
      )
    case 'image':
      const src = block.props.src as string
      return (
        <div className="p-6">
          {src ? (
            <img
              src={src}
              alt={(block.props.alt as string) || 'Image'}
              className="w-full neo-border"
              style={{ boxShadow: `${theme.shadowOffset}px ${theme.shadowOffset}px 0px 0px ${theme.primaryColor}` }}
            />
          ) : (
            <div
              className="h-40 flex items-center justify-center neo-border"
              style={{ backgroundColor: '#E5E7EB' }}
            >
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      )
    case 'button':
      return (
        <div className="p-6 text-center">
          <button
            className="neo-button text-white px-6 py-3 font-bold uppercase"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            {(block.props.text as string) || 'Click Here'}
          </button>
        </div>
      )
    case 'wishes':
      const items = (block.props.items as Array<{ icon: string; text: string }>) || []
      return (
        <div
          className="p-6"
          style={{ backgroundColor: `${theme.primaryColor}15` }}
        >
          <h3 className="font-bold mb-4 text-lg">
            {(block.props.title as string) || 'My Wishes'}
          </h3>
          <ul className="space-y-2">
            {items.length > 0 ? (
              items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))
            ) : (
              <>
                <li>⭐ Wish item 1</li>
                <li>⭐ Wish item 2</li>
                <li>⭐ Wish item 3</li>
              </>
            )}
          </ul>
        </div>
      )
    case 'divider':
      return (
        <hr
          className="my-4 mx-6"
          style={{ borderTopWidth: theme.borderWidth, borderColor: theme.borderColor }}
        />
      )
    case 'footer':
      return (
        <div
          className="text-white p-6 text-center"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <p className="text-sm uppercase tracking-wider mb-1 opacity-80">
            {(block.props.senderLabel as string) || 'Best Regards'}
          </p>
          <p className="font-bold text-xl">
            {(block.props.senderName as string) || 'Your Name'}
          </p>
        </div>
      )
    default:
      return <div className="p-4 bg-gray-100">Unknown block type: {block.type}</div>
  }
}

function BlockEditor({ block, onUpdate }: { block: Block; onUpdate: (props: Record<string, unknown>) => void }) {
  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div>
            <Label>Subtitle</Label>
            <Input
              value={(block.props.subtitle as string) || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={(block.props.title as string) || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
        </div>
      )
    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Content</Label>
            <textarea
              value={(block.props.content as string) || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              className="w-full neo-border p-2 mt-1 min-h-[150px] resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {"{{recipientName}}"} for personalization
            </p>
          </div>
        </div>
      )
    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <Label>Image URL</Label>
            <Input
              value={(block.props.src as string) || ''}
              onChange={(e) => onUpdate({ src: e.target.value })}
              className="neo-border mt-1"
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={(block.props.alt as string) || ''}
              onChange={(e) => onUpdate({ alt: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
        </div>
      )
    case 'button':
      return (
        <div className="space-y-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={(block.props.text as string) || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
          <div>
            <Label>URL</Label>
            <Input
              value={(block.props.url as string) || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              className="neo-border mt-1"
              placeholder="https://..."
            />
          </div>
        </div>
      )
    case 'wishes':
      const items = (block.props.items as Array<{ icon: string; text: string }>) || []
      return (
        <div className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input
              value={(block.props.title as string) || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
          <div>
            <Label>Wish Items</Label>
            <div className="space-y-2 mt-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...newItems[index], icon: e.target.value }
                      onUpdate({ items: newItems })
                    }}
                    className="neo-border w-16"
                    placeholder="Icon"
                  />
                  <Input
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = { ...newItems[index], text: e.target.value }
                      onUpdate({ items: newItems })
                    }}
                    className="neo-border flex-1"
                    placeholder="Wish text"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== index)
                      onUpdate({ items: newItems })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="w-full neo-border"
                onClick={() => {
                  onUpdate({ items: [...items, { icon: '⭐', text: 'New wish' }] })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wish
              </Button>
            </div>
          </div>
        </div>
      )
    case 'footer':
      return (
        <div className="space-y-4">
          <div>
            <Label>Sender Label</Label>
            <Input
              value={(block.props.senderLabel as string) || ''}
              onChange={(e) => onUpdate({ senderLabel: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
          <div>
            <Label>Sender Name</Label>
            <Input
              value={(block.props.senderName as string) || ''}
              onChange={(e) => onUpdate({ senderName: e.target.value })}
              className="neo-border mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {"{{senderName}}"} for personalization
            </p>
          </div>
        </div>
      )
    case 'divider':
      return (
        <p className="text-gray-500 text-sm">
          This is a simple divider. No properties to edit.
        </p>
      )
    default:
      return <p className="text-gray-500">No properties for this block</p>
  }
}

function ThemeEditor({ theme, onUpdate }: { theme: Theme; onUpdate: (updates: Partial<Theme>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Primary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => onUpdate({ primaryColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={theme.primaryColor}
            onChange={(e) => onUpdate({ primaryColor: e.target.value })}
            className="neo-border flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Secondary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={theme.secondaryColor}
            onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={theme.secondaryColor}
            onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
            className="neo-border flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Accent Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={theme.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={theme.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="neo-border flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={theme.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="neo-border flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Surface Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={theme.surfaceColor}
            onChange={(e) => onUpdate({ surfaceColor: e.target.value })}
            className="w-12 h-10 p-1 cursor-pointer"
          />
          <Input
            value={theme.surfaceColor}
            onChange={(e) => onUpdate({ surfaceColor: e.target.value })}
            className="neo-border flex-1"
          />
        </div>
      </div>
      <div>
        <Label>Border Width</Label>
        <Input
          type="number"
          value={theme.borderWidth}
          onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value) || 4 })}
          className="neo-border mt-1"
          min={1}
          max={10}
        />
      </div>
      <div>
        <Label>Shadow Offset</Label>
        <Input
          type="number"
          value={theme.shadowOffset}
          onChange={(e) => onUpdate({ shadowOffset: parseInt(e.target.value) || 8 })}
          className="neo-border mt-1"
          min={0}
          max={20}
        />
      </div>
    </div>
  )
}
