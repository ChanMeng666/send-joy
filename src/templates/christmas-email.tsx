import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { config } from '../config.js';

interface ChristmasEmailProps {
  recipientName?: string;
  personalImageUrl?: string;
}

// ============================================
// SVG Icons - Professional Christmas Elements
// ============================================

// Helper function to create data URI for SVG icons
const createSvgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

// SVG icon definitions
const svgIcons = {
  christmasTree: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2L4 14h3l-2 4h4v4h6v-4h4l-2-4h3L12 2zm0 3.5L16.5 12h-2l1.5 3h-3v3h-2v-3H8l1.5-3h-2L12 5.5z"/></svg>`,

  snowflake: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M11 1v4.07A5.9 5.9 0 009.5 5.5L7.38 3.38 6 4.75l2.12 2.12c-.2.32-.37.66-.51 1.02L4.07 6.5 3.5 8.08l3.54 1.4a6 6 0 000 1.04L3.5 11.92l.57 1.58L7.6 12.1c.14.36.31.7.51 1.02L6 15.25l1.38 1.37L9.5 14.5c.46.27.97.46 1.5.57V19h2v-3.93a5.9 5.9 0 001.5-.57l2.12 2.12 1.38-1.37-2.12-2.13c.2-.32.37-.66.51-1.02l3.54 1.4.57-1.58-3.54-1.4a6 6 0 000-1.04l3.54-1.4-.57-1.58-3.54 1.4c-.14-.36-.31-.7-.51-1.02L18 4.75l-1.38-1.37-2.12 2.12A5.9 5.9 0 0013 5.07V1h-2zm1 6a4 4 0 110 8 4 4 0 010-8z"/></svg>`,

  gift: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M20 7h-1.5A3.5 3.5 0 0015 3.5 3.5 3.5 0 0012 6a3.5 3.5 0 00-3-2.5A3.5 3.5 0 005.5 7H4a2 2 0 00-2 2v2a1 1 0 001 1h1v7a2 2 0 002 2h12a2 2 0 002-2v-7h1a1 1 0 001-1V9a2 2 0 00-2-2zm-8 13H6v-7h6v7zm0-9H4V9h8v2zm2 9v-7h6v7h-6zm6-9h-8V9h8v2zM15 7a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 0115 4a1.5 1.5 0 011.5 1.5A1.5 1.5 0 0115 7zM9 4a1.5 1.5 0 011.5 1.5A1.5 1.5 0 019 7a1.5 1.5 0 01-1.5-1.5A1.5 1.5 0 019 4z"/></svg>`,

  star: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,

  bell: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,

  holly: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill="${color}" d="M17 3c-1.5 0-2.9.7-3.8 1.8-.9-1.1-2.3-1.8-3.8-1.8-2.8 0-5 2.2-5 5 0 .7.1 1.4.4 2H3v2h2.6c.9 1.2 2.3 2 3.9 2h.5v8h2v-8h.5c1.6 0 3-.8 3.9-2H19v-2h-1.8c.3-.6.4-1.3.4-2 0-2.8-2.2-5-5-5z"/><circle fill="#DC2626" cx="9" cy="6" r="1.5"/><circle fill="#DC2626" cx="15" cy="6" r="1.5"/><circle fill="#DC2626" cx="12" cy="8" r="1.5"/></svg>`,

  linkedin: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,

  heart: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,

  ornament: (size: number, color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><circle cx="12" cy="14" r="7"/><rect x="10" y="3" width="4" height="4" rx="1"/><path d="M12 7v3" stroke="${color}" stroke-width="2"/></svg>`,
};

// Icon component factory
const Icon = ({ type, size = 24, color = '#000' }: { type: keyof typeof svgIcons; size?: number; color?: string }) => {
  const svgFn = svgIcons[type];
  if (!svgFn) return null;

  return (
    <img
      src={createSvgDataUri(svgFn(size, color))}
      alt=""
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};

// ============================================
// Color Palette
// ============================================

const colors = {
  christmasRed: '#DC2626',
  christmasRedDark: '#B91C1C',
  christmasRedLight: '#FEE2E2',
  christmasGreen: '#16A34A',
  christmasGreenDark: '#15803D',
  christmasGreenLight: '#DCFCE7',
  gold: '#F59E0B',
  goldLight: '#FEF3C7',
  black: '#000000',
  cream: '#FEF3C7',
  warmWhite: '#FFFBEB',
  white: '#FFFFFF',
  darkBg: '#1a1a2e',
};

// ============================================
// Polka Dot Background Patterns
// ============================================

const createPolkaDotPattern = (dotColor: string, bgColor: string, dotSize: number = 4, spacing: number = 20): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spacing}" height="${spacing}" viewBox="0 0 ${spacing} ${spacing}"><rect fill="${bgColor}" width="${spacing}" height="${spacing}"/><circle fill="${dotColor}" cx="${spacing/2}" cy="${spacing/2}" r="${dotSize}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const polkaDotPatterns = {
  greenOnCream: createPolkaDotPattern('#16A34A', '#FEF3C7', 3, 16),
  redOnCream: createPolkaDotPattern('#DC2626', '#FEF3C7', 3, 16),
  goldOnRed: createPolkaDotPattern('#F59E0B', '#DC2626', 4, 20),
  whiteOnGreen: createPolkaDotPattern('#FFFFFF', '#16A34A', 3, 18),
  creamOnGreen: createPolkaDotPattern('#FEF3C7', '#DCFCE7', 4, 18),
};

// ============================================
// Styles - Neobrutalism + Christmas Theme
// ============================================

const styles = {
  body: {
    backgroundColor: colors.darkBg,
    fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
    margin: 0,
    padding: '40px 20px',
  },
  container: {
    backgroundColor: colors.warmWhite,
    border: `5px solid ${colors.black}`,
    boxShadow: `12px 12px 0px ${colors.black}`,
    maxWidth: '600px',
    margin: '0 auto',
  },
  topBanner: {
    backgroundColor: colors.christmasGreen,
    padding: '12px',
    textAlign: 'center' as const,
    borderBottom: `4px solid ${colors.black}`,
  },
  header: {
    backgroundColor: colors.christmasRed,
    backgroundImage: polkaDotPatterns.goldOnRed,
    padding: '40px 30px',
    textAlign: 'center' as const,
    borderBottom: `4px solid ${colors.black}`,
  },
  headerSubtitle: {
    color: colors.goldLight,
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '4px',
    textTransform: 'uppercase' as const,
    margin: '0 0 10px 0',
  },
  headerTitle: {
    color: colors.white,
    fontSize: '48px',
    fontWeight: 900,
    margin: '0 0 10px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '3px',
    textShadow: `4px 4px 0px ${colors.black}`,
    lineHeight: 1.1,
  },
  headerYear: {
    color: colors.gold,
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '8px',
  },
  iconBar: {
    backgroundColor: colors.cream,
    backgroundImage: polkaDotPatterns.greenOnCream,
    padding: '20px',
    textAlign: 'center' as const,
    borderBottom: `4px solid ${colors.black}`,
  },
  imageSection: {
    padding: '30px',
    textAlign: 'center' as const,
    backgroundColor: colors.cream,
    backgroundImage: polkaDotPatterns.redOnCream,
    borderBottom: `4px solid ${colors.black}`,
  },
  imageContainer: {
    border: `5px solid ${colors.black}`,
    boxShadow: `8px 8px 0px ${colors.christmasGreen}`,
    display: 'inline-block',
    backgroundColor: colors.white,
    padding: '8px',
  },
  mainImage: {
    maxWidth: '100%',
    width: '400px',
    height: 'auto',
    display: 'block',
  },
  greetingSection: {
    backgroundColor: colors.christmasGreenLight,
    backgroundImage: polkaDotPatterns.creamOnGreen,
    padding: '30px',
    borderBottom: `4px solid ${colors.black}`,
  },
  greetingBox: {
    backgroundColor: colors.christmasGreen,
    border: `4px solid ${colors.black}`,
    boxShadow: `6px 6px 0px ${colors.christmasRed}`,
    padding: '20px 25px',
    display: 'inline-block',
  },
  greetingText: {
    color: colors.white,
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
    textShadow: `1px 1px 0px ${colors.black}`,
  },
  messageSection: {
    padding: '35px 30px',
    backgroundColor: colors.warmWhite,
  },
  messageBox: {
    backgroundColor: colors.white,
    border: `4px solid ${colors.black}`,
    padding: '30px',
    marginBottom: '25px',
  },
  messageText: {
    color: colors.black,
    fontSize: '16px',
    lineHeight: 1.9,
    margin: '0 0 20px 0',
  },
  messageTextLast: {
    color: colors.black,
    fontSize: '16px',
    lineHeight: 1.9,
    margin: 0,
  },
  highlightBox: {
    backgroundColor: colors.gold,
    border: `3px solid ${colors.black}`,
    padding: '15px 20px',
    margin: '25px 0',
    textAlign: 'center' as const,
  },
  highlightText: {
    color: colors.black,
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
  },
  wishesSection: {
    backgroundColor: colors.christmasRedLight,
    border: `4px solid ${colors.black}`,
    padding: '25px',
    marginBottom: '25px',
  },
  wishesTitle: {
    color: colors.christmasRedDark,
    fontSize: '18px',
    fontWeight: 700,
    margin: '0 0 15px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
  },
  wishItem: {
    color: colors.black,
    fontSize: '15px',
    lineHeight: 2.2,
    margin: '0 0 5px 0',
    paddingLeft: '5px',
  },
  senderSection: {
    padding: '0 30px 35px',
    backgroundColor: colors.warmWhite,
  },
  senderCard: {
    backgroundColor: colors.christmasRed,
    border: `5px solid ${colors.black}`,
    boxShadow: `8px 8px 0px ${colors.black}`,
    padding: '30px',
    textAlign: 'center' as const,
  },
  senderLabel: {
    color: colors.goldLight,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '3px',
    textTransform: 'uppercase' as const,
    margin: '0 0 8px 0',
  },
  senderName: {
    color: colors.white,
    fontSize: '28px',
    fontWeight: 900,
    margin: '0 0 20px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
  },
  linkedinButton: {
    backgroundColor: colors.white,
    border: `4px solid ${colors.black}`,
    boxShadow: `5px 5px 0px ${colors.black}`,
    color: colors.black,
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 700,
    padding: '14px 28px',
    textDecoration: 'none',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  footer: {
    backgroundColor: colors.christmasGreen,
    backgroundImage: polkaDotPatterns.whiteOnGreen,
    borderTop: `4px solid ${colors.black}`,
    padding: '25px',
    textAlign: 'center' as const,
  },
  footerText: {
    color: colors.white,
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 0 10px 0',
  },
  footerSubtext: {
    color: colors.christmasGreenLight,
    fontSize: '12px',
    margin: 0,
  },
  bottomBanner: {
    backgroundColor: colors.christmasRed,
    padding: '15px',
    textAlign: 'center' as const,
  },
  divider: {
    height: '8px',
    backgroundColor: colors.gold,
    border: 'none',
    margin: 0,
  },
  iconCell: {
    padding: '0 8px',
  },
  iconCellLarge: {
    padding: '0 15px',
  },
};

// ============================================
// Main Email Component
// ============================================

export const ChristmasEmail: React.FC<ChristmasEmailProps> = ({
  recipientName = 'Friend',
  personalImageUrl = config.personalImageUrl,
}) => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <Html>
      <Head>
        <title>Season's Greetings from {config.sender.name}</title>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Top Decorative Banner */}
          <Section style={styles.topBanner}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
              <tbody>
                <tr>
                  <td style={styles.iconCell}><Icon type="snowflake" size={18} color={colors.white} /></td>
                  <td style={styles.iconCell}><Icon type="star" size={18} color={colors.gold} /></td>
                  <td style={styles.iconCell}><Icon type="snowflake" size={18} color={colors.white} /></td>
                  <td style={styles.iconCell}><Icon type="bell" size={18} color={colors.gold} /></td>
                  <td style={styles.iconCell}><Icon type="snowflake" size={18} color={colors.white} /></td>
                  <td style={styles.iconCell}><Icon type="star" size={18} color={colors.gold} /></td>
                  <td style={styles.iconCell}><Icon type="snowflake" size={18} color={colors.white} /></td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Main Header */}
          <Section style={styles.header}>
            <Text style={styles.headerSubtitle}>Season's Greetings</Text>
            <Text style={styles.headerTitle}>Merry Christmas</Text>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '15px auto 0' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0 10px' }}><Icon type="star" size={20} color={colors.gold} /></td>
                  <td><Text style={styles.headerYear}>{nextYear}</Text></td>
                  <td style={{ padding: '0 10px' }}><Icon type="star" size={20} color={colors.gold} /></td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Icon Decoration Bar */}
          <Section style={styles.iconBar}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
              <tbody>
                <tr>
                  <td style={styles.iconCellLarge}><Icon type="christmasTree" size={36} color={colors.christmasGreen} /></td>
                  <td style={styles.iconCellLarge}><Icon type="gift" size={32} color={colors.christmasRed} /></td>
                  <td style={styles.iconCellLarge}><Icon type="holly" size={32} color={colors.christmasGreen} /></td>
                  <td style={styles.iconCellLarge}><Icon type="bell" size={32} color={colors.gold} /></td>
                  <td style={styles.iconCellLarge}><Icon type="gift" size={32} color={colors.christmasRed} /></td>
                  <td style={styles.iconCellLarge}><Icon type="christmasTree" size={36} color={colors.christmasGreen} /></td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Personal Image Section */}
          {personalImageUrl && personalImageUrl !== 'YOUR_IMAGE_URL_HERE' && (
            <Section style={styles.imageSection}>
              <div style={styles.imageContainer}>
                <Img
                  src={personalImageUrl}
                  alt="Holiday Greetings"
                  style={styles.mainImage}
                />
              </div>
            </Section>
          )}

          {/* Gold Divider */}
          <Hr style={styles.divider} />

          {/* Greeting Section */}
          <Section style={styles.greetingSection}>
            <div style={styles.greetingBox}>
              <Text style={styles.greetingText}>
                Dear {recipientName},
              </Text>
            </div>
          </Section>

          {/* Message Section */}
          <Section style={styles.messageSection}>
            <div style={styles.messageBox}>
              <Text style={styles.messageText}>
                As the holiday season fills the air with joy and celebration,
                I wanted to take a moment to send you my warmest wishes and heartfelt gratitude.
              </Text>

              <Text style={styles.messageText}>
                This year has been an incredible journey, and I am truly grateful
                for the meaningful connections we've made and the opportunities
                to collaborate, learn, and grow together.
              </Text>

              <div style={styles.highlightBox}>
                <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: '10px' }}><Icon type="star" size={20} color={colors.christmasRed} /></td>
                      <td><Text style={styles.highlightText}>Wishing You a Magical Holiday Season</Text></td>
                      <td style={{ paddingLeft: '10px' }}><Icon type="star" size={20} color={colors.christmasRed} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Text style={styles.messageTextLast}>
                May this Christmas bring you endless happiness, peace, and prosperity.
                Wishing you and your loved ones a season filled with laughter, love,
                and unforgettable moments.
              </Text>
            </div>

            {/* Wishes List */}
            <div style={styles.wishesSection}>
              <table cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}><Icon type="heart" size={18} color={colors.christmasRed} /></td>
                    <td><Text style={styles.wishesTitle}>My Wishes for You</Text></td>
                  </tr>
                </tbody>
              </table>
              <Text style={styles.wishItem}>
                <Icon type="star" size={14} color={colors.gold} /> Joy and happiness in every moment
              </Text>
              <Text style={styles.wishItem}>
                <Icon type="star" size={14} color={colors.gold} /> Success in all your endeavors
              </Text>
              <Text style={styles.wishItem}>
                <Icon type="star" size={14} color={colors.gold} /> Health and wellness for you and your family
              </Text>
              <Text style={styles.wishItem}>
                <Icon type="star" size={14} color={colors.gold} /> Exciting new adventures in {nextYear}
              </Text>
            </div>
          </Section>

          {/* Sender Card */}
          <Section style={styles.senderSection}>
            <div style={styles.senderCard}>
              <Text style={styles.senderLabel}>Warm Regards From</Text>
              <Text style={styles.senderName}>{config.sender.name}</Text>
              <Link href={config.linkedin} style={styles.linkedinButton}>
                <Icon type="linkedin" size={18} color={colors.black} />
                <span style={{ marginLeft: '8px' }}>Connect on LinkedIn</span>
              </Link>
            </div>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto 15px' }}>
              <tbody>
                <tr>
                  <td style={styles.iconCell}><Icon type="snowflake" size={16} color={colors.white} /></td>
                  <td style={styles.iconCell}><Icon type="christmasTree" size={20} color={colors.white} /></td>
                  <td style={styles.iconCell}><Icon type="snowflake" size={16} color={colors.white} /></td>
                </tr>
              </tbody>
            </table>
            <Text style={styles.footerText}>
              Merry Christmas & Happy New Year {nextYear}!
            </Text>
            <Text style={styles.footerSubtext}>
              Sent with warmth and appreciation
            </Text>
          </Section>

          {/* Bottom Decorative Banner */}
          <Section style={styles.bottomBanner}>
            <table cellPadding="0" cellSpacing="0" style={{ margin: '0 auto' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0 6px' }}><Icon type="gift" size={16} color={colors.white} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="star" size={14} color={colors.gold} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="holly" size={16} color={colors.christmasGreenLight} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="star" size={14} color={colors.gold} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="bell" size={16} color={colors.gold} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="star" size={14} color={colors.gold} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="holly" size={16} color={colors.christmasGreenLight} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="star" size={14} color={colors.gold} /></td>
                  <td style={{ padding: '0 6px' }}><Icon type="gift" size={16} color={colors.white} /></td>
                </tr>
              </tbody>
            </table>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ChristmasEmail;
