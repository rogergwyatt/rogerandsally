"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import SocialLinks from "@/controls/sociallinks";
import Navigation from "@/controls/navigation";
import HamburgerMenu from "@/controls/hamburgerMenu";
import { nanum } from '@/controls/fonts'
import { Toaster, toast } from 'sonner';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Script from 'next/script';
import http from 'https';
import {SWRConfig, useSWRConfig} from 'swr';
import useSWR from 'swr';
import FooterSection from '@/controls/footerSection';
import TopSection from '@/controls/topSection';
import GoogleAnalytics from '@/controls/googleAnalytics';
 
var apikey:any = "zbk_V2015xuPCsk2BdSZeNhxNYud-WCYHfTthmBQT1jDptvcTRxdaPvy9gCpg";
var chunks:any[] = [];



export default function Page() {

    function SearchParms(){

      const searchParams = useSearchParams();
      setServiceName(searchParams.get('service_name'));
      setCustomerID(searchParams.get('customer_id'));
      return(
        <div></div>
      )
    }
    
    function FetchCustomerSWR(){
    
        const config = useSWRConfig();
        console.log('calling :' + '/api/customer/'+customer_id)
        const { data } = useSWR('/api/customer/'+customer_id);
      
        //setEmail(data.email);
        //setPhoneNumber(data.phone_number);

        return(<div></div>);
      
    }
        const [phone_number, setPhoneNumber] = useState<any>('');
        const [emailAddress, setEmail] = useState<any>('');
        const [service_name, setServiceName] = useState<any>('');
        const [customer_id, setCustomerID] = useState<any>('');

        return (
          <main className={"flex min-h-screen flex-col items-center  p-0 " + nanum.className}>
          <Suspense>
            <SearchParms/>
          </Suspense>
          <SWRConfig
                value={{
                    fetcher: async (url:string) => {
                        var value:any = "default";
                        const res = await fetch(url, {
                            headers: {
                                'Content-Type': 'application/json'                          
                              }
                        })
                        .then(async (res:any)=>{
                          value = await res.json();
                          if(value.email){
                              setEmail(value.email);
                          }
                          if(value.phone){
                            setPhoneNumber(value.phone);  
                          } 
                          return(value);
                        });
                        return value;
                    },
                }}
            >
              <FetchCustomerSWR/>
          </SWRConfig>

            <Toaster richColors/>
            <a id="top"/>
            <TopSection/>

            <div id="contentBody" className="z-50 w-full max-w-max items justify between content-center">
                <div className="lg:w-full items justify-center content-center mx-auto">
                    <div className = "flex-none">
                      <div className="flex w-full max-w-fullx text-3xl font-bold justify-center mb-3 mt-10">
                        Thank You!
                      </div>
                      <div className="block  w-full max-w-fullx text-l">
                        Thank you for booking a {service_name} with us! <br/>
                        We will contact you at {emailAddress} or +1{phone_number}<br/>
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