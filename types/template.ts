export type TemplateType = 'holiday' | 'marketing' | 'newsletter'

export type BlockType =
  | 'header'
  | 'text'
  | 'image'
  | 'button'
  | 'wishes'
  | 'divider'
  | 'spacer'
  | 'footer'

export interface EmailBlock {
  id: string
  type: BlockType
  props: Record<string, unknown>
  visible: boolean
}

export interface HeaderBlockProps {
  subtitle: string
  title: string
  year?: string
  showIcons: boolean
  icons: string[]
}

export interface TextBlockProps {
  content: string
  alignment: 'left' | 'center' | 'right'
  highlightBox?: {
    enabled: boolean
    text: string
    backgroundColor: string
  }
}

export interface ImageBlockProps {
  src: string
  alt: string
  caption?: string
  borderStyle: 'neo' | 'rounded' | 'none'
  shadowColor: string
}

export interface ButtonBlockProps {
  text: string
  url: string
  style: 'primary' | 'secondary' | 'outline'
}

export interface WishesBlockProps {
  title: string
  items: Array<{
    icon: string
    text: string
  }>
  stickerImage?: string
}

export interface DividerBlockProps {
  style: 'line' | 'icons' | 'spacer'
  icons?: string[]
  height?: number
}

export interface FooterBlockProps {
  senderName: string
  senderLabel: string
  showLinkedIn: boolean
  linkedInUrl?: string
  closingMessage: string
}

export interface ThemeConfig {
  primaryColor: string
  primaryColorDark: string
  primaryColorLight: string
  secondaryColor: string
  secondaryColorDark: string
  secondaryColorLight: string
  accentColor: string
  accentColorLight: string
  backgroundColor: string
  surfaceColor: string
  textColor: string
  borderColor: string
  borderWidth: number
  shadowOffset: number
  fontFamily: string
}

export interface EmailTemplate {
  id: string
  name: string
  description: string
  type: TemplateType
  subject: string
  previewText: string
  blocks: EmailBlock[]
  theme: ThemeConfig
  createdAt: string
  updatedAt: string
  isPreset: boolean
}

export interface TemplateVariable {
  key: string
  label: string
  defaultValue: string
  type: 'text' | 'image' | 'link'
}

// 预设主题
export const christmasTheme: ThemeConfig = {
  primaryColor: '#DC2626',
  primaryColorDark: '#B91C1C',
  primaryColorLight: '#FEE2E2',
  secondaryColor: '#16A34A',
  secondaryColorDark: '#15803D',
  secondaryColorLight: '#DCFCE7',
  accentColor: '#F59E0B',
  accentColorLight: '#FEF3C7',
  backgroundColor: '#1a1a2e',
  surfaceColor: '#FFFBEB',
  textColor: '#000000',
  borderColor: '#000000',
  borderWidth: 4,
  shadowOffset: 8,
  fontFamily: "'Trebuchet MS', 'Lucida Grande', Tahoma, sans-serif",
}

export const newYearTheme: ThemeConfig = {
  primaryColor: '#7C3AED',
  primaryColorDark: '#6D28D9',
  primaryColorLight: '#EDE9FE',
  secondaryColor: '#F59E0B',
  secondaryColorDark: '#D97706',
  secondaryColorLight: '#FEF3C7',
  accentColor: '#EC4899',
  accentColorLight: '#FCE7F3',
  backgroundColor: '#0F172A',
  surfaceColor: '#F8FAFC',
  textColor: '#1E293B',
  borderColor: '#1E293B',
  borderWidth: 4,
  shadowOffset: 8,
  fontFamily: "'Trebuchet MS', 'Lucida Grande', Tahoma, sans-serif",
}

export const newsletterTheme: ThemeConfig = {
  primaryColor: '#3B82F6',
  primaryColorDark: '#2563EB',
  primaryColorLight: '#DBEAFE',
  secondaryColor: '#10B981',
  secondaryColorDark: '#059669',
  secondaryColorLight: '#D1FAE5',
  accentColor: '#F59E0B',
  accentColorLight: '#FEF3C7',
  backgroundColor: '#F3F4F6',
  surfaceColor: '#FFFFFF',
  textColor: '#1F2937',
  borderColor: '#E5E7EB',
  borderWidth: 1,
  shadowOffset: 4,
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
}
