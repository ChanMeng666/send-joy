import 'dotenv/config';

export const config = {
  resendApiKey: process.env.RESEND_API_KEY || '',
  sender: {
    email: process.env.SENDER_EMAIL || 'hello@chanmeng.org',
    name: process.env.SENDER_NAME || 'Chan Meng',
  },
  linkedin: 'https://www.linkedin.com/in/chanmeng666/',

  // Your existing Resend Audience ID (from https://resend.com/audiences)
  audienceId: 'dc18b68d-cd0a-4c17-baf5-8de8edbf50fa',

  // Neobrutalism Christmas color palette
  colors: {
    christmasRed: '#DC2626',
    christmasRedDark: '#B91C1C',
    christmasGreen: '#16A34A',
    christmasGreenDark: '#15803D',
    black: '#000000',
    cream: '#FEF3C7',
    warmWhite: '#FFFBEB',
    gold: '#F59E0B',
  },

  // Email subject line
  emailSubject: '🎄 Season\'s Greetings from Chan Meng!',

  // Personal image URL
  personalImageUrl: 'https://lxd4dc8r8oetlgua.public.blob.vercel-storage.com/public/img/christmas-greeting-email/christmas-greeting.png',
};
