const baseUrl = 'https://send-joy.vercel.app'

/**
 * Organization schema for SendJoy brand identity
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SendJoy',
    alternateName: 'Christmas Greeting Email Platform',
    url: baseUrl,
    logo: `${baseUrl}/send-joy-logo.svg`,
    description:
      'Free visual email template platform for creating holiday greetings, marketing emails, and newsletters',
    founder: {
      '@type': 'Person',
      name: 'Chan Meng',
      url: 'https://chanmeng.live/',
      sameAs: [
        'https://github.com/ChanMeng666',
        'https://www.linkedin.com/in/chanmeng666/',
      ],
    },
    sameAs: ['https://github.com/ChanMeng666/send-joy'],
  }
}

/**
 * SoftwareApplication schema for the web app
 */
export function getWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SendJoy',
    alternateName: 'SendJoy Email Template Platform',
    description:
      'Visual email template editor with drag-and-drop blocks for creating holiday greetings, marketing emails, and newsletters. Features Neobrutalism design, real-time preview, and Resend API integration.',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Email Marketing',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Best on Chrome, Firefox, Safari, Edge.',
    softwareVersion: '2.0.0',
    releaseNotes: 'Next.js 15 with React 19, enhanced visual editor, Resend cloud sync',
    screenshot: `${baseUrl}/send-joy-logo.svg`,
    featureList: [
      '6 preset email templates (Holiday, Marketing, Newsletter)',
      '7 block types for visual editing',
      'Drag-and-drop block reordering',
      'Real-time email preview',
      'Desktop and mobile preview modes',
      '50-state undo/redo history',
      'Contact management with CSV import',
      'Resend API integration',
      '5-step email sending wizard',
      'Neobrutalism design aesthetic',
    ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free and open-source',
    },
    creator: {
      '@type': 'Person',
      name: 'Chan Meng',
      url: 'https://chanmeng.live/',
    },
    keywords:
      'email templates, email builder, newsletter creator, marketing emails, holiday greetings, neobrutalism design, resend api, react email, free email editor',
  }
}

/**
 * BreadcrumbList schema for navigation context
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * CollectionPage schema for the templates page
 */
export function getTemplateCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Email Templates',
    description:
      'Browse 6 preset email templates for holidays, marketing, and newsletters. Create custom templates with the visual editor.',
    url: `${baseUrl}/templates`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Classic Christmas',
          description: 'Red and green Neobrutalism Christmas greeting template',
          url: `${baseUrl}/templates/christmas-classic/edit`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'New Year 2025',
          description: 'Purple and gold celebration theme for New Year',
          url: `${baseUrl}/templates/new-year-2025/edit`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Chinese New Year',
          description: 'Traditional red and gold theme for Year of the Snake',
          url: `${baseUrl}/templates/chinese-new-year/edit`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Birthday Wishes',
          description: 'Pink and purple colorful birthday celebration',
          url: `${baseUrl}/templates/birthday/edit`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Product Launch',
          description: 'Gold and blue bold product announcement',
          url: `${baseUrl}/templates/product-launch/edit`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Weekly Newsletter',
          description: 'Green professional newsletter digest layout',
          url: `${baseUrl}/templates/newsletter/edit`,
        },
      ],
    },
  }
}

/**
 * FAQPage schema for common questions
 */
export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is SendJoy free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, SendJoy is completely free and open-source under MIT license. You need a Resend account (free tier: 100 emails/day) to send emails.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need coding skills to use SendJoy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No coding required. SendJoy provides a visual drag-and-drop editor with 7 block types. Just add blocks, customize content, and send.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is my data stored?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All data (templates, contacts, settings) is stored locally in your browser using localStorage. Nothing is stored on our servers, ensuring your privacy.',
        },
      },
      {
        '@type': 'Question',
        name: 'What email service does SendJoy use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SendJoy integrates with Resend API for email delivery. You need a Resend API key, which you can get for free at resend.com.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of email templates are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SendJoy offers 6 preset templates: Classic Christmas, New Year 2025, Chinese New Year, Birthday Wishes, Product Launch, and Weekly Newsletter. You can also create custom templates from scratch.',
        },
      },
    ],
  }
}

/**
 * HowTo schema for the 5-step sending wizard
 */
export function getSendingWizardSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Send Emails with SendJoy',
    description: 'A 5-step guide to sending personalized emails using SendJoy platform',
    totalTime: 'PT5M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Resend API Key',
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Select Template',
        text: 'Choose from 6 preset templates or select a custom template you created.',
        url: `${baseUrl}/send`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Select Recipients',
        text: 'Choose contacts from your list or add new recipients manually.',
        url: `${baseUrl}/send`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Customize Subject',
        text: 'Write a compelling email subject line with optional personalization tokens.',
        url: `${baseUrl}/send`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Preview Email',
        text: 'Review how your email will look on desktop and mobile devices.',
        url: `${baseUrl}/send`,
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Send Email',
        text: 'Confirm and send your email to all selected recipients via Resend API.',
        url: `${baseUrl}/send`,
      },
    ],
  }
}
