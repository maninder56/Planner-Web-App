'use client'


import FormInput from '@/Components/Inputs/formInput';
import { useState } from 'react';
import LoginForm from '../components/loginForm';
import { LogInUserRequest } from '../Services/User';
import { permanentRedirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';
import { useBoardStore } from '@/app/dashboard/Store/boardStore';
import { useUserStore } from '@/Store/userStore';


export default function Login() {
    const resetBoardData = useBoardStore((state) => state.resetBoardData); 
    const resetUserData = useUserStore((state) => state.resetUserData); 
    
    const [fromError, setFormError] = useState(''); 

    const dashboard: AppRoute = '/dashboard'; 
    
    async function handleFormSubmit(userData: { email: string, password: string }) {
        const apiResult = await LogInUserRequest(userData); 

        if (apiResult.ok) {
            // Clear any previous data
            resetBoardData(); 
            resetUserData(); 

            permanentRedirect(dashboard); 
        } else if (apiResult.error === 'BadRequest' || apiResult.error === 'NotFound') {
            setFormError('Invalid Email or Password'); 
        } else {
            setFormError('Something went wrong, Please try again later'); 
        }
    }

    return (
        <div>
            <LoginForm onSubmit={handleFormSubmit} formError={fromError} />
        </div>
    ); 
}