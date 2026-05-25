'use server'
import {cookies} from 'next/headers';

export default async function SetCookie(name:any, value:any){
    cookies().set(name, value);
}

export async function GetCookie(name:any){
    return( cookies().get(name));
}

export async function DelCookie(name:any){
    return(cookies().delete(name));
}