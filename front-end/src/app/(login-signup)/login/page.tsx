'use client'


import FormInput from '@/Components/Inputs/formInput';
import { useState } from 'react';
import LoginForm from '../components/loginForm';
import { LogInUserRequest } from '../Services/User';
import { ApiRequest } from '@/Services/ApiRequest';
import { permanentRedirect } from 'next/navigation';
import { appRoute } from '@/Types/appRoutes';


export default function Login() {
    const [fromError, setFormError] = useState(''); 

    async function handleFormSubmit(email: string, password: string ) {
        const apiResult = await ApiRequest(LogInUserRequest, { email: email, password: password }); 

        if (apiResult.ok) {
            const dashboard: appRoute = '/dashboard'; 
            permanentRedirect(dashboard); 
        } else if (apiResult.error === 'Unauthorized'){
            setFormError('Invalid Email Or Password'); 
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