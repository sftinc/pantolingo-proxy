# @pantolingo/smtp

Shared SMTP email package using nodemailer.

## Overview

This package provides a simple interface for sending emails via SMTP. Works with any SMTP provider (AWS SES, SendGrid, Mailgun, Gmail, etc.).

## Environment Variables

| Variable        | Required | Description                                      |
| --------------- | -------- | ------------------------------------------------ |
| `SMTP_HOST`     | Yes      | SMTP server hostname                             |
| `SMTP_USER`     | Yes      | SMTP username                                    |
| `SMTP_PASSWORD` | Yes      | SMTP password                                    |
| `SMTP_PORT`     | No       | SMTP port (default: 587)                         |
| `SMTP_SECURE`   | No       | Use implicit TLS (default: false, use STARTTLS)  |

**Note:** Use `SMTP_SECURE=true` with port 465 for implicit TLS. Leave false (default) for port 587 with STARTTLS.

## Usage

```typescript
import { sendEmail, verifyConnection, closeConnection } from "@pantolingo/smtp";

// Send an email
const result = await sendEmail({
    from: '"Pantolingo" <noreply@pantolingo.com>',
    to: "user@example.com",
    subject: "Hello",
    text: "Plain text body",
    html: "<b>HTML body</b>",
});

if (result.success) {
    console.log("Sent:", result.messageId);
} else {
    console.error("Failed:", result.error);
}

// Verify SMTP connection
const connected = await verifyConnection();

// Close connection when done (optional, for cleanup)
closeConnection();
```

## API

### `sendEmail(options: EmailOptions): Promise<SendResult>`

Send an email.

### `verifyConnection(): Promise<boolean>`

Test the SMTP connection. Returns `true` if successful.

### `closeConnection(): void`

Close the SMTP connection and reset the transporter.
