'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const blockTypes = [
  { type: 'header', icon: Type, label: 'Header' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'button', icon: MousePointer2, label: 'Button' },
  { type: 'wishes', icon: List, label: 'Wishes List' },
  { type: 'divider', icon: Minus, label: 'Divider' },
]

interface Block {
  id: string
  type: string
  props: Record<string, unknown>
}

export default function TemplateEditorPage() {
  const params = useParams()
  const templateId = params.id as string

  const [blocks, setBlocks] = useState<Block[]>([
    { id: '1', type: 'header', props: { title: 'Merry Christmas', subtitle: "Season's Greetings" } },
    { id: '2', type: 'image', props: { src: '', alt: 'Hero Image' } },
    { id: '3', type: 'text', props: { content: 'Dear {{recipientName}},' } },
    { id: '4', type: 'wishes', props: { title: 'My Wishes', items: [] } },
    { id: '5', type: 'footer', props: { senderName: 'Your Name' } },
  ])

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  const selectedBlock = blocks.find(b => b.id === selectedBlockId)

  const handleAddBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      props: {},
    }
    setBlocks([...blocks, newBlock])
    setSelectedBlockId(newBlock.id)
  }

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
    if (selectedBlockId === id) {
      setSelectedBlockId(null)
    }
  }

  const handleUpdateBlock = (id: string, props: Record<string, unknown>) => {
    setBlocks(blocks.map(b =>
      b.id === id ? { ...b, props: { ...b.props, ...props } } : b
    ))
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
            <h1 className="font-bold text-lg">Edit Template</h1>
            <span className="text-sm text-gray-500">{templateId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button variant="ghost" size="icon">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
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

          {/* Preview & Save */}
          <Button variant="outline" className="neo-border">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="neo-button bg-neo-green text-white">
            <Save className="w-4 h-4 mr-2" />
            Save
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
            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
                    selectedBlockId === block.id
                      ? 'bg-neo-cream neo-border'
                      : 'hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  <span className="text-sm flex-1">{block.type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteBlock(block.id)
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
              {blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`relative p-4 cursor-pointer transition-all ${
                    selectedBlockId === block.id
                      ? 'ring-2 ring-neo-red ring-offset-2'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <BlockPreview block={block} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l-4 border-black bg-white overflow-y-auto">
          <div className="p-4">
            {selectedBlock ? (
              <>
                <h3 className="font-bold text-sm uppercase tracking-wide mb-4">
                  Edit {selectedBlock.type}
                </h3>
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
                <ThemeEditor />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case 'header':
      return (
        <div className="bg-neo-red text-white p-8 text-center">
          <p className="text-sm uppercase tracking-wider mb-2">
            {(block.props.subtitle as string) || "Season's Greetings"}
          </p>
          <h1 className="text-3xl font-black uppercase">
            {(block.props.title as string) || 'Merry Christmas'}
          </h1>
        </div>
      )
    case 'text':
      return (
        <div className="p-4">
          <p>{(block.props.content as string) || 'Enter your text here...'}</p>
        </div>
      )
    case 'image':
      return (
        <div className="p-4">
          <div className="bg-gray-200 h-40 flex items-center justify-center neo-border">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )
    case 'button':
      return (
        <div className="p-4 text-center">
          <button className="neo-button bg-neo-green text-white px-6 py-2">
            {(block.props.text as string) || 'Click Here'}
          </button>
        </div>
      )
    case 'wishes':
      return (
        <div className="p-4 bg-neo-cream">
          <h3 className="font-bold mb-2">{(block.props.title as string) || 'My Wishes'}</h3>
          <ul className="space-y-1">
            <li>⭐ Wish item 1</li>
            <li>⭐ Wish item 2</li>
            <li>⭐ Wish item 3</li>
          </ul>
        </div>
      )
    case 'divider':
      return <hr className="border-t-4 border-black my-4" />
    case 'footer':
      return (
        <div className="bg-neo-green text-white p-6 text-center">
          <p className="font-bold">{(block.props.senderName as string) || 'Your Name'}</p>
        </div>
      )
    default:
      return <div className="p-4 bg-gray-100">Unknown block type</div>
  }
}

function BlockEditor({ block, onUpdate }: { block: Block, onUpdate: (props: Record<string, unknown>) => void }) {
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
              className="w-full neo-border p-2 mt-1 min-h-[100px]"
            />
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
          <p className="text-sm text-gray-500">
            Wish items can be edited in the full editor
          </p>
        </div>
      )
    case 'footer':
      return (
        <div className="space-y-4">
          <div>
            <Label>Sender Name</Label>
            <Input
              value={(block.props.senderName as string) || ''}
              onChange={(e) => onUpdate({ senderName: e.target.value })}
              className="neo-border mt-1"
            />
          </div>
        </div>
      )
    default:
      return <p className="text-gray-500">No properties for this block</p>
  }
}

function ThemeEditor() {
  return (
    <div className="space-y-4">
      <div>
        <Label>Primary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input defaultValue="#DC2626" className="neo-border" />
          <div className="w-10 h-10 bg-neo-red neo-border flex-shrink-0" />
        </div>
      </div>
      <div>
        <Label>Secondary Color</Label>
        <div className="flex gap-2 mt-1">
          <Input defaultValue="#16A34A" className="neo-border" />
          <div className="w-10 h-10 bg-neo-green neo-border flex-shrink-0" />
        </div>
      </div>
      <div>
        <Label>Accent Color</Label>
        <div className="flex gap-2 mt-1">
          <Input defaultValue="#F59E0B" className="neo-border" />
          <div className="w-10 h-10 bg-neo-gold neo-border flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
