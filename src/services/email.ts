import nodemailer from "nodemailer";
import { emailConfig } from "../config/index";

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const html = `
    <h1>Welcome ${name}!</h1>
    <p>Thank you for joining us. We're excited to have you on board.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Welcome to Our Platform",
    html,
  });
};
