'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST; 
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME; 
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD; 
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  name,
  text,
  phone,
  zipcode,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  name: string
  text: string;
  phone: string;
  zipcode: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }
  var messageText = "name : " + name + "\r\nphone: " + phone + "\r\nzipcode: " + zipcode + "\r\nMessage: " + text;
  
  const info = await transporter.sendMail({
    from: email,
    to: sendTo || SITE_MAIL_RECIEVER,
    subject: subject,
    text: messageText,
    html: html ? html : '',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', SITE_MAIL_RECIEVER);
  return info;
}