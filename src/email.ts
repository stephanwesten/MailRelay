/**
 * Email service using MailChannels API
 * https://mailchannels.zendesk.com/hc/en-us/articles/4565898358413-Sending-Email-from-Cloudflare-Workers-using-MailChannels-Send-API
 */

export interface EmailParams {
  to: string;
  subject: string;
  message: string;
  fromEmail: string;
  fromName: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Validate email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send email via MailChannels API
 */
export async function sendEmail(params: EmailParams): Promise<EmailResult> {
  const { to, subject, message, fromEmail, fromName } = params;

  // Validation
  if (!subject || subject.trim().length === 0) {
    return {
      success: false,
      error: 'Subject is required',
    };
  }

  if (!isValidEmail(to)) {
    return {
      success: false,
      error: 'Invalid email address',
    };
  }

  if (!isValidEmail(fromEmail)) {
    return {
      success: false,
      error: 'Invalid from email address',
    };
  }

  // Build MailChannels API payload
  const payload = {
    personalizations: [
      {
        to: [{ email: to }],
      },
    ],
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: subject,
    content: [
      {
        type: 'text/plain',
        value: message,
      },
    ],
  };

  try {
    // Send via MailChannels API
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `MailChannels API error: ${response.status} - ${errorText}`,
      };
    }

    // MailChannels returns 202 Accepted on success
    return {
      success: true,
      messageId: response.headers.get('X-Message-Id') || undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
