'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Palette,
  Users,
  Send,
  Settings,
  Mail,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen bg-white border-r-4 border-black transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b-4 border-black">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-red text-white flex items-center justify-center neo-border font-black text-lg">
            <Mail className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-tight">
                Email
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Platform
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-none border-2 border-transparent transition-all',
                  isActive
                    ? 'bg-neo-cream border-black shadow-neo font-bold'
                    : 'hover:bg-gray-100 hover:border-gray-300',
                  collapsed && 'justify-center px-2'
                )}
              >
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
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full neo-border bg-gray-100 hover:bg-gray-200',
            collapsed ? 'p-2' : 'p-2'
          )}
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
        <div className="px-4 pb-4 text-xs text-gray-400 uppercase">
          v2.0.0
        </div>
      )}
    </div>
  )
}
