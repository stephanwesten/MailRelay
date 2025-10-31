/**
 * MailRelay - Simple Email Relay Service
 * Cloudflare Worker with MailChannels integration
 */

import { sendEmail } from './email';

export interface Env {
  PERSONAL_EMAIL: string;
  WORK_EMAIL: string;
  PINCODE: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle API endpoint
    if (url.pathname === '/api/send' && request.method === 'POST') {
      return handleApiSend(request, env);
    }

    // Handle form submission
    if (url.pathname === '/' && request.method === 'POST') {
      return handleFormSubmit(request, env);
    }

    // Show web form
    return new Response(getHTML(url), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  },
};

/**
 * Handle API /api/send endpoint
 */
async function handleApiSend(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { pincode, destination, subject, message } = body;

    // Validate pincode
    if (pincode !== env.PINCODE) {
      return jsonResponse({ success: false, message: 'Invalid pincode', data: null }, 401);
    }

    // Validate required fields
    if (!subject || !message) {
      return jsonResponse({ success: false, message: 'Subject and message are required', data: null }, 400);
    }

    // Determine destination email
    const toEmail = destination === 'work' ? env.WORK_EMAIL : env.PERSONAL_EMAIL;

    // Send email
    const result = await sendEmail({
      to: toEmail,
      subject,
      message,
      fromEmail: env.FROM_EMAIL,
      fromName: env.FROM_NAME,
    });

    if (!result.success) {
      return jsonResponse({ success: false, message: result.error || 'Failed to send email', data: null }, 500);
    }

    return jsonResponse({
      success: true,
      message: 'Email sent successfully',
      data: { destination },
    }, 200);

  } catch (error) {
    return jsonResponse({
      success: false,
      message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: null,
    }, 500);
  }
}

/**
 * Handle form submission from web interface
 */
async function handleFormSubmit(request: Request, env: Env): Promise<Response> {
  try {
    const formData = await request.formData();
    const pincode = formData.get('pincode')?.toString() || '';
    const destination = formData.get('destination')?.toString() || 'personal';
    const subject = formData.get('subject')?.toString() || '';
    const message = formData.get('message')?.toString() || '';

    // Validate pincode
    if (pincode !== env.PINCODE) {
      return new Response(getHTML(new URL(request.url), 'Invalid pincode', 'error'), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        status: 401,
      });
    }

    // Validate required fields
    if (!subject || !message) {
      return new Response(getHTML(new URL(request.url), 'Subject and message are required', 'error'), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        status: 400,
      });
    }

    // Determine destination email
    const toEmail = destination === 'work' ? env.WORK_EMAIL : env.PERSONAL_EMAIL;

    // Send email
    const result = await sendEmail({
      to: toEmail,
      subject,
      message,
      fromEmail: env.FROM_EMAIL,
      fromName: env.FROM_NAME,
    });

    if (!result.success) {
      return new Response(getHTML(new URL(request.url), `Failed to send: ${result.error}`, 'error'), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        status: 500,
      });
    }

    return new Response(getHTML(new URL(request.url), `Email sent successfully to ${destination}!`, 'success'), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });

  } catch (error) {
    return new Response(getHTML(new URL(request.url), `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error'), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      status: 500,
    });
  }
}

/**
 * Generate JSON response with consistent structure
 */
function jsonResponse(data: any, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Generate HTML for web form
 */
function getHTML(url: URL, feedbackMessage?: string, feedbackType?: 'success' | 'error'): string {
  const pincode = url.searchParams.get('pincode') || '';
  const showPincodeField = !pincode;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MailRelay</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">📧 MailRelay</h1>

    ${feedbackMessage ? `
      <div class="${feedbackType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border rounded p-4 mb-6">
        <p class="text-sm font-medium">${feedbackType === 'success' ? '✓' : '✗'} ${feedbackMessage}</p>
      </div>
    ` : ''}

    <form method="POST" action="/" class="space-y-4">
      ${showPincodeField ? `
        <div>
          <label for="pincode" class="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="password"
            id="pincode"
            name="pincode"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter pincode"
          />
        </div>
      ` : `
        <input type="hidden" name="pincode" value="${pincode}" />
      `}

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Send To</label>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input type="radio" name="destination" value="personal" checked class="mr-2" />
            <span class="text-sm">Personal</span>
          </label>
          <label class="flex items-center">
            <input type="radio" name="destination" value="work" class="mr-2" />
            <span class="text-sm">Work</span>
          </label>
        </div>
      </div>

      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email subject"
        />
      </div>

      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows="5"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your message"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Send Email
      </button>
    </form>
  </div>
</body>
</html>
  `;
}
