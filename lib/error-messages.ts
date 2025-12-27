export type ErrorSeverity = 'info' | 'warning' | 'error' | 'success'

export interface ErrorAction {
  text: string
  href?: string
  onClick?: () => void
}

export interface ErrorMessage {
  title: string
  description: string
  severity: ErrorSeverity
  action?: ErrorAction
  suggestions?: string[]
}

export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
  // Settings related errors
  API_KEY_MISSING: {
    title: 'API Key Required',
    description: 'You need to configure your Resend API Key before you can send emails. This only takes a few minutes to set up.',
    severity: 'warning',
    action: {
      text: 'Go to Settings',
      href: '/settings',
    },
  },

  API_KEY_INVALID: {
    title: 'Invalid API Key',
    description: 'The API key you entered appears to be invalid. Please check that you copied it correctly from your Resend dashboard.',
    severity: 'error',
    suggestions: [
      'Make sure you copied the entire key (it starts with "re_")',
      'Check that there are no extra spaces before or after the key',
      'Try generating a new API key in Resend if the problem persists',
    ],
    action: {
      text: 'Go to Settings',
      href: '/settings',
    },
  },

  SENDER_EMAIL_MISSING: {
    title: 'Sender Email Required',
    description: 'Please configure your sender email address in Settings. This is the email address that will appear as the "From" address.',
    severity: 'warning',
    action: {
      text: 'Go to Settings',
      href: '/settings',
    },
  },

  SENDER_NAME_MISSING: {
    title: 'Sender Name Required',
    description: 'Please configure your sender name in Settings. This is the name that recipients will see when they receive your email.',
    severity: 'warning',
    action: {
      text: 'Go to Settings',
      href: '/settings',
    },
  },

  // Domain related errors
  DOMAIN_NOT_VERIFIED: {
    title: 'Domain Not Verified',
    description: 'The domain for your sender email has not been verified in Resend. You need to verify your domain before you can send emails from it.',
    severity: 'error',
    suggestions: [
      'Go to resend.com/domains and add your domain',
      'Follow the DNS verification steps provided by Resend',
      'Wait a few minutes for DNS changes to propagate',
      'For testing, you can use "delivered@resend.dev"',
    ],
  },

  // Contact related errors
  NO_CONTACTS: {
    title: 'No Contacts Found',
    description: 'You need to add at least one contact before you can send emails. You can add contacts manually, import from CSV, or sync from Resend.',
    severity: 'info',
    action: {
      text: 'Add Contacts',
      href: '/contacts',
    },
  },

  NO_CONTACTS_SELECTED: {
    title: 'No Recipients Selected',
    description: 'Please select at least one recipient to send your email to.',
    severity: 'warning',
  },

  CONTACTS_SYNC_FAILED: {
    title: 'Sync Failed',
    description: 'Could not sync contacts from Resend. Please check your API Key and Audience ID are configured correctly.',
    severity: 'error',
    action: {
      text: 'Check Settings',
      href: '/settings',
    },
    suggestions: [
      'Verify your API key is correct',
      'Make sure your Audience ID is valid',
      'Check that you have contacts in the Resend Audience',
    ],
  },

  AUDIENCE_ID_MISSING: {
    title: 'Audience ID Required',
    description: 'To sync contacts from Resend, you need to configure your Audience ID in Settings.',
    severity: 'warning',
    action: {
      text: 'Go to Settings',
      href: '/settings',
    },
  },

  CSV_IMPORT_NO_EMAIL: {
    title: 'Email Column Missing',
    description: 'Your CSV file must have a column named "email". Please check your file and try again.',
    severity: 'error',
  },

  CSV_IMPORT_EMPTY: {
    title: 'Empty CSV File',
    description: 'The CSV file you uploaded appears to be empty or has no valid data rows.',
    severity: 'error',
  },

  // Template related errors
  NO_TEMPLATE_SELECTED: {
    title: 'No Template Selected',
    description: 'Please select an email template to continue.',
    severity: 'warning',
    action: {
      text: 'Browse Templates',
      href: '/templates',
    },
  },

  TEMPLATE_RENDER_FAILED: {
    title: 'Preview Error',
    description: 'There was an error generating the email preview. Please try again or select a different template.',
    severity: 'error',
  },

  // Send related errors
  SEND_FAILED: {
    title: 'Send Failed',
    description: 'One or more emails could not be sent. Please check the details below and try again.',
    severity: 'error',
    suggestions: [
      'Verify your API key is correct and has sending permissions',
      'Check that your sender domain is verified in Resend',
      'Make sure recipient email addresses are valid',
      'Check your Resend dashboard for any account issues',
    ],
  },

  SEND_PARTIAL_SUCCESS: {
    title: 'Some Emails Failed',
    description: 'Some emails were sent successfully, but others failed. Check the details below.',
    severity: 'warning',
  },

  SEND_SUCCESS: {
    title: 'Emails Sent Successfully',
    description: 'All emails have been sent successfully!',
    severity: 'success',
  },

  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Error',
    description: 'Could not connect to the server. Please check your internet connection and try again.',
    severity: 'error',
  },

  // Generic errors
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again. If the problem persists, try refreshing the page.',
    severity: 'error',
  },
}

export function getErrorMessage(code: string): ErrorMessage {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR
}
