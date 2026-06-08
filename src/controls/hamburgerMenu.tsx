'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import CartIcon from './cartIcon';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="mh-50">
        <button type="button" onClick={handleClick}
          className="flex flex-col justify-center items-center h-[50px]">
          <span className="bg-gray-600 dark:bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm"></span>
          <span className="bg-gray-600 dark:bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mt-2"></span>
          <span className="bg-gray-600 dark:bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm mt-2"></span>
        </button>
      </div>
      <div className={isOpen ? "block" : "hidden"}>
        <div className="absolute top-0 right-0 px-10 py-10" onClick={handleClick}>
          <svg className="h-8 w-8 text-gray-600" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <ul className="flex flex-col items-center justify-between min-h-[250px] z-80">
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/#top" onClick={handleClick}>Home</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/#whyChoose" onClick={handleClick}>The Heritage Lock</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/#gallery" onClick={handleClick}>Gallery</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/#aboutus" onClick={handleClick}>About Us</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/philosophy" onClick={handleClick}>Our Philosophy</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/#contactform" onClick={handleClick}>Contact Us</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/shop" onClick={handleClick}>Shop</Link>
          </li>
          <li className="border-b border-gray-400 my-8 uppercase">
            <Link href="/custom-order" onClick={handleClick}>Custom Order</Link>
          </li>
          <li className="my-8">
            <CartIcon />
          </li>
        </ul>
      </div>
    </div>
  );
}
