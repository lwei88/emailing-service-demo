import Worker from './utils/messageQueue/worker';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Email from './email/models/Email';

dotenv.config({ path: process.env.ENV_FILE });

const sendEmail = async (email: Email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_SERVER_USER,
      pass: process.env.SMTP_SERVER_PASS,
    },
  });

  await transporter.sendMail({
    ...email,
  });
};

const w = new Worker<Email>(sendEmail);
w.start(process.env.MESSAGEQUEUE_CONNECTION as string, 'email-queue');
