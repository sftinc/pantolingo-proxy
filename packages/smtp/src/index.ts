import nodemailer from "nodemailer";
import type { Transporter, SentMessageInfo } from "nodemailer";

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
}

export interface EmailOptions {
    from: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
}

export interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

let transporter: Transporter<SentMessageInfo> | null = null;

function getConfig(): SmtpConfig {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;

    if (!host || !user || !password) {
        throw new Error(
            "Missing SMTP configuration. Required env vars: SMTP_HOST, SMTP_USER, SMTP_PASSWORD"
        );
    }

    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    if (isNaN(port)) {
        throw new Error("SMTP_PORT must be a valid number");
    }

    const secure = process.env.SMTP_SECURE === "true";

    return {
        host,
        port,
        secure,
        user,
        password,
    };
}

function getTransporter(): Transporter<SentMessageInfo> {
    if (!transporter) {
        const config = getConfig();
        transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });
    }
    return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<SendResult> {
    try {
        const transport = getTransporter();
        const result = await transport.sendMail({
            from: options.from,
            to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            replyTo: options.replyTo,
        });

        return {
            success: true,
            messageId: result.messageId,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function verifyConnection(): Promise<boolean> {
    try {
        const transport = getTransporter();
        await transport.verify();
        return true;
    } catch {
        return false;
    }
}

export function closeConnection(): void {
    if (transporter) {
        transporter.close();
        transporter = null;
    }
}
