import { NextRequest, NextResponse } from "next/server";
import { ReadableStream } from "stream/web";

import {SWRConfig, useSWRConfig} from 'swr';
import useSWR from 'swr';
import { QueryResultRow, sql } from "@vercel/postgres";
import {headers} from 'next/headers';


export async function POST(req: NextRequest) {
  const params:any = await req.json();

  const headersList = headers();
  const referer = headersList.get('referer');
  const apikey = headersList.get('Authorization');
  console.log("header apikey");
  console.log(apikey);

  var outrows = {};
  var result = {};
  if(apikey == 'Bearer b51f0783-421b-4f8d-9966-996360f4428d'){
    const { rows } = await sql`select * from contacts where ${params.email}  in (select email from contacts)`;
    if (rows.length == 0) {
        await sql `insert into contacts (name, email) values (${params.name}, ${params.email})`;
    };
    result = {success:true}
  } else {
    result = {success:false}
  }
  console.log("API response");
  console.log(result);
  return NextResponse.json(result);
};

export async function GET(req: NextRequest) {
  const headersList = headers();
  const referer = headersList.get('referer');
  const apikey = headersList.get('Authorization');
  var result = {};

  if(apikey == 'Bearer '+process.env.HPC_API){
      console.log(apikey + ' != ' + 'Bearer '+process.env.HPC_API);
      const { rows } = await sql`select * from contacts`;
      result = {success:true, rows};
  }else{
    result = {success:false, rows:[]};
  }
  return NextResponse.json(result);
};

