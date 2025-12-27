'use client'

import Link from 'next/link'
import { Plus, Gift, Megaphone, Newspaper, Edit, Copy, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 预设模板数据
const presetTemplates = [
  {
    id: 'christmas-classic',
    name: 'Classic Christmas',
    type: 'holiday',
    description: 'Neobrutalism-styled Christmas greeting',
    thumbnail: '🎄',
    color: 'bg-neo-red',
  },
  {
    id: 'new-year-2025',
    name: 'New Year 2025',
    type: 'holiday',
    description: 'Celebrate the new year in style',
    thumbnail: '🎆',
    color: 'bg-purple-500',
  },
  {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    type: 'holiday',
    description: 'Traditional red and gold theme',
    thumbnail: '🧧',
    color: 'bg-red-600',
  },
  {
    id: 'birthday',
    name: 'Birthday Wishes',
    type: 'holiday',
    description: 'Colorful birthday celebration',
    thumbnail: '🎂',
    color: 'bg-pink-500',
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    type: 'marketing',
    description: 'Announce your new product',
    thumbnail: '🚀',
    color: 'bg-neo-gold',
  },
  {
    id: 'newsletter',
    name: 'Weekly Newsletter',
    type: 'newsletter',
    description: 'Clean and professional digest',
    thumbnail: '📰',
    color: 'bg-neo-green',
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
        <Button className="neo-button bg-neo-green text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8">
        <FilterTab label="All" count={presetTemplates.length} active />
        <FilterTab
          label="Holiday"
          count={presetTemplates.filter(t => t.type === 'holiday').length}
        />
        <FilterTab
          label="Marketing"
          count={presetTemplates.filter(t => t.type === 'marketing').length}
        />
        <FilterTab
          label="Newsletter"
          count={presetTemplates.filter(t => t.type === 'newsletter').length}
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presetTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}

function FilterTab({
  label,
  count,
  active = false
}: {
  label: string
  count: number
  active?: boolean
}) {
  return (
    <button
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
  template
}: {
  template: typeof presetTemplates[0]
}) {
  const TypeIcon = typeIcons[template.type as keyof typeof typeIcons]

  return (
    <Card className="neo-border neo-shadow overflow-hidden group">
      {/* Thumbnail */}
      <div className={`${template.color} h-40 flex items-center justify-center relative`}>
        <span className="text-6xl">{template.thumbnail}</span>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/templates/${template.id}/edit`}>
            <Button size="sm" className="neo-button bg-white text-black">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
            <Copy className="w-4 h-4" />
          </Button>
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
