"use client";
import React,{useState} from 'react';

import FormErrors from './formerrors';
import ConfigData from './settings.json';
import { toast } from 'sonner';
import {useRouter} from "next/navigation"
import { sendMail } from '@/helpers/emailer';
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST; 
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME; 
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD; 
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

interface IFormErrors {
        name:string[], 
        phone:string[], 
        email:string[], 
        zipcode:string[], 
        pets:string[],
        message:string[]
}

interface IFocusAreas {
  den : boolean,
  kitchen : boolean,
  diningRoom: boolean,
  bathrooms: boolean,
  bedrooms: boolean,
  sofa_chairs: boolean,
  laundry: boolean,
  accidents: boolean,
  odors: boolean
}


export default function ContactForm() {

 

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [zipcode, setZipCode] = useState('');
    const [pets, setPets] = useState('');
    const [formErrors, setFormErrors] = useState<IFormErrors>({name:[], email: [], phone: [], message: [], zipcode: [], pets:[]});
    const router = useRouter();
    const [maillist, setMailList] = useState(true);
  
    const handleSubmit = async (e:any) => {
      e.preventDefault();

      if (validateForm())
      {
        const response = await sendMail({
          email: email,
          subject: 'Contact Form Submission',
          text: message,
          name: name,
          phone: phone,
          zipcode: zipcode
        }).then((response)=>{
          if (response?.messageId) {
            toast.success('Message sent successfully.');
            const params = {name:name, email:email, phone:phone};
            /* if (maillist) {
              postContact(params);
            }
              */
            resetForm();
            router.push("/thankyou?email_address="+email + "&phone_number="+phone);
          } else {
              console.log(SITE_MAIL_RECIEVER);
              console.log(SMTP_SERVER_HOST);
              console.log(SMTP_SERVER_USERNAME);
              console.log(SMTP_SERVER_PASSWORD);
            toast.error('Failed to send message. Please call us.');
          }
        })
      } 
    }

    const resetForm = () => {
      setName("");
      setEmail("");
      setMessage("");
      setPhone("");
      setZipCode("");
      setPets("");
      setFormErrors({name:[], email: [], phone: [], message: [], zipcode:[], pets:[]});
    }

    const validateForm = () =>{
      let valErrors:any = {name:[], email:[], zipcode:[] = [], message:[] = [], phone:[] = [], pets:[] = []};
      let formIsValid = true;

      if (email !== ''){
        let lastAtPos = email.lastIndexOf("@");
        let lastDotPos = email.lastIndexOf(".");
  
        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            email.indexOf("@@") === -1 &&
            lastDotPos > 2 &&
            email.length - lastDotPos > 2
          )
        ) {
          formIsValid = false;
          valErrors.email = [...valErrors.email, "Email is not valid"];
        }
      } else {
        formIsValid = false;
        valErrors.email = [...valErrors.email,'Email must not be blank'];
      }
      if(name === '')
      {        
        formIsValid = false;
        valErrors.name = [...valErrors.name,'Name must not be blank'];
      }
      if(phone === '')
      {        
        formIsValid = false;
        valErrors.phone = [...valErrors.phone, 'Phone must not be blank'];
      }      
      if(message === '')
      {        
        formIsValid = false;
        valErrors.message = [...valErrors.message,'Message must not be blank'];
      }
      if(zipcode ==='')
      {
        formIsValid = false;
        valErrors.zipcode = [...valErrors.zipcode,'ZipCode must not be blank'];
      } else if (zipcode != '')
      {
        if(ConfigData.validZipCodes.indexOf(zipcode) === -1)
        {
            valErrors.zipcode = [...valErrors.zipcode, 'We are currently not available in your area, but we received your message'];
        }
      }

      setFormErrors({
        name:[...valErrors.name],
        email:[...valErrors.email],
        phone:[...valErrors.phone],
        message:[...valErrors.message],
        zipcode:[...valErrors.zipcode],
        pets: [...valErrors.pets]
      });

      return(formIsValid);
    }

    const onNameChange = (event:any) => {
      setName(event.target.value);
    }
    const onEmailChange = (event:any) => {
      setEmail(event.target.value);
    }
    const onMessageChange = (event:any) => {
      setMessage(event.target.value);
    }
    const onPhoneChange = (event:any) => {
      setPhone(event.target.value);
    }
    const onZipChange = (event:any) => {
        setZipCode(event.target.value);
    }

    async function postContact(params:{name:string, email:string, phone:string}) {
      var value:any = "default";
      const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer b51f0783-421b-4f8d-9966-996360f4428d'                  
            },
          body: JSON.stringify(params)
      })
      .then(async (res:any)=>{
        value = await res.json();
        return(value);
      });
      return value;
    }

    return(
        <div id="contactform">
            <FormErrors errors={formErrors}/>
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md border-gray-300">
                <p/>
                <form onSubmit={handleSubmit} className="space-y-1">

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                        <input type="text" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Your Name" required onChange={onNameChange} value={name}/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone</label>
                        <input type="text" id="phone" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="999-999-9999" required onChange={onPhoneChange}value={phone}/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
                        <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@honeyspristineclean.com" required onChange={onEmailChange} value={email}/>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Zip Code</label>
                        <input type="text" id="zipcode" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="12345" required onChange={onZipChange} value={zipcode}/>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
                        <textarea id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border hover:bg-blue-200 border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..." onChange={onMessageChange} value={message}></textarea>
                    </div>
                    <div>
                        <button type="submit" className="py-3 px-5 text-sm font-medium text-center text-black bg-gray-300 hover:bg-blue-200 rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Send Message Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}