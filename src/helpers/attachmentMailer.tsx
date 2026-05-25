'use server';
import { url } from 'inspector';
import nodemailer from 'nodemailer';
import path from 'path';

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
  message,
  html,
  attachment
}: {
  email: string;
  sendTo?: string;
  subject: string;
  message: string;
  html?: string;
  attachment?: {
    name: string, 
    path: string
    };
}) {
  try {
    const isVerified = await transporter.verify()
    .then(async ()=>{
        const info = await transporter.sendMail({
            from: email,
            to: sendTo || SITE_MAIL_RECIEVER,
            subject: subject,
            text: message,
            html: html ? html : '',
            attachments: [
                {
                    filename: attachment?.name,
                    path: attachment?.path
                }
            ]
          })
            console.log('Message Sent', info.messageId);
            console.log('Mail sent to', SITE_MAIL_RECIEVER);
            return info;
    });
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }
  

}