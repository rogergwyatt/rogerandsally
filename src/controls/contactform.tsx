"use client";
import React, { useState } from 'react';
import FormErrors from './formerrors';
import ConfigData from './settings.json';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { sendMail } from '@/helpers/emailer';

interface IFormErrors {
  name: string[];
  phone: string[];
  email: string[];
  zipcode: string[];
  message: string[];
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [formErrors, setFormErrors] = useState<IFormErrors>({ name: [], email: [], phone: [], message: [], zipcode: [] });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await sendMail({
      email,
      subject: 'Contact Form Submission',
      text: message,
      name,
      phone,
      zipcode,
    });

    if (response?.messageId) {
      toast.success('Message sent successfully.');
      resetForm();
      router.push(`/thankyou?email_address=${email}&phone_number=${phone}`);
    } else {
      toast.error('Failed to send message. Please call us.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMessage('');
    setPhone('');
    setZipCode('');
    setFormErrors({ name: [], email: [], phone: [], message: [], zipcode: [] });
  };

  const validateForm = () => {
    const valErrors: IFormErrors = { name: [], email: [], phone: [], message: [], zipcode: [] };
    let formIsValid = true;

    if (email === '') {
      formIsValid = false;
      valErrors.email.push('Email must not be blank');
    } else {
      const lastAtPos = email.lastIndexOf('@');
      const lastDotPos = email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && email.length - lastDotPos > 2)) {
        formIsValid = false;
        valErrors.email.push('Email is not valid');
      }
    }

    if (name === '') {
      formIsValid = false;
      valErrors.name.push('Name must not be blank');
    }

    if (phone === '') {
      formIsValid = false;
      valErrors.phone.push('Phone must not be blank');
    }

    if (message === '') {
      formIsValid = false;
      valErrors.message.push('Message must not be blank');
    }

    if (zipcode === '') {
      formIsValid = false;
      valErrors.zipcode.push('Zip Code must not be blank');
    } else if (ConfigData.validZipCodes.indexOf(zipcode) === -1) {
      valErrors.zipcode.push('We are currently not available in your area, but we received your message');
    }

    setFormErrors(valErrors);
    return formIsValid;
  };

  return (
    <div id="contactform">
      <FormErrors errors={formErrors} />
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md border-gray-300">
        <p />
        <form onSubmit={handleSubmit} className="space-y-1">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              type="text" id="name"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="Your Name" required onChange={e => setName(e.target.value)} value={name}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
            <input
              type="text" id="phone"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="999-999-9999" required onChange={e => setPhone(e.target.value)} value={phone}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
            <input
              type="email" id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="name@example.com" required onChange={e => setEmail(e.target.value)} value={email}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Zip Code</label>
            <input
              type="text" id="zipcode"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
              placeholder="12345" required onChange={e => setZipCode(e.target.value)} value={zipcode}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
            <textarea
              id="message" rows={6}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border hover:bg-blue-200 border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Leave a comment..." onChange={e => setMessage(e.target.value)} value={message}
            />
          </div>
          <div>
            <button
              type="submit"
              className="py-3 px-5 text-sm font-medium text-center text-black bg-gray-300 hover:bg-blue-200 rounded-lg sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300"
            >
              Send Message Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
