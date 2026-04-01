'use client'


import FormInput from '@/Components/Inputs/formInput';
import { useState } from 'react';
import LoginForm from '../components/loginForm';
import { LogInUserRequest } from '../Services/User';
import { permanentRedirect } from 'next/navigation';
import { AppRoute } from '@/Types/appRoutes';


export default function Login() {
    const [fromError, setFormError] = useState(''); 

    async function handleFormSubmit(userData: { email: string, password: string }) {
        const apiResult = await LogInUserRequest(userData); 

        if (apiResult.ok) {
            const dashboard: AppRoute = '/dashboard'; 
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