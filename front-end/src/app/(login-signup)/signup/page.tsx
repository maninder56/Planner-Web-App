'use client'

import { useState } from "react";
import SignupForm from "../components/signupForm";
import { SignupUserRequest } from "../Services/User";
import { appRoute } from "@/Types/appRoutes";
import { permanentRedirect } from "next/navigation";

export default function Signup() {
    const [fromError, setFormError] = useState(''); 
    
    async function handleFormSubmit(useData: { name: string; email: string; password: string; }) {
        const apiResult = await SignupUserRequest(useData); 

        if (apiResult.ok) {
            const dashboard: appRoute = '/dashboard'; 
            permanentRedirect(dashboard); 
        } else if (apiResult.error === 'Conflict'){
            setFormError('An account with this email already exists.'); 
        } else if (apiResult.error === 'BadRequest') {
            setFormError('Invalid User details'); 
        } else {
            setFormError('Something went wrong, Please try again later'); 
        }
    }

    return (
        <div>
            <SignupForm onSubmit={handleFormSubmit} formError={fromError} />
        </div>
    ); 
}