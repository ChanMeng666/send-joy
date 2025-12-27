'use client'

import { useState } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

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
          />
        )}
        {currentStep === 2 && (
          <StepRecipients
            selected={selectedContacts}
            onSelect={setSelectedContacts}
          />
        )}
        {currentStep === 3 && (
          <StepSubject
            value={subject}
            onChange={setSubject}
          />
        )}
        {currentStep === 4 && (
          <StepPreview
            template={selectedTemplate}
            contacts={selectedContacts}
            subject={subject}
          />
        )}
        {currentStep === 5 && (
          <StepSend
            template={selectedTemplate}
            contacts={selectedContacts}
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

        {currentStep < 5 ? (
          <Button
            className="neo-button bg-neo-red text-white"
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="neo-button bg-neo-green text-white"
            disabled={!canProceed()}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Emails
          </Button>
        )}
      </div>
    </div>
  )
}

function StepTemplate({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  const templates = [
    { id: 'christmas-classic', name: 'Classic Christmas', emoji: '🎄' },
    { id: 'new-year-2025', name: 'New Year 2025', emoji: '🎆' },
    { id: 'newsletter', name: 'Newsletter', emoji: '📰' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-3 gap-4">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`p-6 neo-border text-center transition-all ${
              selected === template.id
                ? 'bg-neo-cream neo-shadow-green'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="text-4xl block mb-2">{template.emoji}</span>
            <span className="font-bold">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepRecipients({ selected, onSelect }: { selected: string[], onSelect: (ids: string[]) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Recipients</h2>
      <div className="flex items-center gap-2 p-4 bg-amber-50 border-2 border-amber-200 mb-4">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="text-amber-700">
          Please add contacts first from the Contacts page
        </span>
      </div>
      <Link href="/contacts">
        <Button className="neo-button bg-neo-green text-white">
          Go to Contacts
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  )
}

function StepSubject({ value, onChange }: { value: string, onChange: (v: string) => void }) {
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

function StepPreview({ template, contacts, subject }: { template: string | null, contacts: string[], subject: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preview</h2>
      <div className="bg-gray-100 p-8 neo-border">
        <p className="text-gray-500 text-center">
          Email preview will appear here
        </p>
      </div>
    </div>
  )
}

function StepSend({ template, contacts, subject }: { template: string | null, contacts: string[], subject: string }) {
  return (
    <div className="text-center">
      <Send className="w-16 h-16 mx-auto mb-4 text-neo-green" />
      <h2 className="text-xl font-bold mb-2">Ready to Send</h2>
      <p className="text-gray-600 mb-4">
        You are about to send emails to {contacts.length || 0} recipients
      </p>
      <div className="bg-gray-50 p-4 neo-border inline-block">
        <p className="font-mono text-sm">
          Template: {template || 'Not selected'}<br />
          Subject: {subject || 'Not set'}<br />
          Recipients: {contacts.length || 0}
        </p>
      </div>
    </div>
  )
}
