'use client'
import Link from "next/link";
import {ModalContext} from '@/controls/heroarea';

import {createContext, useContext, useState} from 'react'

export default function Modal(props:any) {

    const setShowModal = useContext(ModalContext);
    var showModal = props.showModal;
    

    return ( 
      <div className="z-50">  
        {showModal && 
        <div id="modal" className="fixed z-[9999] inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border shadow-lg rounded-md bg-white bg-opacity-80">
              <div className="text-center">
                {props.content}
                <div className="flex justify-right mt-4">

                    <button  onClick={() => setShowModal(false)}>
                      <span className="text-xs text-red-900 hover:text-black">Nope, I want to be uninformed right now</span>
                    </button>
      
                </div>
              </div>
            </div>
            </div>
            }
      </div>
    );
  }