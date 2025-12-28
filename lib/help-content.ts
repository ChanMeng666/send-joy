export interface HelpStep {
  text: string
  link?: string
  highlight?: boolean
}

export interface HelpTopic {
  title: string
  simple: string
  body?: string
  steps?: HelpStep[]
  warning?: string
  tip?: string
  optional?: boolean
}

export const HELP_CONTENT: Record<string, HelpTopic> = {
  'resend-api-key': {
    title: 'What is a Resend API Key?',
    simple: 'An API key is like a password that allows this platform to send emails on your behalf using the Resend email service.',
    body: `Resend is a professional email delivery service that ensures your emails reach recipients reliably.

The API key is a unique code that identifies you and authorizes this platform to use your Resend account for sending emails. Think of it like a special access card - without it, the platform cannot send any emails.

The key looks something like: re_AbCdEf123456...`,
    steps: [
      { text: 'Visit resend.com and create a free account', link: 'https://resend.com/signup' },
      { text: 'Verify your email address by clicking the link in the confirmation email' },
      { text: 'Log in to your Resend dashboard' },
      { text: 'Click "API Keys" in the left sidebar menu', link: 'https://resend.com/api-keys' },
      { text: 'Click the "Create API Key" button' },
      { text: 'Give your key a name (e.g., "Email Platform")' },
      { text: 'Select "Sending access" for the permission level' },
      { text: 'Click "Create" to generate your key' },
      { text: 'Copy the key immediately - it will only be shown once!', highlight: true },
      { text: 'Paste the key into the API Key field in Settings' },
    ],
    warning: 'Keep your API key private and secure. Never share it publicly or commit it to version control. If you suspect your key has been compromised, delete it in Resend and create a new one.',
  },

  'audience-id': {
    title: 'What is a Segment ID?',
    simple: 'A Segment ID is used to sync contacts from your Resend account. This is optional - you can skip it if you prefer to add contacts manually.',
    body: `Resend uses "Segments" to organize your contacts (e.g., "General", "Newsletter Subscribers", etc.). If you already have contacts in Resend, you can sync them to this platform using a Segment ID.

The Segment ID is a UUID that looks like: dc18b68d-cd0a-4c17-baf5-8de8edbf50fa

There are two ways to find your Segment ID:`,
    steps: [
      { text: 'Go to the Resend Audience page', link: 'https://resend.com/audience' },
      { text: 'Click "Segments" tab in the top menu' },
      { text: 'Click on the segment you want to sync (e.g., "General")' },
      { text: 'You will be redirected to the segment detail page', highlight: true },
      { text: 'Method 1: Copy the ID from the URL (the part after /segments/)' },
      { text: 'Method 2: Look for the "ID" field in the segment details panel on the right side' },
      { text: 'Paste the Segment ID into the Audience ID field in Settings' },
    ],
    tip: 'The Segment ID is visible in two places: (1) In the page URL like resend.com/audience/segments/YOUR-SEGMENT-ID, or (2) In the right-side panel under "Segment" section showing the ID field. If you don\'t have contacts in Resend yet, you can skip this step.',
    optional: true,
  },

  'sender-email': {
    title: 'Sender Email Address',
    simple: 'This is the email address that will appear as the "From" address when recipients receive your emails.',
    body: `For your emails to be delivered reliably and not marked as spam, you need to use an email address from a domain that you've verified in Resend.

For example, if you own "yourdomain.com", you would verify it in Resend and then use an address like "hello@yourdomain.com" as your sender email.`,
    steps: [
      { text: 'Log in to your Resend dashboard', link: 'https://resend.com' },
      { text: 'Click "Domains" in the left sidebar menu' },
      { text: 'Click "Add Domain" and enter your domain name' },
      { text: 'Add the DNS records that Resend provides to your domain\'s DNS settings' },
      { text: 'Wait for verification (usually a few minutes to a few hours)' },
      { text: 'Once verified, you can use any email address from that domain' },
    ],
    tip: 'Don\'t have your own domain? You can use "delivered@resend.dev" for testing purposes. Note that this should only be used for testing, not for production emails.',
  },

  'sender-name': {
    title: 'Sender Name',
    simple: 'This is the name that will appear in the "From" field when recipients view your email.',
    body: `The sender name is what recipients see first when your email arrives in their inbox. It should be recognizable and professional.

For example, if your company is "Acme Corp", you might use "Acme Corp" or "John from Acme Corp" as the sender name.`,
    tip: 'Use a name that recipients will recognize. This helps prevent your emails from being marked as spam.',
  },

  'template-variables': {
    title: 'Personalization Variables',
    simple: 'Variables let you personalize each email with recipient-specific information like their name.',
    body: `When you include a variable like {{recipientName}} in your email, it will be automatically replaced with each recipient's actual name when the email is sent.

Available variables:
- {{recipientName}} - The recipient's first name
- {{recipientEmail}} - The recipient's email address
- {{senderName}} - Your configured sender name

For example, "Hello {{recipientName}}!" becomes "Hello John!" for a recipient named John.`,
  },

  'csv-import': {
    title: 'Importing Contacts from CSV',
    simple: 'You can bulk import contacts from a spreadsheet by saving it as a CSV file.',
    body: `CSV (Comma-Separated Values) is a simple file format that can be created from any spreadsheet application like Excel or Google Sheets.

Your CSV file should have at least an "email" column. You can also include "firstName" and "lastName" columns for personalization.`,
    steps: [
      { text: 'Open your spreadsheet in Excel, Google Sheets, or similar' },
      { text: 'Ensure you have columns named: email, firstName (optional), lastName (optional)' },
      { text: 'Save or export the file as CSV format' },
      { text: 'Click "Import CSV" on the Contacts page' },
      { text: 'Select your CSV file' },
      { text: 'The contacts will be imported automatically' },
    ],
    tip: 'Duplicate email addresses will be skipped during import.',
  },

  'resend-sync': {
    title: 'Syncing with Resend Segments',
    simple: 'If you have contacts stored in your Resend account, you can sync them to this platform with one click.',
    body: `The Resend sync feature pulls contacts from your Resend Segment and adds them to this platform. This is useful if you already manage your contact list in Resend.

To use this feature, you need to:
1. Have an API key configured in Settings
2. Have a Segment ID configured in the "Audience ID" field in Settings
3. Have contacts in that Resend Segment`,
  },
}

export function getHelpContent(topic: string): HelpTopic | null {
  return HELP_CONTENT[topic] || null
}
