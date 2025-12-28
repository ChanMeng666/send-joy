import { Resend } from 'resend';
import { config } from './config.js';
import * as readline from 'readline';

const resend = new Resend(config.resendApiKey);

// Use Resend Segment ID from config
const SEGMENT_ID = config.audienceId;

interface Contact {
  email: string;
  firstName?: string;
  lastName?: string;
}

// Get segment ID (using existing one from config)
export function getSegmentId(): string {
  return SEGMENT_ID;
}

// Add a single contact to the segment
export async function addContact(contact: Contact): Promise<void> {
  try {
    const { data, error } = await resend.contacts.create({
      audienceId: SEGMENT_ID,
      email: contact.email,
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      unsubscribed: false,
    });

    if (error) {
      console.error(`Failed to add ${contact.email}:`, error);
      return;
    }

    console.log(`✅ Added contact: ${contact.email}`);
  } catch (error) {
    console.error(`Error adding ${contact.email}:`, error);
  }
}

// List all contacts from the segment
export async function listContacts(): Promise<Contact[]> {
  try {
    const { data, error } = await resend.contacts.list({
      audienceId: SEGMENT_ID,
    });

    if (error) {
      console.error('Failed to list contacts:', error);
      return [];
    }

    const contacts = data?.data || [];

    console.log('\n📋 Contact List (Segment: ' + SEGMENT_ID + ')');
    console.log('─'.repeat(60));

    if (contacts.length === 0) {
      console.log('No contacts found.');
      console.log('Add contacts at: https://resend.com/audience/segments/' + SEGMENT_ID);
      console.log('Or use: npm run contacts:add');
    } else {
      contacts.forEach((c: { email: string; first_name?: string; last_name?: string }, i: number) => {
        const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || 'No name';
        console.log(`${i + 1}. ${name} <${c.email}>`);
      });
    }

    console.log('─'.repeat(60));
    console.log(`Total: ${contacts.length} contacts\n`);

    return contacts.map((c: { email: string; first_name?: string; last_name?: string }) => ({
      email: c.email,
      firstName: c.first_name,
      lastName: c.last_name,
    }));
  } catch (error) {
    console.error('Error listing contacts:', error);
    return [];
  }
}

// Remove a contact
export async function removeContact(email: string): Promise<void> {
  try {
    await resend.contacts.remove({
      audienceId: SEGMENT_ID,
      email,
    });
    console.log(`✅ Removed contact: ${email}`);
  } catch (error) {
    console.error(`Error removing ${email}:`, error);
  }
}

// Interactive add contact
async function interactiveAddContact(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  console.log('\n🎄 Add New Contact');
  console.log('─'.repeat(30));

  const email = await question('Email: ');
  const firstName = await question('First Name: ');
  const lastName = await question('Last Name: ');

  rl.close();

  if (!email) {
    console.log('Email is required!');
    return;
  }

  await addContact({ email, firstName, lastName });
}

// CLI handler
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'list':
      await listContacts();
      break;

    case 'add':
      await interactiveAddContact();
      break;

    case 'remove':
      const email = process.argv[3];
      if (!email) {
        console.log('Usage: tsx src/contacts.ts remove <email>');
        return;
      }
      await removeContact(email);
      break;

    default:
      console.log(`
🎄 Christmas Email - Contact Manager

Using Resend Segment: ${SEGMENT_ID}
Manage contacts at: https://resend.com/audience/segments/${SEGMENT_ID}

Commands:
  npm run contacts:list      List all contacts in your segment
  npm run contacts:add       Add a contact interactively

Note: You can also manage contacts directly in the Resend dashboard.
      `);
  }
}

// Run if executed directly
main().catch(console.error);
