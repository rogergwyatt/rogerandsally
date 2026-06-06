'use client'
import React, { useState } from 'react';
import ConfigData from '@/controls/settings.json';
import {track} from "@vercel/analytics";
import CartIcon from './cartIcon';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  
  const handleClick = () => {
      setIsOpen(!isOpen);
  };

  const open1Class = isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5';
  const open2Class = isOpen ? 'opacity-0' : 'opacity-100';
  const open3Class = isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5';

return(
<div>
    <div className="mh-50">
        <button onClick={handleClick} 
            className="flex flex-col justify-center items-center h-[50px]">
            <span className={'bg-gray-600 dark:bg-white block animate-pulse transition-all duration-300 ease-out h-0.5 w-6 rounded-sm '}></span>
            <span className={'bg-gray-600 dark:bg-white block animate-pulse transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mt-2'} ></span>
            <span className={'bg-gray-600 dark:bg-white block animate-pulse transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mt-2'} ></span>    
        </button>
    </div>
    <div className={isOpen ? "block" : "hidden"}>
        <div
            className="absolute top-0 right-0 px-10 py-10"
            onClick={handleClick}
        >
            <svg
            className="h-8 w-8 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </div>
        <ul className="flex flex-col items-center justify-between min-h-[250px] z-80">
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#top" onClick={handleClick}>Home</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#aboutus" onClick={handleClick}>About</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#whyChoose" onClick={handleClick}>The Heritage Lock</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#products" onClick={handleClick}>Products</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#gallery" onClick={handleClick}>Gallery</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="#contactus" onClick={handleClick}>Contact Us</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/shop" onClick={handleClick}>Shop</a>
            </li>
            <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/custom-order" onClick={handleClick}>Custom Order</a>
            </li>
            <li className="my-8">
                <CartIcon />
            </li>
        </ul>
    </div>
</div>
)
};
