'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Mail,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Contact {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

const STORAGE_KEY = 'email-platform-contacts'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
  })

  // 从 localStorage 加载联系人
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

  // 保存联系人到 localStorage
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

  const handleDeleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id))
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
        <div className="flex gap-2">
          <Button variant="outline" className="neo-border">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" className="neo-border">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Resend
          </Button>
          <Button
            className="neo-button bg-neo-green text-white"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

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
                        <Button size="sm" variant="ghost">
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
