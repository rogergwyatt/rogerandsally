
'use client'
import Image from "next/image";
import { sofadi, nanum } from '@/controls/fonts'
import { Toaster, toast } from 'sonner';
import GoogleAnalytics from "@/controls/googleAnalytics";
import FooterSection from "@/controls/footerSection";
import TopSection from "@/controls/topSection";
import {useState} from 'react';
import {useRouter} from "next/navigation"
import { sendMail } from '@/helpers/attachmentMailer';

interface IFormErrors {
  name:string[], 
  email:string[]
}

export default function Page() {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const bookingURL = process.env.SITE_BOOKING_URL;
    const router = useRouter();

    const handleSubmit = async (e:any) => {
        
        e.preventDefault();

        var messageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honey&apos;s Pristine Clean - Thank You!</title>
    <style>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .header h1 {
            color: #1E88E5; /* Blue tone for header */
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #42A5F5; /* Lighter blue for button */
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Honey&apos;s Pristine Clean</h1>
        </div>
        <div class="content">
            <p>Thank you for signing up for our email list! We&apos;re delighted to have you join our journey!</p>
            <p>Warm regards,</p>
            <p>Roger &ampl Sally</p>
        </div>
        <div class="footer">
            <p>Roger &ampl Sally | (804) 464-8162 | sales.rogerandsally.com</p>
            <p>The Heritage Lock</p>
        </div>
    </div>
</body>
</html>`;
      messageHTML.replace("[Customer Name]",name);
    
        const params = {name:name, email:email};
        if(validateForm()){
          postContact(params)
          .then(()=>{
          })
          .then(()=>{
            router.push('/');
          });
        }
        
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
    
    
        return(formIsValid);
      }


      async function postContact(params:{name:string, email:string}) {
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
    
      const onEmailChange = (event:any) => {
        setEmail(event.target.value);
      }
      const onNameChange = (event:any) => {
        setName(event.target.value);
      }

        return (
          <main className={"flex min-h-screen flex-col items-center  p-0 " + nanum.className}>
            <Toaster richColors/>
            <a id="top"/>
            <TopSection/>
            <div id="contentBody" className="w-full max-w-max items justify between content-center">
                <div className="items content-center mx-auto">
                    <div className = "flex-none w-[60%] justify-center mx-auto">
                      <div className="flex w-full max-w-fullx text-3xl font-bold justify-center mb-3 mt-10">
                        Join the Journey
                      </div>
                      <div className="flex text-xl w-[60%] text-wrap max-w-fullx w-full mx-auto">
                        We invite you to join the journey. We will send out new products and boards and keep you updated<br/>
                        on where we are with out journey to Tennessee.
                        <br/>
                        So, join us today!
                      </div>
                      <div className="text-l mx-auto justify-center items items-center">
                          <div className="">
                            <form onSubmit={handleSubmit} className="">
                                <div className="pt-5">
                                    <input type="text" id="name" className="mx-auto lg:w-80 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Name" required onChange={onNameChange} />
                                </div>
                                <div className="pt-5">
                                    <input type="text" id="email" className="mx-auto lg:w-80 shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-blue-200 focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Email Address" required onChange={onEmailChange} />
                                </div>
                                <div className="pt-5 justify-center flex">
                                    <button type="submit" className="mx-auto py-3 px-5 text-sm font-medium text-center text-black bg-yellow-500 hover:bg-blue-200 rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                        Sign Me Up!
                                    </button>
                                </div>
                            </form>
                          </div>
                      </div>
                    </div>
                    
                </div>
            </div>        

      <div className="lg:w-[60%] items center justify-center content-center mx-auto">
          <FooterSection/>
      </div>

    <div className="min-w-full min-h-10 bg-blue-900 flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
    )
  }

