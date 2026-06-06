'use client'
import Link from 'next/link'
import CartIcon from './cartIcon'

export default function Navigation() {
    return (
        <div>
            <div id="menu" className="p-2 lg:py-5 lg:px-3 flex lg:text-lg items-center gap-x-6 lg:gap-x-8 whitespace-nowrap">
                <Link href="/" className="hover:text-blue-300">Home</Link>
                <Link href="/#whyChoose" className="hover:text-blue-300">The Heritage Lock</Link>
                <Link href="/#products" className="hover:text-blue-300">Products</Link>
                <Link href="/#gallery" className="hover:text-blue-300">Gallery</Link>
                <Link href="/#aboutus" className="hover:text-blue-300">About Us</Link>
                <Link href="/#contactform" className="hover:text-blue-300">Contact Us</Link>
                <Link href="/shop" className="hover:text-blue-300">Shop</Link>
                <Link href="/custom-order" className="hover:text-blue-300">Custom Order</Link>
                <CartIcon />
            </div>
        </div>
    );
}
