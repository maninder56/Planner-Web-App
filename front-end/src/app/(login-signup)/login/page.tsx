'use client'


import FormInput from '@/Components/Inputs/formInput';
import { useState } from 'react';
import LoginForm from '../components/loginForm';
import { LogInUserRequest } from '../Services/User';
import { ApiRequest } from '@/Services/ApiRequest';

export default function Login() {
    const [fromError, setFormError] = useState(''); 

    async function handleFormSubmit(email: string, password: string ) {
        const apiResult = ApiRequest(LogInUserRequest, { email: email, password: password }); 
    }

    return (
        <div>
            <LoginForm onSubmit={handleFormSubmit} formError={fromError} />
        </div>
    ); 
}