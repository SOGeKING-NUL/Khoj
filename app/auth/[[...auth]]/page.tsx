"use client";
import { SignIn } from "@clerk/nextjs";

export default function AuthPage(){
    return(
        <div className= 'flex min-h-screen items-center justify-center'>
            <SignIn routing="path" path="/auth" />
        </div>
    )
}