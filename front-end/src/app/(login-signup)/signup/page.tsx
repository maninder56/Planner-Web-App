'use client'

import { useState } from "react";
import SignupForm from "../components/signupForm";
import { ApiRequest } from "@/Services/ApiRequest";
import { SignupUserRequest } from "../Services/User";
import { appRoute } from "@/Types/appRoutes";
import { permanentRedirect } from "next/navigation";

export default function Signup() {
    const [fromError, setFormError] = useState(''); 
    
    async function handleFormSubmit(useData: { name: string; email: string; password: string; }) {
        const apiResult = await ApiRequest(SignupUserRequest, useData); 

        if (apiResult.ok) {
            const dashboard: appRoute = '/dashboard'; 
            permanentRedirect(dashboard); 
        } else if (apiResult.error === 'BadRequest'){
            setFormError('Invalid Email, Please use another Email'); 
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