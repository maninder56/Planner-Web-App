'use client'

import styles from '@/app/(login-signup)/components/loginForm.module.css'; 
import FormInput from '@/Components/Inputs/formInput';
import { ValidateEmail } from '@/Utilities/validations';
import Link from 'next/link';

import { FormEvent, useState } from "react";



interface errorInterface {
    email?: string; 
    password?: string; 
}

export default function LoginForm({
    onSubmit, 
    formError, 
}: {
    onSubmit: (email: string, password: string) => Promise<void>; 
    formError?: string; 
}) {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [errors, setErrors] = useState<errorInterface>({}); 
    const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); 

    function validateFormValues(): boolean {
        const newErrors: errorInterface = {}; 

        if (email === '') {
            newErrors.email = 'Email is Required'; 
        } else if (!ValidateEmail(email)) {
            newErrors.email = 'Email is Invalid'; 
        }

        if (password === '') {
            newErrors.password = 'Password is Required'; 
        }

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 
    }

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault(); 
        setButtonsDisabled(true); 

        try {
            if (validateFormValues()) {
                await onSubmit(email, password); 
            }
        } finally {
            setButtonsDisabled(false); 
        }
    }

    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            <header>Log in to continue</header>
            <div className={styles.formError}>{formError}</div>
            <FormInput label='Email' placeholder='Enter your email' maxLength={200} value={email} error={errors.email} type='text'
                setValue={(value) => {
                    setEmail(value); 
                    if (value === '') {
                        setErrors({...errors, email: 'Email is Required'}); 
                    } else {
                        setErrors({...errors, email: undefined}); 
                    }
                }} />
            <FormInput label='Password' placeholder='Enter your password' maxLength={100} value={password} error={errors.password} type='password'
                setValue={(value) => {
                    setPassword(value); 
                    if (value === '') {
                        setErrors({...errors, password: 'Password is Required'}); 
                    } else {
                        setErrors({...errors, password: undefined}); 
                    }
                }} />
            <div className={styles.createAccountLink}>
                <Link href={'/signup'}>Create New account</Link>
            </div>
            <div className={styles.logIn}>
                <button type='submit' className='button red' disabled={buttonsDisabled}>Log in</button>
            </div>
        </form>
    ); 

}