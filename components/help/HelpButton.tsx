'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { getHelpContent } from '@/lib/help-content'
import { HelpModal } from './HelpModal'
import { cn } from '@/lib/utils'

interface HelpButtonProps {
  topic: string
  size?: 'sm' | 'md'
  className?: string
}

export function HelpButton({ topic, size = 'sm', className }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const content = getHelpContent(topic)

  if (!content) {
    console.warn(`Help content not found for topic: ${topic}`)
    return null
  }

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'bg-gray-200 text-gray-600 font-bold',
          'hover:bg-neo-gold hover:text-white',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-neo-gold focus:ring-offset-1',
          sizeClasses[size],
          className
        )}
        title={`Learn more about ${content.title}`}
      >
        ?
      </button>

      {isOpen && (
        <HelpModal
          topic={content}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

// Alternative version using Lucide icon
export function HelpIconButton({ topic, className }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const content = getHelpContent(topic)

  if (!content) {
    console.warn(`Help content not found for topic: ${topic}`)
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center justify-center',
          'text-gray-400 hover:text-neo-gold',
          'transition-colors duration-150',
          'focus:outline-none',
          className
        )}
        title={`Learn more about ${content.title}`}
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <HelpModal
          topic={content}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
