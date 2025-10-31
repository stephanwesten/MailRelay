/**
 * MailRelay - Simple Email Relay Service
 * Cloudflare Worker with MailChannels integration
 */

export interface Env {
  PERSONAL_EMAIL: string;
  WORK_EMAIL: string;
  MAILCHANNELS_API_KEY: string;
  PINCODE: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Simple HTML page for deployment test
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MailRelay</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">📧 MailRelay</h1>
    <p class="text-gray-600 mb-4">Email relay service deployed successfully!</p>
    <div class="bg-green-50 border border-green-200 rounded p-4">
      <p class="text-green-800 text-sm font-medium">✓ Deployment Test Successful</p>
      <p class="text-green-600 text-xs mt-1">Worker is running on Cloudflare</p>
    </div>
  </div>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
};
