'use server';

import { logger } from '@/lib/logger';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_SENDER = process.env.SITE_MAIL_SENDER;
const SMTP_SERVER_PORT = process.env.SITE_SERVER_PORT;
const SMTP_SERVER_SECURE = process.env.SITE_SERVER_SECURE;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: Number(SMTP_SERVER_PORT) ?? 0,
  secure: SMTP_SERVER_SECURE === 'true',
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail(to: string, subject: string, text: string, html: string = '') {
  try {
    await transporter.verify();
  } catch (error) {
    logger.error(`Mail transport is unavailable: ${error}`);
    return;
  }

  const info = await transporter.sendMail({
    from: SITE_MAIL_SENDER,
    to,
    subject,
    text,
    html,
  });

  logger.info(`Message [${info.messageId}] sent to ${to}`);

  return info;
}
