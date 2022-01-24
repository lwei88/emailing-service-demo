import Worker from './utils/messageQueue/worker';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import Email from './email/models/Email';

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
w.start('email-queue');
