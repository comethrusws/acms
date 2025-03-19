import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    // Create a new user in your database
    await db.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
        role: 'ATTENDEE', // Default role
      },
    });
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    // Update user in your database
    await db.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name || ''} ${last_name || ''}`.trim(),
      },
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    
    // Delete user from your database
    await db.user.delete({ where: { clerkId: id } });
  }

  return new Response('Webhook received', { status: 200 });
}
