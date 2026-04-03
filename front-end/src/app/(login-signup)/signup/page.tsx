'use client'

import { useState } from "react";
import SignupForm from "../components/signupForm";
import { SignupUserRequest } from "../Services/User";
import { AppRoute } from "@/Types/appRoutes";
import { permanentRedirect } from "next/navigation";
import { useBoardStore } from "@/app/dashboard/Store/boardStore";
import { useUserStore } from "@/Store/userStore";

export default function Signup() {
    const [fromError, setFormError] = useState(''); 
    const resetBoardData = useBoardStore((state) => state.resetBoardData); 
    const resetUserData = useUserStore((state) => state.resetUserData); 
    
    const dashboard: AppRoute = '/dashboard'; 

    async function handleFormSubmit(useData: { name: string; email: string; password: string; }) {
        const apiResult = await SignupUserRequest(useData); 

        if (apiResult.ok) {
            // clear any previous data
            resetBoardData(); 
            resetUserData(); 
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