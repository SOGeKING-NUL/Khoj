"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

export default function Nav(){

  const {user, isLoaded, isSignedIn}= useUser();
  const { signOut }= useClerk();
  const [showDropdown, setShowDropdown]= useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    function handleClickOutsideDropdown(event: MouseEvent){
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
            setShowDropdown(false);
        };
    }          

    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => document.removeEventListener('mousedown', handleClickOutsideDropdown);
  }, []);

  return(
    <nav className="flex w-full justify-between items-center px-6 py-4">
        <Link href='/' className= "text-xl font-bold text-forground">Khoji</Link>

        {isSignedIn && isLoaded && (
            <div className='relative flex items-center' ref={dropdownRef}>
            <span className= 'text-foreground px-4'>
                {user?.firstName || "User"}
            </span>

            <button onClick={()=> setShowDropdown(true)} className="rounded-full overflow-hidden w-10 h-10">
                <img src={user.imageUrl} alt= "P" className="object-cover"/>
            </button>

            {showDropdown && (
                <div className=" absolute right-0 top-full mt-2 bg-white dark:bg-grey-800 border rounded md shadow-lg">
                    <button onClick={()=> signOut()}>SIGNOUT</button>
                </div>
            )}

            </div>
        )}

        {isLoaded && !isSignedIn && (
            <Link href="/auth">Sign In</Link>
        )}


    </nav>
  )
}