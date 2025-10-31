import { describe, it, expect, vi } from 'vitest';
import { sendEmail } from './email';

describe('MailChannels Email Service', () => {
  describe('sendEmail', () => {
    it('should send email successfully with valid parameters', async () => {
      // GREEN: sendEmail now exists and should pass validation
      const mockEnv = {
        PERSONAL_EMAIL: 'personal@example.com',
        WORK_EMAIL: 'work@example.com',
        FROM_EMAIL: 'noreply@test.com',
        FROM_NAME: 'MailRelay',
        PINCODE: 'test123',
        MAILCHANNELS_API_KEY: 'test-key',
      };

      const result = await sendEmail({
        to: mockEnv.PERSONAL_EMAIL,
        subject: 'Test Subject',
        message: 'Test message body',
        fromEmail: mockEnv.FROM_EMAIL,
        fromName: mockEnv.FROM_NAME,
      });

      expect(result.success).toBe(true);
    });

    it('should fail when subject is missing', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: '',
        message: 'Test message',
        fromEmail: 'from@test.com',
        fromName: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('subject');
    });

    it('should fail when email address is invalid', async () => {
      const result = await sendEmail({
        to: 'invalid-email',
        subject: 'Test',
        message: 'Test message',
        fromEmail: 'from@test.com',
        fromName: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('email');
    });
  });
});
