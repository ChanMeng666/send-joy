'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeModalProps {
  onGetStarted: () => void
  onSkip: () => void
}

export function WelcomeModal({ onGetStarted, onSkip }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Small delay for animation
    const timer = setTimeout(() => {
      setIsOpen(true)
      setIsAnimating(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      onGetStarted()
    }, 200)
  }

  const handleSkip = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsOpen(false)
      onSkip()
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleSkip}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg mx-4 bg-white neo-border neo-shadow-lg p-8 transform transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neo-cream neo-border mb-6">
            <Mail className="w-10 h-10 text-neo-red" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
            Welcome to Email Platform!
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Create and send beautiful email campaigns in minutes.
            Let&apos;s get you set up with just a few simple steps.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-neo-red/10 neo-border flex items-center justify-center">
                <span className="text-neo-red font-bold">1</span>
              </div>
              <p className="text-xs text-gray-500">Get API Key</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-neo-green/10 neo-border flex items-center justify-center">
                <span className="text-neo-green font-bold">2</span>
              </div>
              <p className="text-xs text-gray-500">Add Contacts</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-neo-gold/10 neo-border flex items-center justify-center">
                <span className="text-neo-gold font-bold">3</span>
              </div>
              <p className="text-xs text-gray-500">Send Emails</p>
            </div>
          </div>

          {/* Time estimate */}
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-neo-gold" />
            <span>Takes about 3 minutes to set up</span>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGetStarted}
              className="neo-button bg-neo-red text-white w-full py-6 text-lg font-bold"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              I already know how to use this, skip the tour
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
