'use client'
import React,{useState} from 'react';
import Link from 'next/link';

import { MenuItem } from './menuitems';

interface Props {
    item: MenuItem;
}

export default function Dropdown(props: Props) {
    const { item } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuItems = item?.children ? item.children : [];

    const toggle = () => {
        setIsOpen(old => !old);
    }

    const transClass = isOpen
        ?
        "flex"
        :
        "hidden";

    return (
        <div>
            <div className="relative">
                <button
                    className="hover:text-blue-400"
                    onClick={toggle}
                >
                    {item.title}
                    <svg className="w-2.5 h-2.5 ms-3 flex" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>
                <div className={`absolute top-8 z-30 w-[250px] min-h-[100px] flex flex-col py-4 bg-zinc-200 rounded-md ${transClass}`}>
                    {
                        menuItems.map(item =>
                            <Link
                                key={item.route}
                                className="hover:bg-zinc-300 hover:text-zinc-500 px-4 py-1"
                                href={item?.route || ''}
                                onClick={toggle}
                            >{item.title}</Link>
                        )
                    }
                </div>
            </div>
            {
                isOpen
                    ?
                    <div
                        className="fixed top-0 right-0 bottom-0 left-0 z-20 "
                        onClick={toggle}
                    ></div>
                    :
                    <></>
            }
        </div>
    )
}