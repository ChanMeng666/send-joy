'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Home,
  Palette,
  Users,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SIDEBAR_COLLAPSED_KEY = 'email-platform-sidebar-collapsed'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Templates', href: '/templates', icon: Palette },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (saved) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  const handleCollapse = () => {
    const newValue = !collapsed
    setCollapsed(newValue)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(newValue))
  }

  // Check if path matches (supports nested routes)
  const isPathActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div
      className={cn(
        'hidden md:flex relative flex-col h-screen bg-white border-r-4 border-black transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b-4 border-black">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
            <Image
              src="/send-joy-logo.svg"
              alt="Christmas Greeting Email Logo"
              width={40}
              height={33}
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-neo-red">
                SendJoy
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Email Platform
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = isPathActive(item.href)
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 border-4 border-transparent transition-all touch-target',
                  isActive
                    ? 'bg-neo-cream border-black shadow-neo font-bold'
                    : 'hover:bg-gray-100 hover:border-gray-300',
                  collapsed && 'justify-center px-2'
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
                    'w-5 h-5 flex-shrink-0',
                    isActive ? 'text-neo-red' : 'text-gray-600'
                  )}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      'text-sm uppercase tracking-wide',
                      isActive ? 'text-black' : 'text-gray-600'
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t-4 border-black">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="w-full neo-border bg-gray-100 hover:bg-gray-200 touch-target"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Version */}
      {!collapsed && (
        <div className="px-4 pb-4 neo-caption">
          v2.0.0
        </div>
      )}
    </div>
  )
}
