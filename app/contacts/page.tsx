'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Mail,
  User,
  X,
  Check,
  AlertCircle,
  Loader2,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { SmartAlert, SuccessAlert } from '@/components/shared/SmartAlert'
import { HelpButton } from '@/components/help/HelpButton'

interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

const STORAGE_KEY = 'email-platform-contacts'
const SETTINGS_KEY = 'email-platform-settings'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
  })
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setContacts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load contacts:', e)
      }
    }
  }, [])

  // Save contacts to localStorage
  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts))
  }

  const handleAddContact = () => {
    if (!newContact.email) return

    const contact: Contact = {
      id: Date.now().toString(),
      email: newContact.email,
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      createdAt: new Date().toISOString(),
    }

    saveContacts([...contacts, contact])
    setNewContact({ email: '', firstName: '', lastName: '' })
    setShowAddForm(false)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact({ ...contact })
  }

  const handleSaveEdit = () => {
    if (!editingContact) return

    const updated = contacts.map(c =>
      c.id === editingContact.id ? editingContact : c
    )
    saveContacts(updated)
    setEditingContact(null)
  }

  const handleCancelEdit = () => {
    setEditingContact(null)
  }

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      saveContacts(contacts.filter(c => c.id !== id))
    }
  }

  // Sync with Resend Segments
  const handleSyncResend = async () => {
    const settingsStr = localStorage.getItem(SETTINGS_KEY)
    if (!settingsStr) {
      setSyncStatus('error')
      setSyncMessage('Please configure API Key and Segment ID in Settings first')
      return
    }

    const settings = JSON.parse(settingsStr)
    if (!settings.apiKey || !settings.audienceId) {
      setSyncStatus('error')
      setSyncMessage('Please configure API Key and Segment ID in Settings first')
      return
    }

    setSyncStatus('loading')
    setSyncMessage('Syncing with Resend...')

    try {
      const response = await fetch(
        `/api/contacts?apiKey=${encodeURIComponent(settings.apiKey)}&audienceId=${encodeURIComponent(settings.audienceId)}`
      )
      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to sync contacts')
      }

      // Merge with existing contacts (avoid duplicates by email)
      const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()))
      const newContacts: Contact[] = []

      for (const resendContact of data.contacts || []) {
        if (!existingEmails.has(resendContact.email.toLowerCase())) {
          newContacts.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: resendContact.email,
            firstName: resendContact.first_name || resendContact.firstName || '',
            lastName: resendContact.last_name || resendContact.lastName || '',
            createdAt: new Date().toISOString(),
          })
        }
      }

      if (newContacts.length > 0) {
        saveContacts([...contacts, ...newContacts])
        setSyncStatus('success')
        setSyncMessage(`Imported ${newContacts.length} new contacts from Resend`)
      } else {
        setSyncStatus('success')
        setSyncMessage('All contacts are already synced')
      }
    } catch (error) {
      setSyncStatus('error')
      setSyncMessage(error instanceof Error ? error.message : 'Failed to sync contacts')
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setSyncStatus('idle')
      setSyncMessage('')
    }, 5000)
  }

  // Import CSV
  const handleImportCSV = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      setSyncStatus('error')
      setSyncMessage('CSV file is empty or has no data rows')
      return
    }

    // Parse header to find column indices
    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''))
    const emailIndex = header.findIndex(h => h.includes('email'))
    const firstNameIndex = header.findIndex(h => h.includes('first') || h === 'firstname' || h === 'name')
    const lastNameIndex = header.findIndex(h => h.includes('last') || h === 'lastname' || h === 'surname')

    if (emailIndex === -1) {
      setSyncStatus('error')
      setSyncMessage('CSV must have an "email" column')
      return
    }

    const existingEmails = new Set(contacts.map(c => c.email.toLowerCase()))
    const newContacts: Contact[] = []
    let skipped = 0

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const email = values[emailIndex]?.trim().replace(/"/g, '')

      if (!email || !isValidEmail(email)) {
        skipped++
        continue
      }

      if (existingEmails.has(email.toLowerCase())) {
        skipped++
        continue
      }

      newContacts.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: email,
        firstName: firstNameIndex !== -1 ? values[firstNameIndex]?.trim().replace(/"/g, '') || '' : '',
        lastName: lastNameIndex !== -1 ? values[lastNameIndex]?.trim().replace(/"/g, '') || '' : '',
        createdAt: new Date().toISOString(),
      })
      existingEmails.add(email.toLowerCase())
    }

    if (newContacts.length > 0) {
      saveContacts([...contacts, ...newContacts])
      setSyncStatus('success')
      setSyncMessage(`Imported ${newContacts.length} contacts${skipped > 0 ? ` (${skipped} skipped)` : ''}`)
    } else {
      setSyncStatus('error')
      setSyncMessage('No new valid contacts found in CSV')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setSyncStatus('idle')
      setSyncMessage('')
    }, 5000)
  }

  // Parse CSV line handling quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase()
    return (
      contact.email.toLowerCase().includes(query) ||
      contact.firstName.toLowerCase().includes(query) ||
      contact.lastName.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-8">
      {/* Hidden file input for CSV import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
            Contacts
          </h1>
          <p className="text-gray-600">
            Manage your email recipients
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="neo-border"
              onClick={handleImportCSV}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <HelpButton topic="csv-import" />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="neo-border"
              onClick={handleSyncResend}
              disabled={syncStatus === 'loading'}
            >
              {syncStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Sync Resend
            </Button>
            <HelpButton topic="resend-sync" />
          </div>
          <Button
            className="neo-button bg-neo-green text-white"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Sync Status Message */}
      {syncMessage && syncStatus === 'success' && (
        <SuccessAlert
          title="Sync Complete"
          description={syncMessage}
          className="mb-6"
        />
      )}
      {syncMessage && syncStatus === 'error' && (
        <SmartAlert
          message={{
            title: 'Sync Failed',
            description: syncMessage,
            severity: 'error',
            action: syncMessage.includes('Settings') ? { text: 'Go to Settings', href: '/settings' } : undefined,
          }}
          className="mb-6"
        />
      )}
      {syncMessage && syncStatus === 'loading' && (
        <div className="mb-6 p-4 neo-border flex items-center gap-2 bg-blue-50 text-blue-800 border-blue-300">
          <Loader2 className="w-5 h-5 animate-spin" />
          {syncMessage}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neo-border pl-10"
          />
        </div>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="neo-border neo-shadow p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Add New Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Email *"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="neo-border"
            />
            <Input
              placeholder="First Name"
              value={newContact.firstName}
              onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
              className="neo-border"
            />
            <Input
              placeholder="Last Name"
              value={newContact.lastName}
              onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
              className="neo-border"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="neo-button bg-neo-green text-white"
              onClick={handleAddContact}
            >
              Add Contact
            </Button>
            <Button
              variant="outline"
              className="neo-border"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="neo-border neo-shadow p-6 w-full max-w-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Edit Contact</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  className="neo-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  value={editingContact.firstName}
                  onChange={(e) => setEditingContact({ ...editingContact, firstName: e.target.value })}
                  className="neo-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  value={editingContact.lastName}
                  onChange={(e) => setEditingContact({ ...editingContact, lastName: e.target.value })}
                  className="neo-border"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="neo-button bg-neo-green text-white flex-1"
                onClick={handleSaveEdit}
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="neo-border"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Contacts List */}
      <Card className="neo-border neo-shadow">
        {contacts.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold mb-2">No contacts yet</h3>
            <p className="text-gray-600 mb-4">
              Add your first contact or import from CSV
            </p>
            <Button
              className="neo-button bg-neo-green text-white"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-4 border-black">
                <tr>
                  <th className="text-left p-4 font-bold uppercase text-sm">Email</th>
                  <th className="text-left p-4 font-bold uppercase text-sm">First Name</th>
                  <th className="text-left p-4 font-bold uppercase text-sm">Last Name</th>
                  <th className="text-left p-4 font-bold uppercase text-sm">Added</th>
                  <th className="text-right p-4 font-bold uppercase text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {contact.email}
                      </div>
                    </td>
                    <td className="p-4">{contact.firstName || '-'}</td>
                    <td className="p-4">{contact.lastName || '-'}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stats */}
      {contacts.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
      )}
    </div>
  )
}
