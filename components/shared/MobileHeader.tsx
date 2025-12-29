'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Palette, Users, Send, Settings } from 'lucide-react'
import { useMobileNav } from '@/contexts/MobileNavContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Templates', href: '/templates', icon: Palette },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MobileHeader() {
  const { isOpen, toggle, close } = useMobileNav()
  const pathname = usePathname()

  // Check if path matches (supports nested routes)
  const isPathActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b-4 border-black">
        <div className="flex items-center justify-between p-3">
          <Link href="/" className="flex items-center gap-2" onClick={close}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <Image
                src="/send-joy-logo.svg"
                alt="Christmas Greeting Email Logo"
                width={40}
                height={33}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-neo-red">
                SendJoy
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Email Platform
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="neo-border touch-target"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={close}
            aria-hidden="true"
          />

          {/* Navigation Menu */}
          <nav className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = isPathActive(item.href)
                return (
                  <Link key={item.name} href={item.href} onClick={close}>
                    <div
                      className={cn(
                        'relative flex items-center gap-3 px-4 py-4 border-4 border-transparent transition-all touch-target',
                        isActive
                          ? 'bg-neo-cream border-black shadow-neo font-bold'
                          : 'hover:bg-gray-100 hover:border-gray-300'
                      )}
                    >
                      {/* Active indicator bar */}
                      <div
                        className={cn(
                          'absolute left-0 top-0 bottom-0 w-1 transition-all',
                          isActive ? 'bg-neo-red' : 'bg-transparent'
                        )}
                      />
                      <item.icon
                        className={cn(
                          'w-6 h-6 flex-shrink-0',
                          isActive ? 'text-neo-red' : 'text-gray-600'
                        )}
                      />
                      <span
                        className={cn(
                          'text-base uppercase tracking-wide',
                          isActive ? 'text-black' : 'text-gray-600'
                        )}
                      >
                        {item.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Version at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-black bg-white">
              <p className="neo-caption text-center">v2.0.0</p>
            </div>
          </nav>
        </>
      )}

      {/* Spacer for fixed header */}
      <div className="md:hidden h-[72px]" />
    </>
  )
}
