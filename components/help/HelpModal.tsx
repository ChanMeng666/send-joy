'use client'

import { X, ExternalLink, AlertTriangle, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HelpTopic } from '@/lib/help-content'

interface HelpModalProps {
  topic: HelpTopic
  onClose: () => void
}

export function HelpModal({ topic, onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-white neo-border neo-shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-4 border-black p-4 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tight pr-8">
            {topic.title}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Simple explanation */}
          <div className="p-4 bg-neo-cream neo-border">
            <p className="text-gray-700">{topic.simple}</p>
          </div>

          {/* Detailed body */}
          {topic.body && (
            <div className="text-sm text-gray-600 whitespace-pre-line">
              {topic.body}
            </div>
          )}

          {/* Steps */}
          {topic.steps && topic.steps.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">
                Step-by-Step Guide
              </h3>
              <div className="space-y-2">
                {topic.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 p-3 neo-border ${
                      step.highlight ? 'bg-amber-50 border-amber-400' : 'bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 flex-shrink-0 flex items-center justify-center neo-border text-xs font-bold ${
                        step.highlight
                          ? 'bg-amber-400 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{step.text}</p>
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-xs text-neo-red hover:underline font-medium"
                        >
                          Open Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          {topic.warning && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 neo-border border-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{topic.warning}</p>
            </div>
          )}

          {/* Tip */}
          {topic.tip && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 neo-border border-blue-300">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">{topic.tip}</p>
            </div>
          )}

          {/* Optional badge */}
          {topic.optional && (
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium neo-border">
              This field is optional
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t-4 border-black p-4">
          <Button
            onClick={onClose}
            className="neo-button bg-neo-red text-white w-full"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  )
}
