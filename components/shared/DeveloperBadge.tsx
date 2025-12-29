import Image from 'next/image'
import { Mail, Github, ExternalLink } from 'lucide-react'

export function DeveloperBadge() {
  return (
    <div className="mt-8 md:mt-12 neo-border shadow-neo bg-gradient-to-r from-neo-cream to-white p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Developer Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 neo-border bg-white p-2">
            <Image
              src="/chan_logo.svg"
              alt="Chan Meng Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-gray-600 mb-3">
            Crafted by <span className="font-bold text-black">Chan Meng</span> —
            Full-stack developer specializing in modern web applications.
            Need a custom solution? Let&apos;s build something amazing together.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm">
            <a
              href="mailto:chanmeng.dev@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neo-red text-white font-medium neo-border-sm shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </a>
            <a
              href="https://github.com/ChanMeng666"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white font-medium neo-border-sm shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              Portfolio
            </a>
            <a
              href="https://github.com/ChanMeng666/send-joy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="underline">View Source</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
