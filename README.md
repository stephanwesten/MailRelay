# MailRelay
Email relay with web form and API. Toggle between personal/work addresses, built with Cloudflare Workers + MailChannels


# Project Specifications

## Overview

MailRelay is an email relay service built on Cloudflare Workers using MailChannels. It provides both a web interface and REST API for sending emails to pre-configured personal and work addresses.

-----

## Core Features

### 1. Web Form Interface

- **Address Toggle**: Switch between personal and work email addresses
- **Subject Field**: Text input for email subject line
- **Message Field**: Textarea for email body/description
- **Submit Button**: Send email via form submission
- **Success/Error Feedback**: Visual confirmation of email delivery status

### 2. REST API

- **POST Endpoint**: `/api/send` for programmatic email sending
- **Authentication**: API key/token for secure access
- **JSON Payload**: Accepts structured email data
- **Response Codes**: Standard HTTP status codes with error messages

-----

## Technical Stack

### Backend

- **Runtime**: Cloudflare Workers
- **Email Provider**: MailChannels API
- **Language**: JavaScript/TypeScript
- **Deployment**: Wrangler CLI

### Frontend

- **Framework**: Vanilla HTML/CSS/JS (or specify if you want React, etc.)
- **Styling**: TailwindCSS / plain CSS
- **Hosting**: Served from same Cloudflare Worker

-----

## Configuration

### Environment Variables

```
PERSONAL_EMAIL=your-personal@example.com
WORK_EMAIL=your-work@example.com
MAILCHANNELS_API_KEY=xxx
API_AUTH_TOKEN=xxx (for API endpoint security)
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=MailRally
```

-----

## API Specification

### POST `/api/send`

**Headers:**

```
Authorization: Bearer {API_AUTH_TOKEN}
Content-Type: application/json
```

**Request Body:**

```json
{
  "destination": "personal" | "work",
  "subject": "string",
  "message": "string"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "destination": "personal"
}
```

**Response (Error - 400/401/500):**

```json
{
  "success": false,
  "error": "Error message description"
}
```

-----

## User Interface Design

### Web Form Layout

```
┌─────────────────────────────────────┐
│          MailRelay 📧               │
├─────────────────────────────────────┤
│                                     │
│  Send To:  ( ) Personal  ( ) Work   │
│                                     │
│  Subject:  [________________]       │
│                                     │
│  Message:  ┌──────────────────┐     │
│            │                  │     │
│            │                  │     │
│            │                  │     │
│            └──────────────────┘     │
│                                     │
│            [  Send Email  ]         │
│                                     │
└─────────────────────────────────────┘
```

Error feedback is crucial. log all information and print all information except for sensitive information like keys to make debugging easier. 
In the API return in the response an error message with as much information as possible. 
-----

## Security Considerations

- API authentication via Bearer token
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for API access
- Environment variables for sensitive data (never in code)

-----

## Deployment Pipeline (GitHub Actions)

### Workflow Triggers

1. **Manual**: Create issue with “@claude setup deployment pipeline”
1. **Automatic**: On push to `main` branch, deploy to Cloudflare

### Pipeline Steps

```yaml
- Checkout code
- Install dependencies
- Run tests (if any)
- Deploy with Wrangler
  - wrangler deploy
  - Use secrets from GitHub
```

-----

## Future Enhancements (Optional)

- llm integration to enhance the subject and description in case of typos. 

-----

**Questions to finalize:**

1. Do you want TypeScript or JavaScript?  depends, typescript requires compilation, but is type safe. depends on github actions. 
1. Any specific styling preferences (minimal, modern, colorful)? minimal but modern. 
1. Should the form have validation (required fields, max length)?  Title is required. 
1. Do you want email confirmation/receipts? no
1. Rate limiting: how many emails per hour/day? 5

